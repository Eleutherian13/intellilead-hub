const CACHE_NAME = "lead-intel-v2";
const API_CACHE_NAME = "lead-intel-api-v1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.json"];

// API endpoints to cache for offline access
const CACHEABLE_API_ROUTES = [
  "/api/leads",
  "/api/companies",
  "/api/dashboard",
  "/api/notifications",
  "/api/sources",
];

// Install — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME && k !== API_CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

// Helper: Check if URL is a cacheable API route
function isCacheableApi(url) {
  return CACHEABLE_API_ROUTES.some((route) => url.includes(route));
}

// Fetch strategy:
// - Static assets: cache first, fallback to network
// - API GET requests: network first, fallback to cached data (stale-while-revalidate)
// - Other requests: network only
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // API requests — network first with offline fallback
  if (request.url.includes("/api/") && isCacheableApi(request.url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Offline: return cached API data
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          // Return a minimal offline JSON response
          return new Response(
            JSON.stringify({
              offline: true,
              message: "You are offline. Showing cached data.",
              data: [],
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        }),
    );
    return;
  }

  // Skip non-cacheable API calls
  if (request.url.includes("/api/")) return;

  // Static assets — network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request)),
  );
});

// Push notification handler
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Lead Intel";
  const options = {
    body: data.message || "New notification",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-72.png",
    tag: data.tag || "lead-alert",
    renotify: true,
    data: { url: data.actionUrl || "/" },
    vibrate: [200, 100, 200],
    actions: [
      { action: "view", title: "View Lead" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "view" || !event.action) {
    const url = event.notification.data?.url || "/";
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // Focus existing window if available
        for (const client of windowClients) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window
        return clients.openWindow(url);
      }),
    );
  }
});

// Background sync for offline actions (future enhancement)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-lead-updates") {
    event.waitUntil(
      // Sync any queued lead status changes when back online
      Promise.resolve(),
    );
  }
});

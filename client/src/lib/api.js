const API_BASE = "/api";

// Get stored token
function getToken() {
  return localStorage.getItem("token");
}

// Generic fetch wrapper with auth
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // Token expired / invalid
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

// ─── Auth ──────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  getMe: () => apiFetch("/auth/me"),

  updateProfile: (data) =>
    apiFetch("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),

  updatePassword: (data) =>
    apiFetch("/auth/password", { method: "PUT", body: JSON.stringify(data) }),
};

// ─── Dashboard ─────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => apiFetch("/dashboard"),
};

// ─── Leads ─────────────────────────────────────────────────
export const leadsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/leads?${query}`);
  },

  getById: (id) => apiFetch(`/leads/${id}`),

  create: (data) =>
    apiFetch("/leads", { method: "POST", body: JSON.stringify(data) }),

  update: (id, data) =>
    apiFetch(`/leads/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  assign: (id, userId, territory) =>
    apiFetch(`/leads/${id}/assign`, {
      method: "PUT",
      body: JSON.stringify({ userId, territory }),
    }),

  giveFeedback: (id, data) =>
    apiFetch(`/leads/${id}/feedback`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id) => apiFetch(`/leads/${id}`, { method: "DELETE" }),
};

// ─── Companies ─────────────────────────────────────────────
export const companiesApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/companies?${query}`);
  },

  getById: (id) => apiFetch(`/companies/${id}`),

  create: (data) =>
    apiFetch("/companies", { method: "POST", body: JSON.stringify(data) }),

  update: (id, data) =>
    apiFetch(`/companies/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id) => apiFetch(`/companies/${id}`, { method: "DELETE" }),
};

// ─── Sources ───────────────────────────────────────────────
export const sourcesApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/sources?${query}`);
  },

  getById: (id) => apiFetch(`/sources/${id}`),

  create: (data) =>
    apiFetch("/sources", { method: "POST", body: JSON.stringify(data) }),

  update: (id, data) =>
    apiFetch(`/sources/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  triggerCrawl: (id) => apiFetch(`/sources/${id}/crawl`, { method: "POST" }),

  delete: (id) => apiFetch(`/sources/${id}`, { method: "DELETE" }),
};

// ─── Notifications ─────────────────────────────────────────
export const notificationsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/notifications?${query}`);
  },

  markRead: (id) => apiFetch(`/notifications/${id}/read`, { method: "PUT" }),

  markAllRead: () => apiFetch("/notifications/read-all", { method: "PUT" }),

  delete: (id) => apiFetch(`/notifications/${id}`, { method: "DELETE" }),
};

// ─── Analytics ─────────────────────────────────────────────
export const analyticsApi = {
  getAnalytics: (period = "30d") => apiFetch(`/analytics?period=${period}`),
};

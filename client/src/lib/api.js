const API_BASE = "/api";

// Generic fetch wrapper
async function apiFetch(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }
  return data;
}

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

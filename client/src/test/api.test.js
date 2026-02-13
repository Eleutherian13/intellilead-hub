import { describe, it, expect, beforeAll, afterAll } from "vitest";

// Mock API base
const API_BASE = "http://localhost:5000/api";

describe("Health Check Endpoints", () => {
  it("should return 200 from /api/health", async () => {
    const response = await fetch(`${API_BASE}/health`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("timestamp");
    expect(data).toHaveProperty("uptime");
  });

  it("should return OK status from /api/health", async () => {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    expect(data.status).toBe("OK");
  });

  it("should return 200 from /api/live", async () => {
    const response = await fetch(`${API_BASE}/live`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.alive).toBe(true);
  });
});

describe("API Root Endpoint", () => {
  it("should return API information from /api", async () => {
    const response = await fetch(`${API_BASE}`);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty("message");
    expect(data).toHaveProperty("version");
    expect(data).toHaveProperty("endpoints");
    expect(Array.isArray(data.endpoints)).toBe(true);
  });
});

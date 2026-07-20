// All calls go to the Spring Boot backend. `credentials: "include"` is the key line:
// it tells the browser to SEND and RECEIVE the httpOnly auth cookie on every request.
const BASE = "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  constructor(status: number) {
    super(`Request failed with status ${status}`);
    this.status = status;
  }
}

async function request<T>(path: string, options: { method?: string; body?: string } = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: options.body,
  });

  if (!res.ok) {
    throw new ApiError(res.status);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export interface MeResponse {
  email: string;
}
export interface LoginResponse {
  email: string;
}

export function register(email: string, password: string): Promise<void> {
  return request("/api/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function login(email: string, password: string): Promise<LoginResponse> {
  return request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function me(): Promise<MeResponse> {
  return request("/api/me");
}

export function logout(): Promise<void> {
  return request("/api/auth/logout", { method: "POST" });
}

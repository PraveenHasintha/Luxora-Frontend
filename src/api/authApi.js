// Luxora-Frontend/src/api/authApi.js
import { request, setAccessToken } from "./httpClient";

/**
 * Expected backend:
 * POST /api/auth/register -> user
 * POST /api/auth/login    -> { access_token, token_type, user }
 * GET  /api/auth/me       -> user
 */

export function registerUser({ name, email, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data?.access_token) setAccessToken(data.access_token);
  return data;
}

export function fetchMe() {
  return request("/auth/me", { method: "GET" });
}

export function logoutUser() {
  setAccessToken(null);
}

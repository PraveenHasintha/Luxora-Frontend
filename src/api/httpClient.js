// Luxora-Frontend/src/api/httpClient.js

/**
 * Luxora HTTP Client
 * - Base URL via REACT_APP_API_BASE_URL or defaults to http://localhost:8000/api
 * - Auto adds Authorization: Bearer <token>
 * - Normalizes FastAPI errors (usually { detail: "..." })
 */

const DEFAULT_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL;

const TOKEN_KEY = "luxora_access_token";

export function setAccessToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function errorMessage(data, fallback) {
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.message === "string") return data.message;
  return fallback;
}

export async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const fallback = `Request failed (${res.status})`;
    const msg = isJson ? errorMessage(data, fallback) : (data || fallback);
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

// Luxora-Frontend/src/api/roomsApi.js
import { request } from "./httpClient";

export function getRooms() {
  return request("/rooms", { method: "GET" });
}

export function initSampleRooms() {
  return request("/rooms/init-sample-data", { method: "POST" });
}

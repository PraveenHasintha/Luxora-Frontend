// Luxora-Frontend/src/api/bookingsApi.js
import { request } from "./httpClient";

/**
 * Notes:
 * - GET /bookings returns items with:
 *   { id, booking_id, room_type, check_in, check_out, total_price, status, ... }
 *
 * - PUT /bookings/{booking_id}/cancel in your backend expects the INTERNAL numeric id
 *   (Booking.id), not the booking_id string (LUXxxxxxx).
 */

export function getBookings() {
  return request("/bookings", { method: "GET" });
}

export function checkAvailability({ room_type, check_in, check_out }) {
  return request("/bookings/check-availability", {
    method: "POST",
    body: JSON.stringify({ room_type, check_in, check_out }),
  });
}

export function createBooking(payload) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function cancelBooking(bookingIdNumber) {
  return request(`/bookings/${bookingIdNumber}/cancel`, { method: "PUT" });
}

// Luxora-Frontend/src/context/BookingContext.js
import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  getBookings,
  createBooking as apiCreateBooking,
  cancelBooking as apiCancelBooking,
  checkAvailability as apiCheckAvailability,
} from "../api/bookingsApi";

export const BookingContext = createContext(null);

function normalizeBookingPayload(input) {
  // Accepts both old frontend keys and new backend keys
  const room_type = input.room_type ?? input.roomType ?? input.type;
  const check_in = input.check_in ?? input.checkIn;
  const check_out = input.check_out ?? input.checkOut;

  return {
    name: input.name,
    email: input.email,
    phone: input.phone,
    room_type,
    check_in,
    check_out,
    guests: Number(input.guests),
    special_requests: input.special_requests ?? input.specialRequests ?? "",
  };
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const refreshBookings = async () => {
    setBookingsError("");
    setIsBookingsLoading(true);
    try {
      const data = await getBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setBookingsError(err?.message || "Failed to load bookings");
    } finally {
      setIsBookingsLoading(false);
    }
  };

  useEffect(() => {
    refreshBookings();
  }, []);

  // Replaces old addBooking(localStorage)
  const addBooking = async (bookingData) => {
    setBookingsError("");
    const payload = normalizeBookingPayload(bookingData);

    try {
      const res = await apiCreateBooking(payload);
      // res: { message, booking }
      const created = res?.booking;

      if (created) {
        setBookings((prev) => [created, ...prev]);
      } else {
        // fallback: reload
        await refreshBookings();
      }

      return res;
    } catch (err) {
      setBookingsError(err?.message || "Failed to create booking");
      throw err;
    }
  };

  // Replaces old removeBooking(localStorage)
  const removeBooking = async (bookingId) => {
    setBookingsError("");
    try {
      await apiCancelBooking(bookingId);

      // Update local state
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );

      return true;
    } catch (err) {
      setBookingsError(err?.message || "Failed to cancel booking");
      throw err;
    }
  };

  const getBookingById = (bookingId) => {
    // backend field name: booking_id
    return bookings.find((b) => b.booking_id === bookingId);
  };

  const clearAllBookings = async () => {
    // We DO NOT support deleting everything in production.
    // This method stays for compatibility but just refreshes.
    await refreshBookings();
  };

  const checkAvailability = async (roomTypeOrPayload, checkIn, checkOut) => {
    // Support:
    // checkAvailability({ room_type, check_in, check_out })
    // OR checkAvailability(roomType, checkIn, checkOut)
    const payload =
      typeof roomTypeOrPayload === "object"
        ? roomTypeOrPayload
        : {
            room_type: roomTypeOrPayload,
            check_in: checkIn,
            check_out: checkOut,
          };

    // Also accept camelCase inputs
    const normalized = {
      room_type: payload.room_type ?? payload.roomType,
      check_in: payload.check_in ?? payload.checkIn,
      check_out: payload.check_out ?? payload.checkOut,
    };

    return apiCheckAvailability(normalized);
  };

  const contextValue = useMemo(
    () => ({
      bookings,
      totalBookings: bookings.length,

      isBookingsLoading,
      bookingsError,

      refreshBookings,
      addBooking, // now async
      removeBooking, // now async (cancels booking)
      getBookingById,
      clearAllBookings,
      checkAvailability,
    }),
    [bookings, isBookingsLoading, bookingsError]
  );

  return <BookingContext.Provider value={contextValue}>{children}</BookingContext.Provider>;
}

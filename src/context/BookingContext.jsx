// Luxora-Frontend/src/context/BookingContext.jsx
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  getBookings,
  createBooking as apiCreateBooking,
  cancelBooking as apiCancelBooking,
  checkAvailability as apiCheckAvailability,
} from "../api/bookingsApi";

export const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [isBookingsLoading, setIsBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const refreshBookings = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  const addBooking = useCallback(
    async (payload) => {
      setBookingsError("");
      try {
        // Backend create response shape differs from the GET shape,
        // so we create, then refresh to keep UI consistent.
        const res = await apiCreateBooking(payload);
        await refreshBookings();
        return res;
      } catch (err) {
        setBookingsError(err?.message || "Failed to create booking");
        throw err;
      }
    },
    [refreshBookings]
  );

  const cancelBooking = useCallback(
    async (bookingIdNumber) => {
      setBookingsError("");
      try {
        await apiCancelBooking(bookingIdNumber);
        await refreshBookings();
        return true;
      } catch (err) {
        setBookingsError(err?.message || "Failed to cancel booking");
        throw err;
      }
    },
    [refreshBookings]
  );

  const checkAvailability = useCallback(async ({ room_type, check_in, check_out }) => {
    return apiCheckAvailability({ room_type, check_in, check_out });
  }, []);

  const value = useMemo(
    () => ({
      bookings,
      totalBookings: bookings.length,
      isBookingsLoading,
      bookingsError,
      refreshBookings,
      addBooking,
      cancelBooking,
      checkAvailability,
    }),
    [bookings, isBookingsLoading, bookingsError, refreshBookings, addBooking, cancelBooking, checkAvailability]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

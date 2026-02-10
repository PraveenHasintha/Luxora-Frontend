// Luxora-Frontend/src/pages/Profile.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { BookingContext } from "../context/BookingContext.jsx";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const bookingCtx = useContext(BookingContext);

  const bookingsCount = Array.isArray(bookingCtx?.bookings) ? bookingCtx.bookings.length : 0;

  return (
    <div className="page-container" style={{ textAlign: "left" }}>
      <h1 style={{ marginTop: 0 }}>Profile</h1>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <div>
          <strong>Name:</strong> {user?.name || "Luxora User"}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || "user@luxora.local"}
        </div>
        <div>
          <strong>Total Bookings:</strong> {bookingsCount}
        </div>
      </div>

      <hr style={{ margin: "18px 0", border: 0, borderTop: "1px solid rgba(0,0,0,0.08)" }} />

      <p style={{ margin: 0, color: "#6b7280", fontWeight: 600 }}>
        Tip: This page is ready for upgrades like password change, profile photo, and booking history filters.
      </p>
    </div>
  );
}

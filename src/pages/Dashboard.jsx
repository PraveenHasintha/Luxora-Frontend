// Luxora-Frontend/src/pages/Dashboard.jsx
import React, { useContext, useMemo, useState } from "react";
import "../styles/dashboard.css";
import { BookingContext } from "../context/BookingContext.jsx";

/**
 * Dashboard uses backend bookings.
 * Cancelling uses numeric DB id (booking.id).
 */
export default function Dashboard() {
  // ✅ Hooks unconditionally
  const ctx = useContext(BookingContext);
  const hasCtx = Boolean(ctx);

  const bookings = ctx?.bookings;
  const cancelBooking = ctx?.cancelBooking;
  const refreshBookings = ctx?.refreshBookings;
  const isBookingsLoading = ctx?.isBookingsLoading;
  const bookingsError = ctx?.bookingsError;

  const [roomTypeFilter, setRoomTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const safeBookings = useMemo(() => (Array.isArray(bookings) ? bookings : []), [bookings]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  const fmtDate = (v) => {
    if (!v) return "—";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString("en-GB");
  };

  const normalize = (s) => String(s || "").toLowerCase().trim();

  const roomTypes = useMemo(() => {
    const set = new Set();
    safeBookings.forEach((b) => b.room_type && set.add(b.room_type));
    return ["All", ...Array.from(set)];
  }, [safeBookings]);

  const filtered = useMemo(() => {
    const q = normalize(query);

    return safeBookings.filter((b) => {
      const okType = roomTypeFilter === "All" ? true : b.room_type === roomTypeFilter;
      const okStatus =
        statusFilter === "All"
          ? true
          : normalize(b.status) === normalize(statusFilter);

      const okQuery =
        !q ||
        normalize(b.booking_id).includes(q) ||
        normalize(b.name).includes(q) ||
        normalize(b.email).includes(q) ||
        normalize(b.room_type).includes(q);

      return okType && okStatus && okQuery;
    });
  }, [safeBookings, roomTypeFilter, statusFilter, query]);

  const totals = useMemo(() => {
    const total = safeBookings.length;
    const confirmed = safeBookings.filter((b) => normalize(b.status) === "confirmed").length;
    const cancelled = safeBookings.filter((b) => normalize(b.status) === "cancelled").length;

    const revenue = safeBookings.reduce((sum, b) => {
      if (normalize(b.status) !== "confirmed") return sum;
      return sum + (Number(b.total_price) || 0);
    }, 0);

    const users = new Set();
    safeBookings.forEach((b) => b.email && users.add(b.email));

    return { total, confirmed, cancelled, revenue, users: users.size };
  }, [safeBookings]);

  const statusClass = (status) => {
    const s = normalize(status);
    if (s === "confirmed") return "status-pill confirmed";
    if (s === "cancelled") return "status-pill cancelled";
    if (s === "pending") return "status-pill pending";
    return "status-pill";
  };

  const onCancel = async (bookingRow) => {
    if (!cancelBooking || !refreshBookings) {
      alert("Booking system is not ready.");
      return;
    }
    if (!bookingRow?.id) return;

    if (normalize(bookingRow.status) === "cancelled") {
      alert("This booking is already cancelled.");
      return;
    }
    if (!window.confirm("Cancel this booking?")) return;

    try {
      setLoadingId(bookingRow.id);
      await cancelBooking(bookingRow.id);
      await refreshBookings();
    } catch (err) {
      alert(err?.message || "Failed to cancel booking");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Safe conditional return AFTER hooks
  if (!hasCtx) {
    return (
      <div className="page-container">
        BookingContext is not available. Make sure imports use <b>../context/BookingContext.jsx</b> and App is wrapped by
        BookingProvider.
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero__overlay" />
        <div className="dashboard-hero__content">
          <h1>Dashboard</h1>
          <p>Track bookings, revenue, and customer activity — all in one place.</p>
          <div className="dashboard-hero__meta">
            <span>Real-time</span>
            <span>Backend powered</span>
            <span>Client-ready UI</span>
          </div>
        </div>
      </section>

      <section className="dashboard-shell">
        {isBookingsLoading && <p className="muted">Loading bookings…</p>}
        {bookingsError && <div className="alert alert-error">{bookingsError}</div>}

        <div className="dash-grid">
          <div className="dash-card">
            <h3>Total Bookings</h3>
            <p className="dash-number">{totals.total}</p>
            <div className="dash-sub">All statuses</div>
          </div>

          <div className="dash-card">
            <h3>Confirmed</h3>
            <p className="dash-number">{totals.confirmed}</p>
            <div className="dash-sub">Active revenue</div>
          </div>

          <div className="dash-card">
            <h3>Cancelled</h3>
            <p className="dash-number">{totals.cancelled}</p>
            <div className="dash-sub">Churn indicator</div>
          </div>

          <div className="dash-card">
            <h3>Total Revenue</h3>
            <p className="dash-number">{formatPrice(totals.revenue)}</p>
            <div className="dash-sub">Confirmed only</div>
          </div>

          <div className="dash-card">
            <h3>Users</h3>
            <p className="dash-number">{totals.users}</p>
            <div className="dash-sub">Unique emails</div>
          </div>

          <div className="dash-card">
            <h3>Showing</h3>
            <p className="dash-number">{filtered.length}</p>
            <div className="dash-sub">Filtered rows</div>
          </div>
        </div>

        <div className="dash-controls">
          <div className="control">
            <label>Room Type</label>
            <select value={roomTypeFilter} onChange={(e) => setRoomTypeFilter(e.target.value)}>
              {roomTypes.map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t}
                </option>
              ))}
            </select>
          </div>

          <div className="control">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="control wide">
            <label>Search</label>
            <input
              className="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by booking id, name, email, room type…"
            />
          </div>

          <div className="control actions">
            <button className="btn" type="button" onClick={() => refreshBookings?.()}>
              Refresh
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Room Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((b) => {
                const isCancelled = normalize(b.status) === "cancelled";
                return (
                  <tr key={b.id ?? b.booking_id}>
                    <td className="mono">{b.booking_id || "—"}</td>
                    <td>{b.name || "—"}</td>
                    <td>{b.email || "—"}</td>
                    <td>{b.room_type || "—"}</td>
                    <td>{fmtDate(b.check_in)}</td>
                    <td>{fmtDate(b.check_out)}</td>
                    <td>{b.guests || 1}</td>
                    <td>{formatPrice(b.total_price)}</td>
                    <td>
                      <span className={statusClass(b.status)}>{b.status || "unknown"}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => onCancel(b)}
                        disabled={loadingId === b.id || isCancelled}
                        title={isCancelled ? "Already cancelled" : "Cancel booking"}
                      >
                        {loadingId === b.id ? "..." : isCancelled ? "Cancelled" : "Cancel"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: 18 }}>
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

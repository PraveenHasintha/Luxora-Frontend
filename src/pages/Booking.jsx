import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/booking.css";

import { getRooms, initSampleRooms } from "../api/roomsApi";
import { BookingContext } from "../context/BookingContext.jsx";

/**
 * Booking flow:
 * 1) Choose room
 * 2) Select dates (availability via backend)
 * 3) Guest details (create booking via backend)
 * 4) Confirmation
 */
export default function Booking() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingCtx = useContext(BookingContext);
  const hasCtx = Boolean(bookingCtx);

  const addBooking = bookingCtx?.addBooking;
  const checkAvailability = bookingCtx?.checkAvailability;

  const isDev = process.env.NODE_ENV !== "production";

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState("");

  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [typeFilter, setTypeFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [availability, setAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
  });

  const todayISO = useMemo(() => new Date().toISOString().split("T")[0], []);
  const fallbackImage =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80";

  const safeImage = (url) => {
    if (url && String(url).trim().length > 0) return url;
    return fallbackImage;
  };

  const parseAmenities = (amenities) => {
    if (!amenities) return [];
    if (Array.isArray(amenities)) return amenities;
    return String(amenities)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const nights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const a = new Date(formData.checkIn);
    const b = new Date(formData.checkOut);
    const diff = b.getTime() - a.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    return days > 0 ? days : 0;
  }, [formData.checkIn, formData.checkOut]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

  const totalPrice = useMemo(() => {
    if (availability?.available && availability?.room?.totalPrice != null) return availability.room.totalPrice;
    if (selectedRoom && nights > 0) return Number(selectedRoom.price || 0) * nights;
    return 0;
  }, [availability, selectedRoom, nights]);

  const roomTypes = useMemo(() => {
    const s = new Set();
    (rooms || []).forEach((r) => r.room_type && s.add(r.room_type));
    return ["All", ...Array.from(s)];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    let list = Array.isArray(rooms) ? rooms : [];
    const q = query.trim().toLowerCase();

    if (typeFilter !== "All") list = list.filter((r) => r.room_type === typeFilter);

    if (q) {
      list = list.filter((r) => {
        const name = String(r?.name || "").toLowerCase();
        const desc = String(r?.description || "").toLowerCase();
        const type = String(r?.room_type || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || type.includes(q);
      });
    }

    const cloned = [...list];
    if (sortBy === "price_asc") cloned.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    if (sortBy === "price_desc") cloned.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));

    return cloned;
  }, [rooms, typeFilter, query, sortBy]);

  const loadRooms = async () => {
    setRoomsError("");
    setRoomsLoading(true);
    try {
      const data = await getRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setRoomsError(err?.message || "Failed to load rooms");
      setRooms([]);
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preselect from ?roomType=...
  useEffect(() => {
    if (roomsLoading) return;
    if (!rooms?.length) return;

    const wanted = searchParams.get("roomType");
    if (!wanted) return;

    // If user already picked something, don't override.
    if (selectedRoom) return;

    const match = rooms.find((r) => String(r?.room_type || "") === String(wanted));
    if (match) {
      setSelectedRoom(match);
      setStep(2);
      setTypeFilter(match.room_type);
    } else {
      // At least filter list to make it easy if room type exists with different casing
      setTypeFilter("All");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomsLoading, rooms, searchParams]);

  const handleSeed = async () => {
    setRoomsError("");
    setRoomsLoading(true);
    try {
      await initSampleRooms();
      await loadRooms();
    } catch (err) {
      setRoomsError(err?.message || "Failed to create sample rooms");
      setRoomsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "guests") {
      setFormData((p) => ({ ...p, guests: Number(value) }));
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setStep(2);

    // Reset date/availability state when room changes
    setAvailability(null);
    setAvailabilityError("");
    setSubmitError("");
    setReceipt(null);
  };

  const resetAll = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      specialRequests: "",
    });
    setSelectedRoom(null);
    setAvailability(null);
    setAvailabilityError("");
    setSubmitError("");
    setReceipt(null);
    setStep(1);
  };

  const canGoStep2 = Boolean(selectedRoom);
  const canGoStep3 = Boolean(availability?.available) && nights > 0;
  const canGoStep4 = Boolean(receipt);

  const goStep = (n) => {
    if (n === 1) return setStep(1);
    if (n === 2 && canGoStep2) return setStep(2);
    if (n === 3 && canGoStep3) return setStep(3);
    if (n === 4 && canGoStep4) return setStep(4);
  };

  // Availability check with small debounce
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setAvailability(null);
      setAvailabilityError("");

      if (!checkAvailability) return;
      if (!selectedRoom) return;

      if (!formData.checkIn || !formData.checkOut) return;
      if (nights <= 0) return;

      const guests = Number(formData.guests || 1);
      if (selectedRoom.max_guests && guests > selectedRoom.max_guests) {
        setAvailabilityError(`Max guests for this room is ${selectedRoom.max_guests}`);
        return;
      }

      setAvailabilityLoading(true);
      try {
        const res = await checkAvailability({
          room_type: selectedRoom.room_type,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
        });
        if (!cancelled) setAvailability(res);
      } catch (err) {
        if (!cancelled) setAvailabilityError(err?.message || "Availability check failed");
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [checkAvailability, selectedRoom, formData.checkIn, formData.checkOut, formData.guests, nights]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!addBooking) {
      setSubmitError("Booking system is not ready. Please try again later.");
      return;
    }
    if (!selectedRoom) {
      setSubmitError("Please select a room first.");
      return;
    }
    if (!availability?.available || nights <= 0) {
      setSubmitError("Please choose valid dates. This room is not available for the selected range.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        room_type: selectedRoom.room_type,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
        guests: Number(formData.guests || 1),
        special_requests: formData.specialRequests || "",
      };

      const res = await addBooking(payload);

      const bookingId =
        res?.booking?.bookingId ||
        res?.booking_id ||
        res?.id ||
        "Created";

      setReceipt({
        bookingId,
        roomName: selectedRoom.name,
        roomType: selectedRoom.room_type,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: Number(formData.guests || 1),
        total: totalPrice,
      });

      setStep(4);
    } catch (err) {
      setSubmitError(err?.message || "Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe conditional return AFTER hooks
  if (!hasCtx) {
    return (
      <div className="page-container">
        Booking system is not available. Please ensure the app is wrapped with <b>BookingProvider</b>.
      </div>
    );
  }

  return (
    <div className="booking-page">
      <section className="booking-hero">
        <div className="booking-hero__overlay" />
        <div className="booking-hero__content">
          <span className="booking-hero__pill">Secure booking • Instant availability</span>
          <h1>Complete your reservation</h1>
          <p>Choose a room, select dates, and confirm your booking in a few simple steps.</p>

          <div className="booking-hero__meta">
            <span>Fast confirmation</span>
            <span>Premium stays</span>
            <span>Trusted experience</span>
          </div>
        </div>
      </section>

      <section className="booking-shell">
        {/* Steps */}
        <div className="booking-steps" role="navigation" aria-label="Booking steps">
          <button type="button" className={`step ${step === 1 ? "active" : ""}`} onClick={() => goStep(1)}>
            <span className="step-number">1</span>
            <span className="step-title">Choose Room</span>
          </button>

          <button
            type="button"
            className={`step ${step === 2 ? "active" : ""} ${canGoStep2 ? "" : "disabled"}`}
            onClick={() => goStep(2)}
            disabled={!canGoStep2}
          >
            <span className="step-number">2</span>
            <span className="step-title">Select Dates</span>
          </button>

          <button
            type="button"
            className={`step ${step === 3 ? "active" : ""} ${canGoStep3 ? "" : "disabled"}`}
            onClick={() => goStep(3)}
            disabled={!canGoStep3}
          >
            <span className="step-number">3</span>
            <span className="step-title">Guest Details</span>
          </button>

          <button
            type="button"
            className={`step ${step === 4 ? "active" : ""} ${canGoStep4 ? "" : "disabled"}`}
            onClick={() => goStep(4)}
            disabled={!canGoStep4}
          >
            <span className="step-number">4</span>
            <span className="step-title">Confirmed</span>
          </button>
        </div>

        <div className="booking-grid">
          {/* Main */}
          <div className="booking-main">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Choose a room</h2>
                    <p className="muted">Pick a room to continue. You can search and filter for faster selection.</p>
                  </div>

                  <div className="actions">
                    <button className="btn" type="button" onClick={loadRooms} disabled={roomsLoading}>
                      Refresh
                    </button>
                    {isDev && (
                      <button className="btn btn-primary" type="button" onClick={handleSeed} disabled={roomsLoading}>
                        Create Sample Rooms
                      </button>
                    )}
                  </div>
                </div>

                <div className="booking-filters">
                  <label className="filter-field">
                    Room Type
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      disabled={roomsLoading}
                    >
                      {roomTypes.map((t) => (
                        <option key={t} value={t}>
                          {t === "All" ? "All Types" : t}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="filter-field filter-field--search">
                    Search
                    <input
                      className="filter-search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search rooms…"
                      disabled={roomsLoading}
                    />
                  </label>

                  <label className="filter-field">
                    Sort
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} disabled={roomsLoading}>
                      <option value="recommended">Recommended</option>
                      <option value="price_asc">Price: Low → High</option>
                      <option value="price_desc">Price: High → Low</option>
                    </select>
                  </label>
                </div>

                {roomsError && <div className="alert alert-error">{roomsError}</div>}

                {roomsLoading && (
                  <div className="booking-skeleton-grid" aria-label="Loading rooms">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div className="booking-skeleton" key={i} />
                    ))}
                  </div>
                )}

                {!roomsLoading && filteredRooms.length === 0 && (
                  <div className="empty-state">
                    <h3>No rooms found</h3>
                    <p>Try a different filter or search keyword.</p>
                    <div className="empty-actions">
                      <button type="button" className="btn btn-outline" onClick={() => { setTypeFilter("All"); setQuery(""); setSortBy("recommended"); }}>
                        Clear Filters
                      </button>
                    </div>
                  </div>
                )}

                {!roomsLoading && filteredRooms.length > 0 && (
                  <div className="cards-grid">
                    {filteredRooms.map((room) => {
                      const amenities = parseAmenities(room.amenities).slice(0, 6);
                      const isSelected = selectedRoom?.id === room.id;

                      return (
                        <button
                          key={room.id}
                          className={`room-card-btn ${isSelected ? "selected" : ""}`}
                          onClick={() => handleSelectRoom(room)}
                          type="button"
                          aria-label={`Select room ${room.name}`}
                        >
                          <div className="room-card">
                            <div className="room-card__image">
                              <img
                                src={safeImage(room.image_url)}
                                alt={room.name}
                                loading="lazy"
                                onError={(e) => (e.currentTarget.src = fallbackImage)}
                              />
                              <span className="badge">{room.room_type}</span>
                              <span className="price-float">{formatPrice(room.price)} / night</span>
                            </div>

                            <div className="room-card__body">
                              <div className="room-title-row">
                                <h3>{room.name}</h3>
                                <span className="pill">
                                  Max {room.max_guests || 1} • {room.total_rooms || 0} rooms
                                </span>
                              </div>

                              <p className="desc">{room.description}</p>

                              {amenities.length > 0 && (
                                <div className="chips">
                                  {amenities.map((a, idx) => (
                                    <span className="chip" key={idx}>
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <div className="select-row">
                                <span className="select-hint">{isSelected ? "Selected" : "Select this room"}</span>
                                <span className="select-arrow">→</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && selectedRoom && (
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Select dates</h2>
                    <p className="muted">Choose check-in and check-out. We’ll confirm availability instantly.</p>
                  </div>

                  <div className="actions">
                    <button className="btn" type="button" onClick={() => goStep(1)}>
                      ← Back
                    </button>
                  </div>
                </div>

                <div className="summary-card">
                  <img src={safeImage(selectedRoom.image_url)} alt={selectedRoom.name} onError={(e) => (e.currentTarget.src = fallbackImage)} />
                  <div>
                    <h3>{selectedRoom.name}</h3>
                    <p className="muted">Type: {selectedRoom.room_type}</p>
                    <p className="summary-price">
                      {formatPrice(selectedRoom.price)} <span>/night</span>
                    </p>
                  </div>
                </div>

                <div className="date-grid">
                  <label className="field">
                    Check-in
                    <input
                      className="input"
                      type="date"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={todayISO}
                    />
                  </label>

                  <label className="field">
                    Check-out
                    <input
                      className="input"
                      type="date"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      min={formData.checkIn || todayISO}
                    />
                  </label>

                  <label className="field">
                    Guests
                    <select className="input" name="guests" value={formData.guests} onChange={handleChange}>
                      {Array.from({ length: Math.min(10, selectedRoom.max_guests || 4) }, (_, i) => i + 1).map((g) => (
                        <option key={g} value={g}>
                          {g} {g === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {formData.checkIn && formData.checkOut && nights <= 0 && (
                  <div className="notice bad">Check-out date must be after check-in.</div>
                )}

                {availabilityLoading && <div className="notice">Checking availability…</div>}
                {availabilityError && <div className="notice bad">{availabilityError}</div>}

                {availability?.available && (
                  <div className="totals">
                    <div className="totals-row">
                      <span>{selectedRoom.name}</span>
                      <span>
                        {formatPrice(selectedRoom.price)} × {availability?.room?.totalNights ?? nights} nights
                      </span>
                    </div>

                    <div className="totals-total">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>

                    <div className="notice ok">
                      Available ✅
                      {availability?.room?.availableRooms != null ? ` • ${availability.room.availableRooms} left` : ""}
                    </div>
                  </div>
                )}

                {availability && !availability.available && !availabilityLoading && (
                  <div className="notice bad">Not available for selected dates. Try different dates.</div>
                )}

                <div className="actions bottom">
                  <button className="btn" type="button" onClick={() => goStep(1)}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" type="button" onClick={() => goStep(3)} disabled={!canGoStep3}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && selectedRoom && (
              <div className="panel">
                <div className="panel-head">
                  <div>
                    <h2>Guest details</h2>
                    <p className="muted">Enter details below to confirm your reservation.</p>
                  </div>

                  <div className="actions">
                    <button className="btn" type="button" onClick={() => goStep(2)}>
                      ← Back
                    </button>
                  </div>
                </div>

                {submitError && <div className="notice bad">{submitError}</div>}

                <form onSubmit={handleSubmit} className="form">
                  <div className="form-row">
                    <label className="field">
                      Full Name *
                      <input className="input" name="name" value={formData.name} onChange={handleChange} required />
                    </label>

                    <label className="field">
                      Email *
                      <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>
                  </div>

                  <div className="form-row">
                    <label className="field" style={{ flex: 1 }}>
                      Phone *
                      <input className="input" name="phone" value={formData.phone} onChange={handleChange} required />
                    </label>
                  </div>

                  <label className="field">
                    Special Requests (optional)
                    <textarea
                      className="textarea"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Dietary preferences, late check-in, extra pillows…"
                    />
                  </label>

                  <div className="totals">
                    <div className="totals-row">
                      <span>{selectedRoom.room_type}</span>
                      <span>
                        {formData.checkIn || "—"} → {formData.checkOut || "—"} • {nights} nights • {formData.guests} guests
                      </span>
                    </div>
                    <div className="totals-total">
                      <span>Total</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <div className="actions bottom">
                    <button className="btn btn-outline" type="button" onClick={resetAll} disabled={isSubmitting}>
                      Start Over
                    </button>
                    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Confirming…" : "Confirm Booking"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && receipt && (
              <div className="panel">
                <div className="confirm">
                  <div className="confirm-badge">Booking Confirmed</div>
                  <h2>Thank you — your reservation is confirmed.</h2>

                  <div className="confirm-card">
                    <div className="confirm-row">
                      <span>Booking ID</span>
                      <span className="mono">{receipt.bookingId}</span>
                    </div>
                    <div className="confirm-row">
                      <span>Room</span>
                      <span>{receipt.roomName} ({receipt.roomType})</span>
                    </div>
                    <div className="confirm-row">
                      <span>Dates</span>
                      <span>{receipt.checkIn} → {receipt.checkOut}</span>
                    </div>
                    <div className="confirm-row">
                      <span>Guests</span>
                      <span>{receipt.guests}</span>
                    </div>
                    <div className="confirm-row total">
                      <span>Total</span>
                      <span>{formatPrice(receipt.total)}</span>
                    </div>
                  </div>

                  <div className="actions bottom">
                    <button className="btn btn-outline" type="button" onClick={resetAll}>
                      Make another booking
                    </button>
                    <button className="btn btn-primary" type="button" onClick={() => navigate("/dashboard")}>
                      Go to Dashboard →
                    </button>
                  </div>

                  <p className="muted" style={{ marginTop: 12 }}>
                    You can view and manage your booking anytime from your dashboard.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Side summary */}
          <aside className="booking-side">
            <div className="side-card">
              <h3>Reservation summary</h3>

              {!selectedRoom ? (
                <p className="muted">Select a room to begin.</p>
              ) : (
                <>
                  <div className="side-room">
                    <img src={safeImage(selectedRoom.image_url)} alt={selectedRoom.name} onError={(e) => (e.currentTarget.src = fallbackImage)} />
                    <div>
                      <div className="side-room-name">{selectedRoom.name}</div>
                      <div className="muted small">Type: {selectedRoom.room_type}</div>
                    </div>
                  </div>

                  <div className="side-row">
                    <span>Check-in</span>
                    <span>{formData.checkIn || "—"}</span>
                  </div>
                  <div className="side-row">
                    <span>Check-out</span>
                    <span>{formData.checkOut || "—"}</span>
                  </div>
                  <div className="side-row">
                    <span>Guests</span>
                    <span>{formData.guests || 1}</span>
                  </div>
                  <div className="side-row">
                    <span>Nights</span>
                    <span>{nights || 0}</span>
                  </div>

                  <div className="side-total">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>

                  {availabilityLoading && <div className="side-note">Checking availability…</div>}
                  {availability?.available && <div className="side-note ok">Available ✅</div>}
                  {availability && !availability.available && <div className="side-note bad">Not available ❌</div>}
                </>
              )}
            </div>

            <div className="side-card side-tip">
              <h4>Need help?</h4>
              <p>Call +94 77 000 0000 or email support@luxora.com</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

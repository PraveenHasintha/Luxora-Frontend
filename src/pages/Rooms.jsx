import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/rooms.css";
import { getRooms, initSampleRooms } from "../api/roomsApi";

export default function Rooms() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const isDev = process.env.NODE_ENV !== "production";

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price || 0));

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

  // demo-friendly rating (stable)
  const getRating = (room) => {
    const base = 4.6;
    const bump = (Number(room?.id || 1) % 5) * 0.1;
    return (base + bump).toFixed(1);
  };

  const getBadge = (room) => {
    const t = String(room?.room_type || "").toLowerCase();
    if (t.includes("suite")) return { text: "Best Seller", tone: "gold" };
    if (t.includes("deluxe")) return { text: "Top Rated", tone: "blue" };
    return { text: "Limited Offer", tone: "dark" };
  };

  const getOriginalPrice = (price) => Math.round(Number(price || 0) * 1.15);

  const loadRooms = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load rooms");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSeed = async () => {
    setError("");
    setActionLoading(true);
    try {
      await initSampleRooms();
      await loadRooms();
    } catch (err) {
      setError(err?.message || "Failed to create sample rooms");
    } finally {
      setActionLoading(false);
    }
  };

  const roomTypes = useMemo(() => {
    const set = new Set();
    (rooms || []).forEach((r) => r.room_type && set.add(r.room_type));
    return ["All", ...Array.from(set)];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = Array.isArray(rooms) ? rooms : [];

    // type filter
    if (typeFilter !== "All") {
      list = list.filter((r) => r.room_type === typeFilter);
    }

    // search
    if (q) {
      list = list.filter((r) => {
        const name = String(r?.name || "").toLowerCase();
        const desc = String(r?.description || "").toLowerCase();
        const type = String(r?.room_type || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || type.includes(q);
      });
    }

    // sort
    const cloned = [...list];
    if (sortBy === "price_asc") cloned.sort((a, b) => Number(a?.price || 0) - Number(b?.price || 0));
    if (sortBy === "price_desc") cloned.sort((a, b) => Number(b?.price || 0) - Number(a?.price || 0));
    if (sortBy === "rating_desc")
      cloned.sort((a, b) => Number(getRating(b)) - Number(getRating(a)));

    return cloned;
  }, [rooms, typeFilter, query, sortBy]);

  const totalCount = Array.isArray(rooms) ? rooms.length : 0;
  const showingCount = Array.isArray(filteredRooms) ? filteredRooms.length : 0;

  const goToBooking = (room) => {
    navigate(`/booking?roomType=${encodeURIComponent(room?.room_type || "")}`);
  };

  const clearFilters = () => {
    setTypeFilter("All");
    setQuery("");
    setSortBy("recommended");
  };

  return (
    <div className="rooms-page">
      {/* Hero */}
      <section className="rooms-hero">
        <div className="rooms-hero__overlay" />
        <div className="rooms-hero__content">
          <span className="rooms-hero__pill">Luxury stays • Curated comfort</span>
          <h1>Rooms & Suites</h1>
          <p>
            Explore handpicked rooms designed for comfort and elegance. Filter by type, compare options, and book instantly.
          </p>

          <div className="rooms-hero__meta">
            <span>Premium Amenities</span>
            <span>Flexible Booking</span>
            <span>Trusted Experience</span>
          </div>
        </div>
      </section>

      {/* Shell */}
      <section className="rooms-shell">
        {/* Toolbar */}
        <div className="rooms-toolbar">
          <div className="toolbar-left">
            <h2>Explore Collection</h2>
            <p className="muted">
              {loading ? "Loading rooms…" : `Showing ${showingCount} of ${totalCount}`}
            </p>
          </div>

          <div className="toolbar-right">
            <label className="toolbar-field">
              Room Type
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                disabled={loading || actionLoading}
              >
                {roomTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Types" : t}
                  </option>
                ))}
              </select>
            </label>

            <label className="toolbar-field toolbar-field--search">
              Search
              <input
                className="toolbar-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, type, or description…"
                disabled={loading || actionLoading}
                aria-label="Search rooms"
              />
            </label>

            <label className="toolbar-field">
              Sort
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} disabled={loading || actionLoading}>
                <option value="recommended">Recommended</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating_desc">Rating: High → Low</option>
              </select>
            </label>

            <div className="toolbar-actions">
              <button type="button" className="btn" onClick={loadRooms} disabled={loading || actionLoading}>
                Refresh
              </button>

              {(typeFilter !== "All" || query.trim() || sortBy !== "recommended") && (
                <button type="button" className="btn btn-outline" onClick={clearFilters} disabled={loading || actionLoading}>
                  Clear
                </button>
              )}

              {/* Keep demo seeding, but hide in production for launch-readiness */}
              {isDev && (
                <button type="button" className="btn btn-primary" onClick={handleSeed} disabled={loading || actionLoading}>
                  {actionLoading ? "Creating…" : "Create Sample Rooms"}
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Loading */}
        {loading && (
          <div className="rooms-skeleton-grid" aria-label="Loading rooms">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="room-skeleton" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filteredRooms.length === 0 && (
          <div className="rooms-empty">
            <h3>No rooms found</h3>
            <p>Try changing filters or searching with a different keyword.</p>
            <div className="rooms-empty__actions">
              <button className="btn" type="button" onClick={clearFilters}>
                Clear Filters
              </button>
              <button className="btn btn-outline" type="button" onClick={loadRooms}>
                Refresh
              </button>
              {isDev && totalCount === 0 && (
                <button className="btn btn-primary" type="button" onClick={handleSeed} disabled={actionLoading}>
                  {actionLoading ? "Creating…" : "Create Sample Rooms"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grid */}
        {!loading && filteredRooms.length > 0 && (
          <div className="rooms-grid">
            {filteredRooms.map((room) => {
              const amenities = parseAmenities(room.amenities);
              const badge = getBadge(room);
              const original = getOriginalPrice(room.price);

              return (
                <article className="room-card" key={room.id}>
                  <div className="room-image">
                    <img
                      src={safeImage(room.image_url)}
                      alt={room.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />

                    <div className={`room-badge ${badge.tone}`}>{badge.text}</div>

                    <div className="room-rating" title="Guest rating">
                      <span className="star">★</span> {getRating(room)}
                    </div>

                    <div className="room-price-float">
                      {formatPrice(room.price)} <span>/night</span>
                    </div>
                  </div>

                  <div className="room-body">
                    <div className="room-head">
                      <div>
                        <h3 className="room-title">{room.name}</h3>
                        <p className="room-sub">Luxora Collection</p>
                      </div>
                      <span className="room-type">{room.room_type}</span>
                    </div>

                    <p className="room-desc">{room.description}</p>

                    <div className="room-mini-meta">
                      <span>Max {room.max_guests || 2} guests</span>
                      <span>•</span>
                      <span>{room.total_rooms || 0} rooms</span>
                    </div>

                    {amenities.length > 0 && (
                      <div className="amenities">
                        {amenities.slice(0, 6).map((a, idx) => (
                          <span className="amenity" key={idx}>
                            {a}
                          </span>
                        ))}
                        {amenities.length > 6 && <span className="amenity more">+{amenities.length - 6} more</span>}
                      </div>
                    )}

                    <div className="pricing-row">
                      <span className="original-price">{formatPrice(original)}</span>
                      <span className="current-price">{formatPrice(room.price)}</span>
                      <span className="per-night">/night</span>
                    </div>

                    <button className="book-btn" type="button" onClick={() => goToBooking(room)}>
                      Book Now <span className="arrow">→</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Support */}
        <div className="rooms-footer">
          <div className="rooms-footer__card">
            <h3>Need help choosing?</h3>
            <p>Our team is ready to help you plan the perfect stay.</p>
            <div className="rooms-footer__meta">
              <span>📞 +94 77 000 0000</span>
              <span>✉️ support@luxora.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRooms, initSampleRooms } from "../api/roomsApi";

export default function Home() {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price || 0);

  const roomsCount = Array.isArray(rooms) ? rooms.length : 0;

  const featured = useMemo(() => {
    if (!Array.isArray(rooms)) return [];
    return rooms.slice(0, 3);
  }, [rooms]);

  const loadRooms = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "We couldn’t load rooms right now. Please try again.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDev = process.env.NODE_ENV !== "production";

  const handleCreateSample = async () => {
    setError("");
    setActionLoading(true);
    try {
      await initSampleRooms();
      await loadRooms();
    } catch (e) {
      setError(e?.message || "Failed to create demo rooms. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <section className="home-hero">
        <div className="container">
          <div className="home-hero-inner">
            {/* Left */}
            <div>
              <div className="pill" style={{ background: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.22)", color: "white" }}>
                ✨ Premium stays. Seamless booking.
              </div>

              <h1 className="home-title" style={{ marginTop: 12 }}>
                Find the perfect room — book in minutes.
              </h1>

              <p className="home-subtitle">
                Browse curated rooms, check dates instantly, and manage your reservations with a clean, modern experience.
              </p>

              <div className="home-cta">
                <Link className="btn btn-outline" to="/rooms">
                  Explore Rooms
                </Link>

                <button className="btn btn-primary" onClick={() => navigate("/booking")} type="button">
                  Book Now
                </button>

                <button className="btn btn-outline" onClick={loadRooms} type="button" disabled={loading}>
                  {loading ? "Refreshing..." : "Refresh"}
                </button>

                {/* Keep demo seeding only when empty + not production */}
                {isDev && roomsCount === 0 && !loading && (
                  <button
                    className="btn btn-outline"
                    onClick={handleCreateSample}
                    type="button"
                    disabled={actionLoading}
                    title="Adds demo rooms into your database (dev/demo only)"
                  >
                    {actionLoading ? "Creating..." : "Add Demo Rooms"}
                  </button>
                )}
              </div>

              <div className="kpis">
                <div className="kpi">
                  <div className="kpi-num">{loading ? "…" : roomsCount}</div>
                  <div className="kpi-label">Rooms available</div>
                </div>
                <div className="kpi">
                  <div className="kpi-num">4.8★</div>
                  <div className="kpi-label">Guest rating</div>
                </div>
                <div className="kpi">
                  <div className="kpi-num">24/7</div>
                  <div className="kpi-label">Support</div>
                </div>
              </div>

              {error && (
                <div className="alert alert-error" style={{ marginTop: 14 }} aria-live="polite">
                  {error}
                </div>
              )}
            </div>

            {/* Right */}
            <div className="hero-card">
              <div className="pill">Why guests choose Luxora</div>

              <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
                <div className="card" style={{ background: "rgba(255,255,255,0.88)", padding: 14 }}>
                  <div style={{ fontWeight: 950, marginBottom: 6 }}>✅ Quick booking flow</div>
                  <div className="muted" style={{ lineHeight: 1.65 }}>
                    Select dates, confirm details, and reserve without friction.
                  </div>
                </div>

                <div className="card" style={{ background: "rgba(255,255,255,0.88)", padding: 14 }}>
                  <div style={{ fontWeight: 950, marginBottom: 6 }}>🏨 Curated rooms & amenities</div>
                  <div className="muted" style={{ lineHeight: 1.65 }}>
                    Clean listings with pricing, images, and helpful room details.
                  </div>
                </div>

                <div className="card" style={{ background: "rgba(255,255,255,0.88)", padding: 14 }}>
                  <div style={{ fontWeight: 950, marginBottom: 6 }}>📌 Manage your reservations</div>
                  <div className="muted" style={{ lineHeight: 1.65 }}>
                    View bookings in one place and keep everything organized.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link className="btn btn-primary" to="/rooms" style={{ flex: 1, minWidth: 160, textAlign: "center" }}>
                  Browse Rooms
                </Link>
                <button className="btn btn-outline" onClick={() => navigate("/booking")} type="button" style={{ flex: 1, minWidth: 160 }}>
                  Start Booking
                </button>
              </div>
            </div>
          </div>

          {/* Featured */}
          <div className="section" style={{ paddingBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, color: "white" }}>Featured rooms</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9, fontWeight: 650 }}>
                  A quick preview of what guests will love.
                </p>
              </div>
              <Link className="btn btn-outline" to="/rooms">
                View all rooms →
              </Link>
            </div>

            {loading ? (
              <div className="rooms-mini-grid" style={{ marginTop: 14 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="room-mini"
                    style={{
                      background: "rgba(255,255,255,0.16)",
                      borderColor: "rgba(255,255,255,0.22)",
                    }}
                  >
                    <div style={{ height: 170, background: "rgba(255,255,255,0.18)" }} />
                    <div className="room-mini-body">
                      <div style={{ height: 14, width: "40%", background: "rgba(255,255,255,0.22)", borderRadius: 999 }} />
                      <div style={{ height: 18, width: "70%", background: "rgba(255,255,255,0.22)", borderRadius: 10, marginTop: 12 }} />
                      <div style={{ height: 12, width: "90%", background: "rgba(255,255,255,0.18)", borderRadius: 10, marginTop: 10 }} />
                      <div style={{ height: 12, width: "75%", background: "rgba(255,255,255,0.18)", borderRadius: 10, marginTop: 8 }} />
                      <div style={{ height: 16, width: "45%", background: "rgba(255,255,255,0.22)", borderRadius: 10, marginTop: 12 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : roomsCount === 0 ? (
              <div style={{ marginTop: 14, color: "rgba(255,255,255,0.92)", fontWeight: 750 }}>
                No rooms found yet. Please add rooms in the admin/database.
                {isDev ? (
                  <>
                    {" "}
                    Or click <b>Add Demo Rooms</b> above for a quick demo.
                  </>
                ) : null}
              </div>
            ) : (
              <div className="rooms-mini-grid">
                {featured.map((r) => (
                  <div className="room-mini" key={r.id}>
                    <img src={r.image_url} alt={r.name} loading="lazy" />
                    <div className="room-mini-body">
                      <div className="pill" style={{ marginBottom: 10 }}>
                        {r.room_type}
                      </div>
                      <div style={{ fontWeight: 950, fontSize: 16 }}>{r.name}</div>
                      <div className="muted small" style={{ marginTop: 6, lineHeight: 1.5 }}>
                        {r.description}
                      </div>
                      <div style={{ marginTop: 10, fontWeight: 950 }}>
                        {formatPrice(r.price)} <span className="muted small">/night</span>
                      </div>

                      <div style={{ marginTop: 12 }}>
                        <button className="btn btn-primary" type="button" onClick={() => navigate("/booking")} style={{ width: "100%", height: 42 }}>
                          Book this room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Small “confidence” section (non-dev wording) */}
      <section className="section">
        <div className="container">
          <div className="card" style={{ padding: 22 }}>
            <h2 style={{ margin: 0 }}>A smooth experience from start to finish</h2>
            <p className="muted" style={{ margin: "10px 0 0 0", lineHeight: 1.7 }}>
              Built with a focus on clarity, speed, and a premium feel — so your guests can book confidently.
            </p>

            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn-outline" to="/rooms">
                Browse rooms
              </Link>
              <button className="btn btn-primary" type="button" onClick={() => navigate("/booking")}>
                Make a booking
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

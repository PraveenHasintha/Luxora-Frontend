import React, { useContext, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { user, logout, isAuthenticated, isAuthLoading } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setOpen(false);

  const initials = useMemo(() => {
    const name = user?.name || "User";
    const parts = name.trim().split(" ").filter(Boolean);
    const a = parts[0]?.[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [user]);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login", { replace: true });
  };

  // While auth is loading, keep header minimal
  const showLoggedInUI = !isAuthLoading && isAuthenticated;

  return (
    <header className="header-container">
      <div className="header-inner">
        <Link to={showLoggedInUI ? "/" : "/login"} className="logo" onClick={closeMenu}>
          <span className="logo-badge">L</span>
          <span className="logo-text">Luxora</span>
        </Link>

        {/* If not logged in, no hamburger / menu (clean + simple) */}
        {showLoggedInUI && (
          <button
            className={`hamburger ${open ? "open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            type="button"
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        )}

        <nav className={`nav-wrap ${open ? "open" : ""} ${showLoggedInUI ? "" : "nav-logged-out"}`}>
          {showLoggedInUI ? (
            <>
              <ul className="nav-links">
                <li>
                  <Link to="/" className={isActive("/") ? "active" : ""} onClick={closeMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/rooms" className={isActive("/rooms") ? "active" : ""} onClick={closeMenu}>
                    Rooms
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className={isActive("/booking") ? "active" : ""} onClick={closeMenu}>
                    Booking
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className={isActive("/dashboard") ? "active" : ""} onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
              </ul>

              <div className="profile-area">
                <Link
                  to="/profile"
                  className={`profile-chip ${isActive("/profile") ? "active" : ""}`}
                  onClick={closeMenu}
                  title="Profile"
                >
                  <span className="avatar">{initials}</span>
                  <span className="profile-name">{user?.name || "Profile"}</span>
                </Link>

                <button type="button" className="pill-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            // Logged out: ONLY login in header (Register only appears inside Login page)
            <div className="logged-out-actions">
              <Link to="/login" className={isActive("/login") ? "active" : ""} onClick={closeMenu}>
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

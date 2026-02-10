// Luxora-Frontend/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h3 className="footer-title">Luxora</h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.7 }}>
              A modern hotel booking experience built with FastAPI + React.
              Clean UI, protected routes, and a dashboard your clients will love.
            </p>
          </div>

          <div>
            <h4 className="footer-title" style={{ fontSize: 15 }}>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/booking">Booking</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title" style={{ fontSize: 15 }}>Support</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@luxora.com">support@luxora.com</a></li>
              <li><a href="tel:+94770000000">+94 77 000 0000</a></li>
              <li><span className="muted">24/7 Concierge</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Luxora Hotel Booking</span>
          <span>FastAPI + React • Built for production</span>
        </div>
      </div>
    </footer>
  );
}

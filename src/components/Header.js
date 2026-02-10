import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const location = useLocation();

  // Helper function to determine if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header-container">
      <div className="logo">
        <h1>Luxora</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/rooms" 
              className={isActive('/rooms') ? 'active' : ''}
            >
              Rooms
            </Link>
          </li>
          <li>
            <Link 
              to="/bookings" 
              className={isActive('/bookings') ? 'active' : ''}
            >
              Bookings
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
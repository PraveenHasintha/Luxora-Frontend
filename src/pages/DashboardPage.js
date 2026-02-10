import React, { useContext, useState } from 'react';
import '../styles/DashboardPage.css';
import { BookingContext } from '../context/BookingContext';

function DashboardPage() {
  const { bookings, removeBooking, clearAllBookings } = useContext(BookingContext);
  
  const [roomTypeFilter, setRoomTypeFilter] = useState('All');

  const handleFilterChange = (e) => {
    setRoomTypeFilter(e.target.value);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Ensure bookings is not undefined or null
  const safeBookings = bookings || [];
  const totalBookings = safeBookings.length;
  const totalRooms = 50; // Example total room count
  const availableRooms = totalRooms - totalBookings;

  // Calculate total revenue
  const totalRevenue = safeBookings.reduce((sum, booking) => {
    return sum + (booking.totalPrice || 0);
  }, 0);

  const uniqueUsers = safeBookings.length > 0 ? [...new Set(safeBookings.map(b => b.email))] : [];
  const registeredUsers = uniqueUsers.length;

  // Filter bookings based on room type
  const filteredBookings = safeBookings.filter((booking) => {
    if (roomTypeFilter === 'All') return true;
    return booking.roomType && booking.roomType.includes(roomTypeFilter);
  });

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      removeBooking(bookingId);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all bookings? This action cannot be undone.')) {
      clearAllBookings();
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      {/* Dashboard Stats */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Total Bookings</h2>
          <p>{totalBookings}</p>
        </div>
        <div className="dashboard-card">
          <h2>Available Rooms</h2>
          <p>{availableRooms >= 0 ? availableRooms : 0}</p>
        </div>
        <div className="dashboard-card">
          <h2>Total Revenue</h2>
          <p>{formatPrice(totalRevenue)}</p>
        </div>
        <div className="dashboard-card">
          <h2>Registered Users</h2>
          <p>{registeredUsers}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        {/* Room Type Filter */}
        <div className="filter-container">
          <label htmlFor="roomTypeFilter">Filter by Room Type: </label>
          <select id="roomTypeFilter" onChange={handleFilterChange} value={roomTypeFilter}>
            <option value="All">All Room Types</option>
            <option value="Sigiriya">Sigiriya Palace Suite</option>
            <option value="Galle">Galle Fort Ocean Villa</option>
            <option value="Kandy">Kandy Hills Retreat</option>
            <option value="Ella">Ella Cloud Forest Cabin</option>
            <option value="Mirissa">Mirissa Beach Villa</option>
            <option value="Nuwara">Nuwara Eliya Tea Estate</option>
          </select>
        </div>

        {/* Clear All Button */}
        {totalBookings > 0 && (
          <button onClick={handleClearAll} className="clear-all-btn">
            Clear All Bookings
          </button>
        )}
      </div>

      {/* Detailed Bookings List */}
      <div className="bookings-table-container">
        <h2>Bookings ({filteredBookings.length})</h2>
        
        {filteredBookings.length > 0 ? (
          <div className="table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Guest Name</th>
                  <th>Email</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Guests</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr key={booking.bookingId || index}>
                    <td className="booking-id">{booking.bookingId || 'N/A'}</td>
                    <td>{booking.name || 'N/A'}</td>
                    <td>{booking.email || 'N/A'}</td>
                    <td className="room-name">
                      {booking.roomType || booking.roomDetails?.name || 'N/A'}
                    </td>
                    <td>{booking.checkIn || 'N/A'}</td>
                    <td>{booking.checkOut || 'N/A'}</td>
                    <td>{booking.guests || 1}</td>
                    <td className="price">
                      {booking.totalPrice ? formatPrice(booking.totalPrice) : 'N/A'}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteBooking(booking.bookingId)}
                        className="delete-btn"
                        title="Delete booking"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-bookings">
            <p>No bookings available.</p>
            <p>👆 Use the booking page to create your first reservation!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
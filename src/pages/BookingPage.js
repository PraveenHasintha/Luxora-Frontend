import React, { useState, useContext, useEffect } from 'react';
import { BookingContext } from '../context/BookingContext';
import '../styles/BookingPage.css';

const sriLankanRooms = [
  {
    id: 'sigiriya-suite',
    name: 'Sigiriya Palace Suite',
    location: 'Sigiriya, Cultural Triangle',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    features: ['King Bed', 'Heritage View', 'Butler Service']
  },
  {
    id: 'galle-villa',
    name: 'Galle Fort Ocean Villa',
    location: 'Galle Fort, Southern Province',
    price: 28000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    features: ['Ocean View', 'Colonial Style', 'Beach Access']
  },
  {
    id: 'kandy-retreat',
    name: 'Kandy Hills Retreat',
    location: 'Kandy, Central Province',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    features: ['Mountain View', 'Temple Nearby', 'Cultural Tours']
  },
  {
    id: 'ella-cabin',
    name: 'Ella Cloud Forest Cabin',
    location: 'Ella, Uva Province',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    features: ['Hill Views', 'Eco-Friendly', 'Train Watching']
  },
  {
    id: 'mirissa-villa',
    name: 'Mirissa Beach Villa',
    location: 'Mirissa, Southern Coast',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    features: ['Beachfront', 'Whale Watching', 'Surfing']
  },
  {
    id: 'nuwara-bungalow',
    name: 'Nuwara Eliya Tea Estate',
    location: 'Nuwara Eliya, Hill Country',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    features: ['Tea Gardens', 'Cool Climate', 'Colonial Heritage']
  }
];

function BookingPage() {
  const { addBooking } = useContext(BookingContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    roomType: '',
    guests: 1,
    specialRequests: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateNights = (checkIn, checkOut) => {
    if (checkIn && checkOut) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const timeDiff = date2.getTime() - date1.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff > 0 ? daysDiff : 0;
    }
    return 0;
  };

  useEffect(() => {
    const nightCount = calculateNights(formData.checkIn, formData.checkOut);
    setNights(nightCount);
    if (selectedRoom && nightCount > 0) {
      setTotalPrice(selectedRoom.price * nightCount);
    }
  }, [formData.checkIn, formData.checkOut, selectedRoom]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setFormData({ ...formData, roomType: room.name });
    setCurrentStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const bookingData = {
        ...formData,
        roomDetails: selectedRoom,
        nights: nights,
        totalPrice: totalPrice,
        bookingId: `LX${Date.now()}`,
        bookingDate: new Date().toISOString().split('T')[0]
      };
      
      // Save to context (localStorage only - no API calls)
      addBooking(bookingData);
      
      // Show success message
      alert(`🎉 Booking Confirmed! 
      
Booking ID: ${bookingData.bookingId}
Room: ${selectedRoom.name}
Total: ${formatPrice(totalPrice)}
Duration: ${nights} nights

Thank you for choosing Luxora! 🏝️`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        roomType: '',
        guests: 1,
        specialRequests: ''
      });
      setSelectedRoom(null);
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Booking error:', error);
      alert('❌ Sorry, there was an error processing your booking. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="booking-page">
      {/* Hero Section */}
      <div className="booking-hero">
        <div className="hero-content">
          <h1>Book Your Sri Lankan Paradise</h1>
          <p>Reserve your luxury escape across the Pearl of the Indian Ocean</p>
        </div>
      </div>

      <div className="booking-container">
        {/* Progress Steps */}
        <div className="booking-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-title">Choose Room</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-title">Select Dates</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-title">Guest Details</span>
          </div>
        </div>

        {/* Step 1: Room Selection */}
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Select Your Accommodation</h2>
            <div className="rooms-selection">
              {sriLankanRooms.map((room) => (
                <div 
                  key={room.id} 
                  className={`room-option ${selectedRoom?.id === room.id ? 'selected' : ''}`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <img src={room.image} alt={room.name} />
                  <div className="room-info">
                    <h3>{room.name}</h3>
                    <p className="location">📍 {room.location}</p>
                    <div className="features">
                      {room.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    <div className="price">{formatPrice(room.price)}<span>/night</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {currentStep === 2 && (
          <div className="step-content">
            <h2>Select Your Dates</h2>
            <div className="selected-room-summary">
              <img src={selectedRoom.image} alt={selectedRoom.name} />
              <div>
                <h3>{selectedRoom.name}</h3>
                <p>{selectedRoom.location}</p>
                <p className="price">{formatPrice(selectedRoom.price)} per night</p>
              </div>
            </div>
            
            <div className="date-selection">
              <div className="date-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="date-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  min={formData.checkIn}
                  required
                />
              </div>
              <div className="guests-group">
                <label>Number of Guests</label>
                <select name="guests" value={formData.guests} onChange={handleChange}>
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4 Guests</option>
                </select>
              </div>
            </div>

            {nights > 0 && (
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-row">
                  <span>{selectedRoom.name}</span>
                  <span>{formatPrice(selectedRoom.price)} × {nights} nights</span>
                </div>
                <div className="summary-total">
                  <span>Total Amount</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            )}

            <div className="step-actions">
              <button onClick={prevStep} className="btn-secondary">← Back</button>
              <button 
                onClick={nextStep} 
                className="btn-primary"
                disabled={!formData.checkIn || !formData.checkOut || nights <= 0}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Guest Details */}
        {currentStep === 3 && (
          <div className="step-content">
            <h2>Guest Information</h2>
            <form onSubmit={handleSubmit} className="guest-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+94 XX XXX XXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  placeholder="Any special requests or dietary requirements..."
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

              <div className="final-summary">
                <h3>Final Booking Summary</h3>
                <div className="summary-card">
                  <div className="summary-header">
                    <img src={selectedRoom.image} alt={selectedRoom.name} />
                    <div>
                      <h4>{selectedRoom.name}</h4>
                      <p>{selectedRoom.location}</p>
                    </div>
                  </div>
                  <div className="summary-details">
                    <div className="detail-row">
                      <span>Check-in:</span>
                      <span>{new Date(formData.checkIn).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="detail-row">
                      <span>Check-out:</span>
                      <span>{new Date(formData.checkOut).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="detail-row">
                      <span>Duration:</span>
                      <span>{nights} nights</span>
                    </div>
                    <div className="detail-row">
                      <span>Guests:</span>
                      <span>{formData.guests} {formData.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                    <div className="detail-row total">
                      <span>Total Amount:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button type="button" onClick={prevStep} className="btn-secondary">← Back</button>
                <button type="submit" className="btn-confirm">Confirm Booking 🎉</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingPage;
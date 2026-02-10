import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Luxora</h1>
          <p>Your luxury escape, tailored to perfection. Experience unparalleled comfort and elegance in the heart of paradise.</p>
          <a href="/rooms" className="hero-btn">Explore Rooms</a>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">🏨</div>
          <h3>Luxury Accommodations</h3>
          <p>Experience comfort and elegance with stunning ocean views, premium amenities, and world-class service that exceeds expectations.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🕐</div>
          <h3>24/7 Concierge Service</h3>
          <p>Our dedicated team is here around the clock to make your stay unforgettable, catering to your every need with personalized attention.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🍽️</div>
          <h3>Gourmet Dining</h3>
          <p>Indulge in exquisite culinary experiences curated by world-renowned chefs, featuring fresh local ingredients and international cuisine.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
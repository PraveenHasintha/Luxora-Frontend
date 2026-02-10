import React from 'react';
import '../styles/RoomsPage.css';

const rooms = [
  {
    id: 1,
    name: 'Sigiriya Palace Suite',
    type: 'Heritage Suite',
    price: 35000,
    originalPrice: 45000,
    location: 'Sigiriya, Cultural Triangle',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'Luxurious suite with panoramic views of the ancient Sigiriya Rock Fortress. Experience royal comfort amidst Sri Lanka\'s cultural heritage.',
    amenities: ['King Size Bed', 'Private Balcony', 'Heritage View', 'Butler Service', 'Traditional Spa'],
    rating: 4.9,
    discount: '22% OFF'
  },
  {
    id: 2,
    name: 'Galle Fort Ocean Villa',
    type: 'Colonial Villa',
    price: 28000,
    originalPrice: 38000,
    location: 'Galle Fort, Southern Province',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'Historic colonial villa within the UNESCO World Heritage Galle Fort with stunning Indian Ocean views and authentic Dutch architecture.',
    amenities: ['Ocean View', 'Colonial Architecture', 'Private Garden', 'Antique Furnishing', 'Beach Access'],
    rating: 4.8,
    discount: '26% OFF'
  },
  {
    id: 3,
    name: 'Kandy Hills Retreat',
    type: 'Mountain Lodge',
    price: 22000,
    originalPrice: 30000,
    location: 'Kandy, Central Province',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'Serene mountain retreat overlooking the sacred Temple of the Tooth and Kandy Lake. Perfect for cultural exploration and relaxation.',
    amenities: ['Mountain View', 'Temple View', 'Tea Garden', 'Cultural Tours', 'Ayurvedic Spa'],
    rating: 4.7,
    discount: '27% OFF'
  },
  {
    id: 4,
    name: 'Ella Cloud Forest Cabin',
    type: 'Eco Lodge',
    price: 18000,
    originalPrice: 25000,
    location: 'Ella, Uva Province',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'Eco-friendly cabin nestled in the misty hills of Ella. Wake up to breathtaking views of Little Adam\'s Peak and Nine Arch Bridge.',
    amenities: ['Hill Country Views', 'Eco-Friendly', 'Hiking Trails', 'Train Watching', 'Organic Meals'],
    rating: 4.6,
    discount: '28% OFF'
  },
  {
    id: 5,
    name: 'Mirissa Beach Villa',
    type: 'Beach Resort',
    price: 32000,
    originalPrice: 42000,
    location: 'Mirissa, Southern Coast',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'Beachfront villa on pristine Mirissa Beach. Perfect for whale watching, surfing, and enjoying spectacular sunsets over the Indian Ocean.',
    amenities: ['Beachfront', 'Whale Watching', 'Surfing', 'Sunset Views', 'Fresh Seafood'],
    rating: 4.8,
    discount: '24% OFF'
  },
  {
    id: 6,
    name: 'Nuwara Eliya Tea Estate Bungalow',
    type: 'Plantation Stay',
    price: 25000,
    originalPrice: 33000,
    location: 'Nuwara Eliya, Hill Country',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    description: 'Historic tea estate bungalow in Little England. Experience cool climate, rolling tea gardens, and colonial charm.',
    amenities: ['Tea Plantation', 'Cool Climate', 'Colonial Heritage', 'Tea Tasting', 'Garden Walks'],
    rating: 4.5,
    discount: '24% OFF'
  }
];

const RoomsPage = () => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleBookNow = (room) => {
    // You can navigate to booking page with room details
    window.location.href = `/bookings?room=${room.id}&name=${encodeURIComponent(room.name)}`;
  };

  return (
    <div className="rooms-page">
      <div className="rooms-hero">
        <div className="hero-content">
          <h1>Discover Sri Lanka's Finest Accommodations</h1>
          <p>From ancient kingdoms to pristine beaches, experience luxury across the Pearl of the Indian Ocean</p>
        </div>
      </div>

      <div className="rooms-container">
        <div className="section-header">
          <h2>Available Rooms & Suites</h2>
          <p>Handpicked luxury accommodations in Sri Lanka's most breathtaking destinations</p>
        </div>

        <div className="rooms-grid">
          {rooms.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="room-image-container">
                <img src={room.image} alt={room.name} loading="lazy" />
                <div className="discount-badge">{room.discount}</div>
                <div className="rating-badge">
                  <span className="star">⭐</span>
                  <span>{room.rating}</span>
                </div>
              </div>
              
              <div className="room-details">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span className="room-type">{room.type}</span>
                </div>
                
                <div className="location">
                  📍 {room.location}
                </div>
                
                <p className="room-description">{room.description}</p>
                
                <div className="amenities">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="amenity-more">+{room.amenities.length - 3} more</span>
                  )}
                </div>
                
                <div className="pricing">
                  <div className="price-container">
                    <span className="original-price">{formatPrice(room.originalPrice)}</span>
                    <span className="current-price">{formatPrice(room.price)}</span>
                    <span className="price-period">per night</span>
                  </div>
                </div>
                
                <button 
                  className="book-btn"
                  onClick={() => handleBookNow(room)}
                >
                  Book Now
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rooms-footer">
          <div className="contact-info">
            <h3>Need Help Choosing?</h3>
            <p>Our travel experts are here to help you find the perfect accommodation</p>
            <div className="contact-details">
              <span>📞 +94 11 123 4567</span>
              <span>✉️ reservations@luxora.lk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
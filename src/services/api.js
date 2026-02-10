const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Room methods
  async getRooms() {
    return this.request('/rooms');
  }

  async initSampleData() {
    return this.request('/rooms/init-sample-data', {
      method: 'POST',
    });
  }

  async checkAvailability(roomType, checkIn, checkOut) {
    return this.request('/bookings/check-availability', {
      method: 'POST',
      body: JSON.stringify({ roomType, checkIn, checkOut }),
    });
  }

  // Booking methods
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getBookings() {
    return this.request('/bookings');
  }

  async cancelBooking(bookingId) {
    return this.request(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  }
}

// Create a single instance to use throughout the app
const apiService = new ApiService();
export default apiService;
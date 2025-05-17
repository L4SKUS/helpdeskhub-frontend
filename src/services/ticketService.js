import axios from 'axios';

const API_URL = 'http://localhost:8082/api/tickets';

const api = axios.create();

api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// CREATE - POST /api/tickets
export const createTicket = (ticketData) => {
  return api.post(API_URL, ticketData)
    .then(response => response.data)
    .catch(error => {
      console.error('Create error:', error);
      throw error;
    });
};

// READ ALL - GET /api/tickets
export const getTickets = () => {
  return api.get(API_URL)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      if (error.response?.status === 401) {
        // Handle unauthorized access
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    });
};

// READ ONE - GET /api/tickets/{id}
export const getTicket = (id) => {
  return api.get(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

// UPDATE - PUT /api/tickets/{id}
export const updateTicket = (id, ticketData) => {
  return api.put(`${API_URL}/${id}`, ticketData)
    .then(response => response.data)
    .catch(error => {
      console.error('Update error:', error);
      throw error;
    });
};

// DELETE - DELETE /api/tickets/{id}
export const deleteTicket = (id) => {
  return api.delete(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Delete error:', error);
      throw error;
    });
};

export default {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket
};
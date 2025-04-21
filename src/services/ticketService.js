import axios from 'axios';

const API_URL = 'http://localhost:8082/api/tickets';

// CREATE - POST /api/tickets
export const createTicket = (ticketData) => {
  return axios.post(API_URL, ticketData)
    .then(response => response.data)
    .catch(error => {
      console.error('Create error:', error);
      throw error;
    });
};

// READ ALL - GET /api/tickets
export const getTickets = () => {
  return axios.get(API_URL)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

// READ ONE - GET /api/tickets/{id}
export const getTicket = (id) => {
  return axios.get(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

// UPDATE - PUT /api/tickets/{id}
export const updateTicket = (id, ticketData) => {
  return axios.put(`${API_URL}/${id}`, ticketData)
    .then(response => response.data)
    .catch(error => {
      console.error('Update error:', error);
      throw error;
    });
};

// DELETE - DELETE /api/tickets/{id}
export const deleteTicket = (id) => {
  return axios.delete(`${API_URL}/${id}`)
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
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

export const createTicket = (ticketData) => {
  return api.post(API_URL, ticketData)
    .then(response => response.data)
    .catch(error => {
      console.error('Create error:', error);
      throw error;
    });
};

export const getTickets = () => {
  return api.get(API_URL)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw error;
    });
};

export const getTicketById = (id) => {
  return api.get(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

export const updateTicket = (id, ticketData) => {
  return api.put(`${API_URL}/${id}`, ticketData)
    .then(response => response.data)
    .catch(error => {
      console.error('Update error:', error);
      throw error;
    });
};

export const deleteTicket = (id) => {
  return api.delete(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Delete error:', error);
      throw error;
    });
};

export const getTicketsByClient = async (clientId) => {
  try {
    const response = await fetch(`${API_URL}/client/${clientId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const getTicketsByEmployee = async (employeeId) => {
  try {
    const response = await fetch(`${API_URL}/employee/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

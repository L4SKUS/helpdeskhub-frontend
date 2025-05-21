import axios from 'axios';

const API_URL = 'http://localhost:8081/api/users';

const api = axios.create();

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getCurrentUserDetails = async () => {
  const { id } = getCurrentUser();
  return await getUserById(id);
};

export const getAgents = async() => {
  return api.get(`${API_URL}/agents`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

export const getCustomer = (id) => {
  return api.get(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};
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

export const getEmployees = async() => {
  return api.get(`${API_URL}/employees`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

export const getUser = (id) => {
  return api.get(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

export const getAllUsers = async () => {
  return api.get(`${API_URL}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetch error:', error);
      throw error;
    });
};

export const createUser = async (userData) => {
  return api.post(`${API_URL}`, userData)
    .then(response => response.data)
    .catch(error => {
      console.error('Create error:', error);
      throw error;
    });
};

export const updateUser = async (id, userData) => {
  return api.put(`${API_URL}/${id}`, userData)
    .then(response => response.data)
    .catch(error => {
      console.error('Update error:', error);
      throw error;
    });
};

export const deleteUser = async (id) => {
  return api.delete(`${API_URL}/${id}`)
    .catch(error => {
      console.error('Delete error:', error);
      throw error;
    });
};

export const changePassword = async ({ id, currentPasswordHash, newPasswordHash }) => {
  return api.put(`${API_URL}/${id}/password`, { currentPasswordHash, newPasswordHash })
    .then(response => response.data)
    .catch(error => {
      console.error('Change password error:', error);
      throw error;
    });
};

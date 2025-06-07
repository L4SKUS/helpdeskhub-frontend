import axios from 'axios';

const API_URL = 'http://localhost:8084/api/comments';

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

export const createComment = (commentData) => {
  return api.post(API_URL, commentData)
    .then(response => response.data)
    .catch(error => {
      console.error('Create error:', error);
      throw error;
    });
};

export const getComments = () => {
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

export const updateComment = (id, commentData) => {
  return api.put(`${API_URL}/${id}`, commentData)
    .then(response => response.data)
    .catch(error => {
      console.error('Update error:', error);
      throw error;
    });
};

export const deleteComment = (id) => {
  return api.delete(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Delete error:', error);
      throw error;
    });
};

export const getCommentsByTicket = async (ticketId) => {
  try {
    const response = await fetch(`${API_URL}/ticket/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

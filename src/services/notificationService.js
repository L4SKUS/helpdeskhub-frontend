import axios from 'axios';

const API_URL = 'http://localhost:8085/api/notifications';

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

export const notifyNewComment = (notificationData) => {
  return api.post(`${API_URL}/comment`, notificationData)
    .then(response => response.data)
    .catch(error => {
      console.error('Create error:', error);
      throw error;
    });
};

export const notifyEmployeeAssigned = (notificationData) => {
  return api.post(`${API_URL}/employee`, notificationData)
    .then(response => response.data)
    .catch(error => {
      console.error('Create error:', error);
      throw error;
    });
};

export const notifyStatusChanged = (notificationData) => {
  return api.post(`${API_URL}/status`, notificationData)
    .then(response => response.data)
    .catch(error => {
      console.error('Create error:', error);
      throw error;
    });
};

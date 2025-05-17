import axios from 'axios';

const userApi = axios.create({
  baseURL: 'http://localhost:8081/api/users',
});

export const getUsers = () => userApi.get('');
export const getAgents = () => userApi.get('/?role=AGENT');
export const getCustomers = () => userApi.get('/?role=CUSTOMER');
export const getAdmins = () => userApi.get('/?role=ADMIN');
//const API_URL = 'http://localhost:8083/api/auth';
const API_URL = 'http://k8s-default-ingressa-9b8ecfc4db-1680425954.eu-central-1.elb.amazonaws.com/api/auth'

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userEmail', credentials.email);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userId', data.id);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  return true;
};

export const getCurrentUser = () => {
  return {
    email: localStorage.getItem('userEmail'),
    role: localStorage.getItem('userRole'),
    id: localStorage.getItem('userId')
  };
};

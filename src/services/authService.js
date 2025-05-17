const API_URL = 'http://localhost:8083/api/auth';

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
      throw new Error('Login failed - Invalid credentials');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userEmail', credentials.email);
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

export const getCurrentUser = () => {
  return {
    email: localStorage.getItem('userEmail')
  };
};
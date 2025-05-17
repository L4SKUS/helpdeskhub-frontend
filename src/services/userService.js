const API_URL = 'http://localhost:8081/api/users';

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
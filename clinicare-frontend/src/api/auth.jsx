import axios from './axiosInstance';

export const registerUser = async (formData) => {
  const response = await axios.post('/auth/register', formData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data; 
};

export const changePasswordApi = async (payload) => {
  try {
    const res = await axios.post('/auth/change-password', payload);
    return { success: true, data: res.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Error occurred' };
  }
};
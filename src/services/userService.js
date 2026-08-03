import axios from 'axios';
import { BACKEND_URL } from './authService';

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`https://nihon-inventory.onrender.com/api/get-all-users`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('getAllUsers error', error);
    throw error;
  }
};

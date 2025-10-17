import axios from 'axios';
import { API_BASE_URL } from './config';
import { getOrCreateGuestId } from '../utils/guestId.js'; 

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');

  if (token) {
    // 1. Якщо є JWT, використовуємо заголовок Authorization
    config.headers['Authorization'] = `Bearer ${token}`;
    delete config.headers['x-guest-id']; 
  } else {
    // 2. Якщо JWT немає, використовуємо гостьовий ID
    const guestId = getOrCreateGuestId(); 
    if (guestId) {
      // Якщо це гість, відправляємо x-guest-id
      config.headers['x-guest-id'] = guestId;
    } else {
      delete config.headers['x-guest-id']; 
    }
  }

  return config;
});

export default httpClient;

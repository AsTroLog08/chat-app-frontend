import axios from 'axios';
import { API_BASE_URL } from './config';
// ❗ ПРИПУСКАЄМО: Ця функція оновлена, щоб повертати 'guest_id' 
// АБО null, якщо 'authToken' вже існує.
import { getOrCreateGuestId } from '../utils/guestId.js'; 

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// 🧠 Інтерцептор для всіх вихідних запитів
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // JWT для автентифікованих користувачів

  if (token) {
    // 1. Якщо є JWT, використовуємо заголовок Authorization
    config.headers['Authorization'] = `Bearer ${token}`;
    // Видаляємо x-guest-id, якщо він випадково був встановлений (чистка)
    delete config.headers['x-guest-id']; 
  } else {
    // 2. Якщо JWT немає, використовуємо гостьовий ID
    const guestId = getOrCreateGuestId(); 
    if (guestId) {
      // ❗ Якщо це гість, відправляємо x-guest-id
      config.headers['x-guest-id'] = guestId;
    } else {
      // ❗ Це може бути критично, якщо getOrCreateGuestId повертає null, 
      // коли має бути гостьовий ID. Але згідно з нашою логікою, 
      // якщо токена немає, ID гостя має бути (або він генерується).
      // Це запобігає помилці "Missing user or guest ID" у chatController.
      // На бекенді потрібно лише одне з двох.
      delete config.headers['x-guest-id']; 
    }
  }

  return config;
});

export default httpClient;

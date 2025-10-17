import { io } from 'socket.io-client';

// 🚩 Встановіть URL вашого Socket.IO сервера
const URL = 'https://chat-app-backend-gbe1.onrender.com/api/'; 

// Створюємо та експортуємо єдиний екземпляр сокета
export const socket = io(URL, {
    // Якщо потрібно, додайте конфігурацію, наприклад, forceNew: true
    // або додайте транспортні опції.
});
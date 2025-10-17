import { io } from 'socket.io-client';

//URL Socket.IO сервера
const URL = 'https://chat-app-backend-gbe1.onrender.com'; 

// Створюємо та експортуємо єдиний екземпляр сокета
export const socket = io(URL, {});
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messageApi } from '../../api/endpoints/messageApi.js';
import { clearStore } from './authSlice.js';
import { updateChatLastMessage } from './chatSlice.js';

// Асинхронна операція для завантаження повідомлень чату
export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await messageApi.getMessageChat(chatId);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

// Асинхронна операція для надсилання нового повідомлення
export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({ chatId, text }, { dispatch, rejectWithValue }) => {
    try {

      const response = await messageApi.sendMessage(chatId, text);

// !!! Оновлено: використовуємо нову дію messageReceived 
      dispatch(messageReceived({ 
         chatId,
        message: response.data 
     }));
        
        // !!! Додано: Оновлюємо chatSlice напряму для останнього повідомлення в списку
        dispatch(updateChatLastMessage({
            chatId: chatId,
            message: response.data,
        }));

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        messagesByChat: {}, 
        loading: false, 
        error: null,
    },
    reducers: {
        messageReceived: (state, action) => { // Змінено назву на messageReceived
            const { chatId, message } = action.payload;

              if (!state.messagesByChat[chatId]) {
                  state.messagesByChat[chatId] = [];
              }
            // Додаємо повідомлення лише якщо його ще немає (проста дедуплікація)
              const isDuplicate = state.messagesByChat[chatId].some(msg => msg.id === message.id);
              if (!isDuplicate) {
              state.messagesByChat[chatId].push(message);
              }
            }
        },
    extraReducers: (builder) => {
        builder
            // ==================== fetchMessages ====================
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                const chatId = action.meta.arg; 
                state.messagesByChat[chatId] = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(clearStore, (state) => {
              // Скидаємо всі дані до початкового стану (крім loading, щоб не викликати flash)
              state.messagesByChat = [];
              state.error = null;
            });
    },
});

export const { messageReceived } = messageSlice.actions;

export default messageSlice.reducer;
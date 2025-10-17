// store/slices/messageSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messageApi } from '../../api/endpoints/messageApi';


export const fetchMessages = createAsyncThunk(
  'message/fetchMessages',
  async (chatId, { rejectWithValue }) => {
    try {
      // Викликаємо API
      const response = await messageApi.getMessageChat(chatId);
      // Повертаємо дані, які стануть action.payload
      return response.data; 
    } catch (error) {
      // Обробка помилок
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'message/sendMessage',
  async ({chatId, text}, { dispatch, rejectWithValue }) => {
    try {
      // Викликаємо API
      const response = await messageApi.sendMessage(chatId, text);
      console.log(response.data.text)
      dispatch(addMessage({
        chatId,
        message: response.data
      }));
      return response.data; 
    } catch (error) {
      // Обробка помилок
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        messagesByChat: {}, // Зберігаємо повідомлення як об'єкт: { chatId: [msg1, msg2, ...] }
        loading: false, 
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            const { chatId, message } = action.payload;
            
            // Якщо масив для чату ще не існує, ініціалізуємо його
            if (!state.messagesByChat[chatId]) {
                state.messagesByChat[chatId] = [];
            }
            state.messagesByChat[chatId].push(message);
            console.log("Add message:", chatId, message.text);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // >>> ВИПРАВЛЕННЯ: Зберігаємо отриманий масив повідомлень під його chatId
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                // action.meta.arg - це chatId, який ми передали
                const chatId = action.meta.arg; 
                state.messagesByChat[chatId] = action.payload; // Зберігаємо масив повідомлень для конкретного chatId
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
            
            
    },
});

export const { addMessage } = messageSlice.actions;

export default messageSlice.reducer;
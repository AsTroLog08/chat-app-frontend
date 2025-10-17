import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messageApi } from '../../api/endpoints/messageApi.js';

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

      dispatch(addMessage({
        chatId,
        message: response.data
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
        addMessage: (state, action) => {
            const { chatId, message } = action.payload;
            
            if (!state.messagesByChat[chatId]) {
                state.messagesByChat[chatId] = [];
            }
            state.messagesByChat[chatId].push(message);
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
            });
    },
});

export const { addMessage } = messageSlice.actions;

export default messageSlice.reducer;
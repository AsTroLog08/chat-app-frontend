import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../../api/endpoints/chatApi.js";

// Створення нового чату
export const createNewChat = createAsyncThunk(
  "chat/createNewChat",
  async (chatData, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatApi.createChat(chatData);
      dispatch(fetchChats()); 
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating chat");
    }
  }
);

// Отримання списку чатів
export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (search = {}, { rejectWithValue }) => {
    try {
      const response = await chatApi.getChats(search);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching chats");
    }
  }
);

// Отримання інформації про один чат за ID
export const fetchChat = createAsyncThunk(
  "chat/fetchChat",
  async (id, { rejectWithValue }) => {
    try {
      const response = await chatApi.getChat(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching chat");
    }
  }
);

// Видалення чату за ID
export const removeChat = createAsyncThunk(
  "chat/removeChat",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await chatApi.deleteChat(id);
      dispatch(fetchChats()); 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting chat");
    }
  }
);

// Оновлення інформації про чат
export const modifyChat = createAsyncThunk(
  "chat/modifyChat",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatApi.updateChat(id, data);
      dispatch(fetchChats());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating chat");
    }
  }
);

const initialState = {
  chats: [], 
  currentChat: null, 
  loadingChats: false, 
  errorChats: null, 
  loadingChatAction: false,
  errorChatAction: null,
};

const chatSlice = createSlice({
  name: "chat", // Скоротив назву slice
  initialState,
  reducers: {
    // Встановлення поточного чату
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    // Очищення помилок
    clearChatActionError: (state) => {
      state.errorChatAction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ==================== FETCH CHATS ====================
      .addCase(fetchChats.pending, (state) => {
        state.loadingChats = true;
        state.errorChats = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loadingChats = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loadingChats = false;
        state.errorChats = action.payload;
      })

      // ==================== FETCH CHAT ====================
      .addCase(fetchChat.pending, (state) => {
        state.loadingChatAction = true;
        state.errorChatAction = null;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.loadingChatAction = false;
        state.currentChat = action.payload;
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.loadingChatAction = false;
        state.errorChatAction = action.payload;
      })

      // ==================== CREATE NEW CHAT ====================
      .addCase(createNewChat.pending, (state) => {
        state.loadingChatAction = true;
        state.errorChatAction = null;
      })
      .addCase(createNewChat.fulfilled, (state, action) => {
        state.loadingChatAction = false;
        state.currentChat = action.payload; 
      })
      .addCase(createNewChat.rejected, (state, action) => {
        state.loadingChatAction = false;
        state.errorChatAction = action.payload;
      })
      
      // ==================== REMOVE CHAT ====================
      .addCase(removeChat.pending, (state) => {
        state.loadingChatAction = true;
        state.errorChatAction = null;
      })
      .addCase(removeChat.fulfilled, (state) => {
        state.loadingChatAction = false;
        state.currentChat = null;
      })
      .addCase(removeChat.rejected, (state, action) => {
        state.loadingChatAction = false;
        state.errorChatAction = action.payload;
      })

      // ==================== MODIFY CHAT ====================
      .addCase(modifyChat.pending, (state) => {
        state.loadingChatAction = true;
        state.errorChatAction = null;
      })
      .addCase(modifyChat.fulfilled, (state, action) => {
        state.loadingChatAction = false;
        if (state.currentChat && state.currentChat.id === action.payload.id) {
            state.currentChat = action.payload;
        }
      })
      .addCase(modifyChat.rejected, (state, action) => {
        state.loadingChatAction = false;
        state.errorChatAction = action.payload;
      });
  },
});

export const { setCurrentChat, clearChatActionError } = chatSlice.actions;
export default chatSlice.reducer;
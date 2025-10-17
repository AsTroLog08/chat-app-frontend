import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { chatApi } from "../../api/endpoints/chatApi.js";
import { clearStore } from "./authSlice.js";

// Async Thunk для отримання портфоліо

export const createNewChat = createAsyncThunk(
  "chatStore/createNewChat",
  async (chatData, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatApi.createChat(chatData);
      dispatch(fetchChats({}));
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating chat");
    }
  }
);

// Отримання списку чатів
export const fetchChats = createAsyncThunk(
  "chatStore/fetchChats",
  async (search, { rejectWithValue }) => {
    try {
      const data = await chatApi.getChats(search);
      return data; // data = response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching chats");
    }
  }
);

// Отримання info чатy
export const fetchChat = createAsyncThunk(
  "chatStore/fetchChat",
  async (id, { rejectWithValue }) => {
    try {
      const response = await chatApi.getChat(id);
      return response.data; // data = response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching chat");
    }
  }
);

// Видалення чату
export const removeChat = createAsyncThunk(
  "chatStore/removeChat",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await chatApi.deleteChat(id);
      dispatch(fetchChats({})); // Оновлюємо список після видалення
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting chat");
    }
  }
);

// Оновлення чату
export const modifyChat = createAsyncThunk(
  "chatStore/modifyChat",
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await chatApi.updateChat(id, data);
      dispatch(fetchChats({}));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating chat");
    }
  }
);

const initialState = {
  chats: null, // Список чатів
  currentChat: null, // Інформація про поточний чат (якщо потрібна)
  loadingChats: false, // Завантаження списку чатів
  errorChats: null, // Помилки при отриманні списку чатів
  loadingChatAction: false, // Завантаження для створення/видалення/оновлення
  errorChatAction: null, // Помилки для створення/видалення/оновлення
};

const chatSlice = createSlice({
  name: "chatStore",
  initialState,
  reducers: {
    // Синхронний редуктор для встановлення списку чатів
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    // Синхронний редуктор для встановлення поточного чату
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    // Очищення помилок дії
    clearChatActionError: (state) => {
        state.errorChatAction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH CHATS
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

      // FETCH CHAT
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

      // CREATE NEW CHAT
      .addCase(createNewChat.pending, (state) => {
        state.loadingChatAction = true;
        state.errorChatAction = null;
      })
      .addCase(createNewChat.fulfilled, (state) => {
        state.loadingChatAction = false;
      })
      .addCase(createNewChat.rejected, (state, action) => {
        state.loadingChatAction = false;
        state.errorChatAction = action.payload;
      })
      
      // DELETE CHAT
      .addCase(removeChat.pending, (state) => {
        state.loadingChatAction = true;
        state.errorChatAction = null;
      })
      .addCase(removeChat.fulfilled, (state) => {
        state.loadingChatAction = false;

      })
      .addCase(removeChat.rejected, (state, action) => {
        state.loadingChatAction = false;
        state.errorChatAction = action.payload;
      })

      // UPDATE CHAT
      .addCase(modifyChat.pending, (state) => {
        state.loadingChatAction = true;
        state.errorChatAction = null;
      })
      .addCase(modifyChat.fulfilled, (state) => {
        state.loadingChatAction = false;
      })
      .addCase(modifyChat.rejected, (state, action) => {
        state.loadingChatAction = false;
        state.errorChatAction = action.payload;
      })
      .addCase(clearStore, (state) => {
          // Скидаємо всі дані до початкового стану (крім loading, щоб не викликати flash)
          state.chats = [];
          state.error = null;
      });
  },
});

export const { setChats, setCurrentChat, clearChatActionError } = chatSlice.actions;
export default chatSlice.reducer;
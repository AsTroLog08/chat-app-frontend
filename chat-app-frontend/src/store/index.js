import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import chatReducer from "./slices/chatSlice.js";
import messageReducer from "./slices/messageSlice.js"
import toastReducer from "./slices/toastSlice.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";

const store = configureStore({
  reducer: {
    authStore: authReducer,
    chatStore: chatReducer,
    messageStore: messageReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(errorMiddleware),

});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import messageReducer from "./slices/messageSlice"
import toastReducer from "./slices/toastSlice";
import { errorMiddleware } from "./middleware/errorMiddleware";

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

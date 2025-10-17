import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    list: [],
  },
  reducers: {
    addToast: (state, action) => {
      state.list.push(action.payload);
    },
    removeToast: (state, action) => {
      state.list = state.list.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.list = [];
    }
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;

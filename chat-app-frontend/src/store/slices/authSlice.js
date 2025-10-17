import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { authApi } from "../../api/endpoints/authApi.js";
import { getOrCreateGuestId } from "../../utils/guestId.js";


export const clearStore = createAction('global/clearStore');

// Асинхронна Thunk-дія для логіну через Google
export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (googleAccessToken, { rejectWithValue }) => {
    try {
      const response = await authApi.googleLogin(googleAccessToken);
      const { userId, token: authToken } = response;

      localStorage.setItem('user_id', userId);
      localStorage.setItem('authToken', authToken); 
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Асинхронна Thunk-дія для автологіну за наявним токеном
export const autoLogin = createAsyncThunk(
  "auth/autoLogin",
  async (_, { rejectWithValue }) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      return rejectWithValue('No auth token found. Guest mode.'); 
    }

    try {
      const response = await authApi.login(); 
      
      if (response && response.user) {
        localStorage.setItem('user_id', response.userId);
        return response;
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        getOrCreateGuestId(); 
        return rejectWithValue('User data could not be retrieved.');
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_id');
      getOrCreateGuestId();
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

const getInitialUserId = () => {
  let userId = localStorage.getItem('user_id'); 
  
  if (!userId && !localStorage.getItem('authToken')) {
    return getOrCreateGuestId();
  }
  return userId;
};

const authSlice = createSlice({
  name: "auth",
  initialState: { 
    user: null, 
    userId: getInitialUserId(), 
    loading: false, 
    error: null 
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.userId = getOrCreateGuestId(); 
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_id');
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // ==================== loginWithGoogle ====================
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; 
        state.userId = action.payload.userId; 
        state.error = null;
        localStorage.removeItem('guest_id'); 
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userId = getOrCreateGuestId();
        localStorage.removeItem('user_id');
        localStorage.removeItem('authToken');
      })
      
      // ==================== autoLogin ====================
      .addCase(autoLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        localStorage.removeItem('guest_id');
      })
      .addCase(autoLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null; 
        state.userId = getOrCreateGuestId(); // Встановлюємо гостьовий ID
      });
  },
});

export const { logout, setUserId } = authSlice.actions;
export default authSlice.reducer;
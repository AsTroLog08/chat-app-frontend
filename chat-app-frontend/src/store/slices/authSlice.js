import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/endpoints/authApi.js";
import { getOrCreateGuestId } from "../../utils/guestId.js";

export const loginWithGoogle = createAsyncThunk(
  "authStore/loginWithGoogle",
  async (googleAccessToken, { rejectWithValue }) => {
    try {
      // Очікуємо, що бекенд поверне { token: 'ваш.локальний.jwt', user: {...}, userId: '...' }
      const response = await authApi.googleLogin(googleAccessToken);
      
      const userId = response.userId;
      const authToken = response.token; // Локальний JWT

      // Зберігаємо обидва: ID для старту автологіну і головний ключ - JWT.
      localStorage.setItem('user_id', userId);
      localStorage.setItem('authToken', authToken); // Зберігаємо JWT
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);


export const autoLogin = createAsyncThunk(
  "authStore/autoLogin",
  async (_, { rejectWithValue }) => {
    const authToken = localStorage.getItem('authToken'); // Читаємо токен
    console.log(authToken)
    if (!authToken) {
      return rejectWithValue('No auth token found. Guest mode.'); // Не помилка, а гостьовий режим
    }

    try {
      // Виклик нового методу getMe, який використовує JWT з інтерцептора
      // Це GET-запит до /me для отримання даних користувача
      const response = await authApi.login(); 
      
      if (response && response.user) {
        // Оновлюємо userId, якщо потрібно, хоча головне - це user об'єкт
        localStorage.setItem('user_id', response.userId);
        return response;
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        return rejectWithValue('User data could not be retrieved.');
      }

    } catch (error) {
      // Якщо токен прострочений або недійсний (401), очищаємо сховище
      localStorage.removeItem('authToken');
      localStorage.removeItem('user_id');
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);


const getInitialUserId = () => {
    // 🚩 НОВЕ: Спочатку намагаємося знайти ID автентифікованого користувача
  let userId = localStorage.getItem('user_id'); 
    // Якщо ID автентифікованого користувача немає, генеруємо/отримуємо гостьовий ID
    if (!userId) {
        // getOrCreateGuestId() поверне guest_id (якщо authToken не встановлено) або null
        const guestId = getOrCreateGuestId();
        // Якщо повернуто гостьовий ID, використовуємо його як поточний userId
        if (guestId) {
            return guestId;
        }
    }
    return userId; // Повертаємо або автентифікований ID, або null
};


const authSlice = createSlice({
  name: "authStore",
  initialState: { 
    user: null, 
    userId: getInitialUserId(), 
    loading: false, 
    error: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.userId = getOrCreateGuestId();;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_id');
        localStorage.removeItem('guest_id');
    },
    // Редюсер для встановлення початкового стану без thunk (якщо потрібно)
    setUserId: (state, action) => {
      state.userId = action.payload;
    }
  },
extraReducers: (builder) => {
    builder
        // --- loginWithGoogle Reducers ---
        .addCase(loginWithGoogle.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginWithGoogle.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user; 
            state.userId = action.payload.userId; 
            state.error = null;
        })
        .addCase(loginWithGoogle.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.userId = null;
            localStorage.removeItem('user_id');
        })
        // --- autoLogin Reducers ---
        .addCase(autoLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(autoLogin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user; // Отримуємо повні дані користувача
            // userId не змінюємо, він вже був у сховищі
            state.error = null;
        })
        .addCase(autoLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null; // При помилці логіну скидаємо дані
            localStorage.removeItem('authToken');
            localStorage.removeItem('user_id');
        });
  },
});

export const { logout, setUserId } = authSlice.actions;
export default authSlice.reducer;
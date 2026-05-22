import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState } from '@/types';
import { mockUsers } from '@/data/mockData';

const storedToken = localStorage.getItem('ips_token');
const storedUser = localStorage.getItem('ips_user');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const found = mockUsers.find(u => u.username === username && u.password === password);
    if (!found) return rejectWithValue('Invalid credentials');
    const { password: _, ...user } = found;
    const token = btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 86400000 }));
    return { user, token };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ips_token');
      localStorage.removeItem('ips_user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('ips_token', action.payload.token);
        localStorage.setItem('ips_user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

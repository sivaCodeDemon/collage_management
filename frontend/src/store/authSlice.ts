import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '@/types';

interface AuthState {
  user: UserInfo | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const loadFromStorage = (): Partial<AuthState> => {
  try {
    const user = localStorage.getItem('cms_user');
    const accessToken = localStorage.getItem('cms_access_token');
    const refreshToken = localStorage.getItem('cms_refresh_token');
    if (accessToken && user) {
      return {
        user: JSON.parse(user),
        accessToken,
        refreshToken,
        isAuthenticated: true,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return {};
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  ...loadFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserInfo; accessToken: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem('cms_user', JSON.stringify(action.payload.user));
      localStorage.setItem('cms_access_token', action.payload.accessToken);
      localStorage.setItem('cms_refresh_token', action.payload.refreshToken);
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('cms_access_token', action.payload.accessToken);
      localStorage.setItem('cms_refresh_token', action.payload.refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('cms_user');
      localStorage.removeItem('cms_access_token');
      localStorage.removeItem('cms_refresh_token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserInfo>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('cms_user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, setTokens, logout, setLoading, updateUser } = authSlice.actions;
export default authSlice.reducer;

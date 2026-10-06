import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: (localStorage.getItem('cms_theme') as 'light' | 'dark') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('cms_theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('cms_theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;

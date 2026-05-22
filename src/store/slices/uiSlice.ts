import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '@/types';

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: 'dark',
  connectionStatus: 'connected',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setTheme(state, action: PayloadAction<'dark' | 'light'>) { state.theme = action.payload; },
    setConnectionStatus(state, action: PayloadAction<UIState['connectionStatus']>) { state.connectionStatus = action.payload; },
  },
});

export const { toggleSidebar, setTheme, setConnectionStatus } = uiSlice.actions;
export default uiSlice.reducer;

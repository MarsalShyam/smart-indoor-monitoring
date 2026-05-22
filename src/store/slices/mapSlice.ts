import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapState } from '@/types';
import { mockFloorPlans } from '@/data/mockData';

const initialState: MapState = {
  floors: mockFloorPlans,
  activeFloor: 1,
  zoom: 1,
  pan: { x: 0, y: 0 },
  showPaths: false,
  showGrid: false,
  showHeatmap: false,
  selectedDevice: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setActiveFloor(state, action: PayloadAction<number>) { state.activeFloor = action.payload; },
    setZoom(state, action: PayloadAction<number>) { state.zoom = Math.max(0.5, Math.min(3, action.payload)); },
    setPan(state, action: PayloadAction<{ x: number; y: number }>) { state.pan = action.payload; },
    togglePaths(state) { state.showPaths = !state.showPaths; },
    toggleGrid(state) { state.showGrid = !state.showGrid; },
    toggleHeatmap(state) { state.showHeatmap = !state.showHeatmap; },
    selectDevice(state, action: PayloadAction<string | null>) { state.selectedDevice = action.payload; },
  },
});

export const { setActiveFloor, setZoom, setPan, togglePaths, toggleGrid, toggleHeatmap, selectDevice } = mapSlice.actions;
export default mapSlice.reducer;

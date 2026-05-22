import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Device, ActivityLogEntry, Position } from '@/types';
import { mockDevices, mockActivityLog } from '@/data/mockData';

interface DevicesState {
  devices: Device[];
  activityLog: ActivityLogEntry[];
  movementHistory: Record<string, Position[]>;
}

const initialState: DevicesState = {
  devices: mockDevices,
  activityLog: mockActivityLog,
  movementHistory: {},
};

const devicesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    updateDevicePosition(state, action: PayloadAction<{ id: string; position: Position; floor: number }>) {
      const device = state.devices.find(d => d.id === action.payload.id);
      if (device) {
        device.currentPosition = action.payload.position;
        device.lastSeen = action.payload.position.timestamp;
        device.floor = action.payload.floor;
        // Track history
        if (!state.movementHistory[device.id]) state.movementHistory[device.id] = [];
        state.movementHistory[device.id].push(action.payload.position);
        // Keep last 100 positions
        if (state.movementHistory[device.id].length > 100) {
          state.movementHistory[device.id] = state.movementHistory[device.id].slice(-100);
        }
      }
    },
    addActivityLog(state, action: PayloadAction<ActivityLogEntry>) {
      state.activityLog.unshift(action.payload);
      if (state.activityLog.length > 50) state.activityLog = state.activityLog.slice(0, 50);
    },
    updateDeviceStatus(state, action: PayloadAction<{ id: string; status: Device['status'] }>) {
      const device = state.devices.find(d => d.id === action.payload.id);
      if (device) device.status = action.payload.status;
    },
    addDevice(state, action: PayloadAction<Device>) {
      state.devices.push(action.payload);
    },
    removeDevice(state, action: PayloadAction<string>) {
      state.devices = state.devices.filter(d => d.id !== action.payload);
    },
  },
});

export const { updateDevicePosition, addActivityLog, updateDeviceStatus, addDevice, removeDevice } = devicesSlice.actions;
export default devicesSlice.reducer;

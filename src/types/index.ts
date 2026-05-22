// ===== Auth Types =====
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ===== Device Types =====
export type DeviceType = 'staff' | 'patient' | 'equipment';
export type DeviceStatus = 'active' | 'idle' | 'offline';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  battery: number;
  assignedTo?: string;
  lastSeen: string;
  currentPosition: Position;
  floor: number;
}

export interface Position {
  x: number;
  y: number;
  zone: string;
  timestamp: string;
}

export interface DeviceMovement {
  deviceId: string;
  positions: Position[];
}

// ===== Map Types =====
export interface Zone {
  id: string;
  name: string;
  type: 'room' | 'corridor' | 'department' | 'lobby';
  floor: number;
  bounds: { x: number; y: number; width: number; height: number };
  color: string;
}

export interface AccessPoint {
  id: string;
  name: string;
  position: { x: number; y: number };
  floor: number;
  signalStrength: number;
}

export interface FloorPlan {
  id: number;
  name: string;
  zones: Zone[];
  accessPoints: AccessPoint[];
  dimensions: { width: number; height: number };
}

export interface MapState {
  floors: FloorPlan[];
  activeFloor: number;
  zoom: number;
  pan: { x: number; y: number };
  showPaths: boolean;
  showGrid: boolean;
  showHeatmap: boolean;
  selectedDevice: string | null;
}

// ===== RSSI Types =====
export interface RSSIReading {
  accessPointId: string;
  signalStrength: number;
  timestamp: string;
}

export interface FingerprintRecord {
  id: string;
  position: { x: number; y: number };
  readings: RSSIReading[];
  floor: number;
}

// ===== Analytics Types =====
export interface AnalyticsState {
  rssiHistory: Record<string, RSSIReading[]>;
  accuracyMetrics: {
    errorRadius: number;
    confidence: number;
    method: string;
  };
  deviceActivitySummary: Record<string, {
    zoneTime: Record<string, number>;
    movementFrequency: number;
    isIdle: boolean;
  }>;
}

// ===== Activity Log =====
export interface ActivityLogEntry {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'zone_enter' | 'zone_exit' | 'alert' | 'status_change';
  message: string;
  timestamp: string;
  zone?: string;
}

// ===== UI State =====
export interface UIState {
  sidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
}

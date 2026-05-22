import { User, Device, FloorPlan, AccessPoint, Zone, ActivityLogEntry, FingerprintRecord } from '@/types';

// ===== Users =====
export const mockUsers: (User & { password: string })[] = [
  { id: 'u1', username: 'admin', password: 'admin123', name: 'Mr. Sawej Alam', role: 'admin', email: 'sawejmanager.org' },
  { id: 'u2', username: 'user', password: 'user123', name: 'Shyam Kumar', role: 'user', email: 'shyam@customer.org' },
];

// ===== Zones per floor =====
const floor1Zones: Zone[] = [
  { id: 'z1', name: 'Main Lobby', type: 'lobby', floor: 1, bounds: { x: 50, y: 200, width: 200, height: 150 }, color: 'hsl(190 100% 50% / 0.15)' },
  { id: 'z2', name: 'Emergency Room', type: 'department', floor: 1, bounds: { x: 300, y: 50, width: 250, height: 180 }, color: 'hsl(0 85% 55% / 0.15)' },
  { id: 'z3', name: 'Reception', type: 'room', floor: 1, bounds: { x: 50, y: 50, width: 200, height: 120 }, color: 'hsl(150 100% 45% / 0.15)' },
  { id: 'z4', name: 'Corridor A', type: 'corridor', floor: 1, bounds: { x: 250, y: 230, width: 300, height: 50 }, color: 'hsl(230 30% 20% / 0.15)' },
  { id: 'z5', name: 'Pharmacy', type: 'room', floor: 1, bounds: { x: 600, y: 50, width: 180, height: 150 }, color: 'hsl(280 100% 60% / 0.15)' },
  { id: 'z6', name: 'Radiology', type: 'department', floor: 1, bounds: { x: 600, y: 250, width: 180, height: 150 }, color: 'hsl(50 100% 55% / 0.15)' },
  { id: 'z7', name: 'Cafeteria', type: 'room', floor: 1, bounds: { x: 300, y: 300, width: 250, height: 120 }, color: 'hsl(30 80% 50% / 0.15)' },
];

const floor2Zones: Zone[] = [
  { id: 'z8', name: 'ICU', type: 'department', floor: 2, bounds: { x: 50, y: 50, width: 300, height: 180 }, color: 'hsl(0 85% 55% / 0.15)' },
  { id: 'z9', name: 'Surgery Wing', type: 'department', floor: 2, bounds: { x: 400, y: 50, width: 380, height: 180 }, color: 'hsl(280 100% 60% / 0.15)' },
  { id: 'z10', name: 'Corridor B', type: 'corridor', floor: 2, bounds: { x: 50, y: 230, width: 730, height: 50 }, color: 'hsl(230 30% 20% / 0.15)' },
  { id: 'z11', name: 'Recovery Room', type: 'room', floor: 2, bounds: { x: 50, y: 300, width: 250, height: 120 }, color: 'hsl(150 100% 45% / 0.15)' },
  { id: 'z12', name: 'Lab', type: 'room', floor: 2, bounds: { x: 350, y: 300, width: 200, height: 120 }, color: 'hsl(190 100% 50% / 0.15)' },
  { id: 'z13', name: 'Staff Lounge', type: 'room', floor: 2, bounds: { x: 600, y: 300, width: 180, height: 120 }, color: 'hsl(50 100% 55% / 0.15)' },
];

// ===== Access Points =====
const floor1APs: AccessPoint[] = [
  { id: 'ap1', name: 'AP-Lobby', position: { x: 150, y: 275 }, floor: 1, signalStrength: -45 },
  { id: 'ap2', name: 'AP-ER', position: { x: 425, y: 140 }, floor: 1, signalStrength: -50 },
  { id: 'ap3', name: 'AP-Pharmacy', position: { x: 690, y: 125 }, floor: 1, signalStrength: -48 },
  { id: 'ap4', name: 'AP-Corridor-A', position: { x: 400, y: 255 }, floor: 1, signalStrength: -42 },
  { id: 'ap5', name: 'AP-Radiology', position: { x: 690, y: 325 }, floor: 1, signalStrength: -52 },
];

const floor2APs: AccessPoint[] = [
  { id: 'ap6', name: 'AP-ICU', position: { x: 200, y: 140 }, floor: 2, signalStrength: -44 },
  { id: 'ap7', name: 'AP-Surgery', position: { x: 590, y: 140 }, floor: 2, signalStrength: -47 },
  { id: 'ap8', name: 'AP-Corridor-B', position: { x: 415, y: 255 }, floor: 2, signalStrength: -40 },
  { id: 'ap9', name: 'AP-Recovery', position: { x: 175, y: 360 }, floor: 2, signalStrength: -50 },
  { id: 'ap10', name: 'AP-Lab', position: { x: 450, y: 360 }, floor: 2, signalStrength: -46 },
];

// ===== Floor Plans =====
export const mockFloorPlans: FloorPlan[] = [
  { id: 1, name: 'Ground Floor', zones: floor1Zones, accessPoints: floor1APs, dimensions: { width: 830, height: 470 } },
  { id: 2, name: 'First Floor', zones: floor2Zones, accessPoints: floor2APs, dimensions: { width: 830, height: 470 } },
];

// ===== Devices =====
const now = new Date().toISOString();

export const mockDevices: Device[] = [
  {
    id: 'd1',
    name: 'Dr. Arjun Reddy Badge',
    type: 'staff',
    status: 'active',
    battery: 85,
    assignedTo: 'u1',
    lastSeen: now,
    currentPosition: {
      x: 120,
      y: 100,
      zone: 'Reception',
      timestamp: now
    },
    floor: 1
  },

  {
    id: 'd2',
    name: 'Dr. Priya Sharma Badge',
    type: 'staff',
    status: 'active',
    battery: 72,
    lastSeen: now,
    currentPosition: {
      x: 350,
      y: 100,
      zone: 'Emergency Room',
      timestamp: now
    },
    floor: 1
  },

  {
    id: 'd3',
    name: 'Nurse Kavya Iyer Badge',
    type: 'staff',
    status: 'active',
    battery: 90,
    lastSeen: now,
    currentPosition: {
      x: 100,
      y: 100,
      zone: 'ICU',
      timestamp: now
    },
    floor: 2
  },

  {
    id: 'd4',
    name: 'Rahul Verma Wristband',
    type: 'patient',
    status: 'active',
    battery: 65,
    lastSeen: now,
    currentPosition: {
      x: 400,
      y: 120,
      zone: 'Emergency Room',
      timestamp: now
    },
    floor: 1
  },

  {
    id: 'd5',
    name: 'Ananya Nair Wristband',
    type: 'patient',
    status: 'active',
    battery: 45,
    lastSeen: now,
    currentPosition: {
      x: 150,
      y: 350,
      zone: 'Recovery Room',
      timestamp: now
    },
    floor: 2
  },

  {
    id: 'd6',
    name: 'Vikram Singh Wristband',
    type: 'patient',
    status: 'idle',
    battery: 30,
    lastSeen: now,
    currentPosition: {
      x: 200,
      y: 140,
      zone: 'ICU',
      timestamp: now
    },
    floor: 2
  },

  {
    id: 'd7',
    name: 'Ventilator Unit Alpha',
    type: 'equipment',
    status: 'active',
    battery: 100,
    lastSeen: now,
    currentPosition: {
      x: 250,
      y: 120,
      zone: 'ICU',
      timestamp: now
    },
    floor: 2
  },

  {
    id: 'd8',
    name: 'Defibrillator Cart Delta',
    type: 'equipment',
    status: 'active',
    battery: 95,
    lastSeen: now,
    currentPosition: {
      x: 500,
      y: 100,
      zone: 'Surgery Wing',
      timestamp: now
    },
    floor: 2
  },

  {
    id: 'd9',
    name: 'Wheelchair Unit 03',
    type: 'equipment',
    status: 'idle',
    battery: 80,
    lastSeen: now,
    currentPosition: {
      x: 100,
      y: 260,
      zone: 'Main Lobby',
      timestamp: now
    },
    floor: 1
  },

  {
    id: 'd10',
    name: 'Dr. Suresh Menon Badge',
    type: 'staff',
    status: 'active',
    battery: 55,
    lastSeen: now,
    currentPosition: {
      x: 650,
      y: 100,
      zone: 'Pharmacy',
      timestamp: now
    },
    floor: 1
  },

  {
    id: 'd11',
    name: 'Meera Krishnan Wristband',
    type: 'patient',
    status: 'active',
    battery: 70,
    lastSeen: now,
    currentPosition: {
      x: 650,
      y: 300,
      zone: 'Radiology',
      timestamp: now
    },
    floor: 1
  },

  {
    id: 'd12',
    name: 'Nurse Lakshmi Pillai Badge',
    type: 'staff',
    status: 'active',
    battery: 88,
    lastSeen: now,
    currentPosition: {
      x: 500,
      y: 120,
      zone: 'Surgery Wing',
      timestamp: now
    },
    floor: 2
  },

  {
    id: 'd13',
    name: 'IV Pump Unit 07',
    type: 'equipment',
    status: 'active',
    battery: 60,
    lastSeen: now,
    currentPosition: {
      x: 380,
      y: 350,
      zone: 'Lab',
      timestamp: now
    },
    floor: 2
  },

  {
    id: 'd14',
    name: 'Karthik Subramanian Wristband',
    type: 'patient',
    status: 'offline',
    battery: 5,
    lastSeen: now,
    currentPosition: {
      x: 350,
      y: 350,
      zone: 'Cafeteria',
      timestamp: now
    },
    floor: 1
  },

  {
    id: 'd15',
    name: 'Portable X-Ray Scanner',
    type: 'equipment',
    status: 'active',
    battery: 75,
    lastSeen: now,
    currentPosition: {
      x: 700,
      y: 300,
      zone: 'Radiology',
      timestamp: now
    },
    floor: 1
  }
];

// ===== Activity Log =====
export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 'a1',
    deviceId: 'd1',
    deviceName: 'Dr. Arjun Reddy Badge',
    type: 'zone_enter',
    message: 'Entered Reception',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    zone: 'Reception'
  },

  {
    id: 'a2',
    deviceId: 'd4',
    deviceName: 'Rahul Verma Wristband',
    type: 'zone_enter',
    message: 'Entered Emergency Room',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    zone: 'Emergency Room'
  },

  {
    id: 'a3',
    deviceId: 'd7',
    deviceName: 'Ventilator Unit Alpha',
    type: 'status_change',
    message: 'Status changed to active',
    timestamp: new Date(Date.now() - 180000).toISOString()
  },

  {
    id: 'a4',
    deviceId: 'd14',
    deviceName: 'Karthik Subramanian Wristband',
    type: 'alert',
    message: 'Battery critically low (5%)',
    timestamp: new Date(Date.now() - 240000).toISOString()
  },

  {
    id: 'a5',
    deviceId: 'd3',
    deviceName: 'Nurse Kavya Iyer Badge',
    type: 'zone_exit',
    message: 'Exited ICU',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    zone: 'ICU'
  },

  {
    id: 'a6',
    deviceId: 'd8',
    deviceName: 'Defibrillator Cart Delta',
    type: 'zone_enter',
    message: 'Entered Surgery Wing',
    timestamp: new Date(Date.now() - 360000).toISOString(),
    zone: 'Surgery Wing'
  },

  {
    id: 'a7',
    deviceId: 'd2',
    deviceName: 'Dr. Priya Sharma Badge',
    type: 'zone_enter',
    message: 'Entered Emergency Room',
    timestamp: new Date(Date.now() - 420000).toISOString(),
    zone: 'Emergency Room'
  },

  {
    id: 'a8',
    deviceId: 'd11',
    deviceName: 'Meera Krishnan Wristband',
    type: 'zone_enter',
    message: 'Entered Radiology',
    timestamp: new Date(Date.now() - 480000).toISOString(),
    zone: 'Radiology'
  },

  {
    id: 'a9',
    deviceId: 'd5',
    deviceName: 'Ananya Nair Wristband',
    type: 'zone_enter',
    message: 'Entered Recovery Room',
    timestamp: new Date(Date.now() - 540000).toISOString(),
    zone: 'Recovery Room'
  },

  {
    id: 'a10',
    deviceId: 'd10',
    deviceName: 'Dr. Suresh Menon Badge',
    type: 'zone_enter',
    message: 'Entered Pharmacy',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    zone: 'Pharmacy'
  },

  {
    id: 'a11',
    deviceId: 'd12',
    deviceName: 'Nurse Lakshmi Pillai Badge',
    type: 'zone_enter',
    message: 'Entered Surgery Wing',
    timestamp: new Date(Date.now() - 660000).toISOString(),
    zone: 'Surgery Wing'
  },

  {
    id: 'a12',
    deviceId: 'd6',
    deviceName: 'Vikram Singh Wristband',
    type: 'status_change',
    message: 'Status changed to idle',
    timestamp: new Date(Date.now() - 720000).toISOString()
  },

  {
    id: 'a13',
    deviceId: 'd13',
    deviceName: 'IV Pump Unit 07',
    type: 'zone_enter',
    message: 'Entered Lab',
    timestamp: new Date(Date.now() - 780000).toISOString(),
    zone: 'Lab'
  },

  {
    id: 'a14',
    deviceId: 'd9',
    deviceName: 'Wheelchair Unit 03',
    type: 'zone_exit',
    message: 'Exited Main Lobby',
    timestamp: new Date(Date.now() - 840000).toISOString(),
    zone: 'Main Lobby'
  },

  {
    id: 'a15',
    deviceId: 'd15',
    deviceName: 'Portable X-Ray Scanner',
    type: 'zone_enter',
    message: 'Entered Radiology',
    timestamp: new Date(Date.now() - 900000).toISOString(),
    zone: 'Radiology'
  }
];

// ===== Fingerprint Dataset =====
export const mockFingerprints: FingerprintRecord[] = [
  { id: 'fp1', position: { x: 150, y: 275 }, floor: 1, readings: [
    { accessPointId: 'ap1', signalStrength: -30, timestamp: now },
    { accessPointId: 'ap2', signalStrength: -65, timestamp: now },
    { accessPointId: 'ap4', signalStrength: -55, timestamp: now },
  ]},
  { id: 'fp2', position: { x: 425, y: 140 }, floor: 1, readings: [
    { accessPointId: 'ap1', signalStrength: -60, timestamp: now },
    { accessPointId: 'ap2', signalStrength: -32, timestamp: now },
    { accessPointId: 'ap4', signalStrength: -48, timestamp: now },
  ]},
  { id: 'fp3', position: { x: 200, y: 140 }, floor: 2, readings: [
    { accessPointId: 'ap6', signalStrength: -28, timestamp: now },
    { accessPointId: 'ap7', signalStrength: -62, timestamp: now },
    { accessPointId: 'ap8', signalStrength: -50, timestamp: now },
  ]},
];

// Helper: get random position within a zone
export function getRandomPositionInZone(zone: Zone): { x: number; y: number } {
  return {
    x: zone.bounds.x + Math.random() * zone.bounds.width,
    y: zone.bounds.y + Math.random() * zone.bounds.height,
  };
}

// Helper: get zone name by position
export function getZoneAtPosition(x: number, y: number, zones: Zone[]): string {
  for (const zone of zones) {
    const b = zone.bounds;
    if (x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height) {
      return zone.name;
    }
  }
  return 'Unknown';
}

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateDevicePosition, addActivityLog } from '@/store/slices/devicesSlice';
import { mockFloorPlans, getZoneAtPosition } from '@/data/mockData';

export function useDeviceSimulation() {
  const dispatch = useAppDispatch();
  const devices = useAppSelector(s => s.devices.devices);
  const velocities = useRef<Record<string, { vx: number; vy: number }>>({});

  useEffect(() => {
    // Init velocities
    devices.forEach(d => {
      if (!velocities.current[d.id]) {
        velocities.current[d.id] = {
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
        };
      }
    });

    const interval = setInterval(() => {
      devices.forEach(device => {
        if (device.status === 'offline') return;
        
        const floor = mockFloorPlans.find(f => f.id === device.floor);
        if (!floor) return;

        const vel = velocities.current[device.id];
        if (!vel) return;

        // Occasionally change direction
        if (Math.random() < 0.1) {
          vel.vx = (Math.random() - 0.5) * 5;
          vel.vy = (Math.random() - 0.5) * 5;
        }

        // Idle devices move slower
        const speedMultiplier = device.status === 'idle' ? 0.2 : 1;

        let newX = device.currentPosition.x + vel.vx * speedMultiplier;
        let newY = device.currentPosition.y + vel.vy * speedMultiplier;

        // Clamp to floor bounds
        newX = Math.max(30, Math.min(floor.dimensions.width - 30, newX));
        newY = Math.max(30, Math.min(floor.dimensions.height - 30, newY));

        // Bounce off edges
        if (newX <= 30 || newX >= floor.dimensions.width - 30) vel.vx *= -1;
        if (newY <= 30 || newY >= floor.dimensions.height - 30) vel.vy *= -1;

        const oldZone = device.currentPosition.zone;
        const newZone = getZoneAtPosition(newX, newY, floor.zones);
        const timestamp = new Date().toISOString();

        dispatch(updateDevicePosition({
          id: device.id,
          position: { x: newX, y: newY, zone: newZone, timestamp },
          floor: device.floor,
        }));

        // Log zone changes
        if (newZone !== oldZone && newZone !== 'Unknown' && Math.random() < 0.5) {
          dispatch(addActivityLog({
            id: `a-${Date.now()}-${device.id}`,
            deviceId: device.id,
            deviceName: device.name,
            type: 'zone_enter',
            message: `Entered ${newZone}`,
            timestamp,
            zone: newZone,
          }));
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [devices.length]);
}

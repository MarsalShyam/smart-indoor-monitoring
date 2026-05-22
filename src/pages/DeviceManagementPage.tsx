import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { addDevice, removeDevice, updateDeviceStatus } from '@/store/slices/devicesSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Monitor, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Device } from '@/types';

const DeviceManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const devices = useAppSelector(s => s.devices.devices);
  const user = useAppSelector(s => s.auth.user);

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-muted-foreground font-mono">Access restricted to administrators.</p>
      </div>
    );
  }

  const typeColor: Record<string, string> = {
    staff: 'bg-primary/20 text-primary',
    patient: 'bg-secondary/20 text-secondary',
    equipment: 'bg-accent/20 text-accent',
  };

  const statusColor: Record<string, string> = {
    active: 'bg-accent/20 text-accent',
    idle: 'bg-neon-yellow/20 text-neon-yellow',
    offline: 'bg-destructive/20 text-destructive',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-primary text-glow-cyan">DEVICE MANAGEMENT</h1>
          <p className="text-muted-foreground text-sm font-mono">Manage tracked devices & assignments</p>
        </div>
        <Button size="sm" className="font-mono text-xs glow-cyan">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Device
        </Button>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-mono text-xs text-primary">DEVICE</TableHead>
                <TableHead className="font-mono text-xs text-primary">TYPE</TableHead>
                <TableHead className="font-mono text-xs text-primary">STATUS</TableHead>
                <TableHead className="font-mono text-xs text-primary">LOCATION</TableHead>
                <TableHead className="font-mono text-xs text-primary">FLOOR</TableHead>
                <TableHead className="font-mono text-xs text-primary">BATTERY</TableHead>
                <TableHead className="font-mono text-xs text-primary">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map(device => (
                <TableRow key={device.id} className="border-border/30 hover:bg-muted/30">
                  <TableCell className="font-medium text-sm">{device.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-[10px] font-mono', typeColor[device.type])}>
                      {device.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-[10px] font-mono', statusColor[device.status])}>
                      {device.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{device.currentPosition.zone}</TableCell>
                  <TableCell className="text-xs font-mono">{device.floor}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', device.battery > 50 ? 'bg-accent' : device.battery > 20 ? 'bg-neon-yellow' : 'bg-destructive')}
                          style={{ width: `${device.battery}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{device.battery}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => dispatch(removeDevice(device.id))}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceManagementPage;

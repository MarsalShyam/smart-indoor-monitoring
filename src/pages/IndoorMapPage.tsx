import React, { useRef, useState, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { useDeviceSimulation } from '@/hooks/useDeviceSimulation';
import { setActiveFloor, setZoom, setPan, togglePaths, toggleGrid, selectDevice } from '@/store/slices/mapSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Grid3X3, Route, Layers, Wifi, User, Heart, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

const deviceTypeColors: Record<string, string> = {
  staff: 'hsl(190, 100%, 50%)',
  patient: 'hsl(310, 100%, 60%)',
  equipment: 'hsl(150, 100%, 45%)',
};

const deviceTypeIcons: Record<string, React.ReactNode> = {
  staff: <User className="w-3 h-3" />,
  patient: <Heart className="w-3 h-3" />,
  equipment: <Wrench className="w-3 h-3" />,
};

const IndoorMapPage: React.FC = () => {
  useDeviceSimulation();

  const dispatch = useAppDispatch();
  const { floors, activeFloor, zoom, pan, showPaths, showGrid, selectedDevice } = useAppSelector(s => s.map);
  const devices = useAppSelector(s => s.devices.devices);
  const movementHistory = useAppSelector(s => s.devices.movementHistory);

  const floor = floors.find(f => f.id === activeFloor);
  const floorDevices = devices.filter(d => d.floor === activeFloor);

  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    dispatch(setZoom(zoom + delta));
  }, [zoom, dispatch]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    dispatch(setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!floor) return null;

  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-primary text-glow-cyan">INDOOR MAP</h1>
          <p className="text-muted-foreground text-sm font-mono">Hospital Campus — Floor {activeFloor}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Floor tabs */}
          {floors.map(f => (
            <Button
              key={f.id}
              variant={f.id === activeFloor ? 'default' : 'outline'}
              size="sm"
              onClick={() => dispatch(setActiveFloor(f.id))}
              className={cn('font-mono text-xs', f.id === activeFloor && 'glow-cyan')}
            >
              <Layers className="w-3 h-3 mr-1" /> {f.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Map Area */}
        <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
          <CardContent className="p-0 h-full">
            {/* Controls overlay */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
              <Button variant="outline" size="icon" onClick={() => dispatch(setZoom(zoom + 0.2))} className="bg-card/80 backdrop-blur-sm border-primary/20 h-8 w-8">
                <ZoomIn className="w-3.5 h-3.5 text-primary" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => dispatch(setZoom(zoom - 0.2))} className="bg-card/80 backdrop-blur-sm border-primary/20 h-8 w-8">
                <ZoomOut className="w-3.5 h-3.5 text-primary" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => dispatch(toggleGrid())} className={cn('bg-card/80 backdrop-blur-sm border-primary/20 h-8 w-8', showGrid && 'border-primary glow-cyan')}>
                <Grid3X3 className="w-3.5 h-3.5 text-primary" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => dispatch(togglePaths())} className={cn('bg-card/80 backdrop-blur-sm border-primary/20 h-8 w-8', showPaths && 'border-primary glow-cyan')}>
                <Route className="w-3.5 h-3.5 text-primary" />
              </Button>
            </div>

            {/* SVG Map */}
            <div
              className="w-full h-full cursor-grab active:cursor-grabbing"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <svg
                ref={svgRef}
                viewBox={`0 0 ${floor.dimensions.width} ${floor.dimensions.height}`}
                className="w-full h-full"
                style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)` }}
              >
                {/* Background */}
                <rect width={floor.dimensions.width} height={floor.dimensions.height} fill="hsl(230, 25%, 7%)" rx="8" />

                {/* Grid */}
                {showGrid && (
                  <g opacity="0.15">
                    {Array.from({ length: Math.ceil(floor.dimensions.width / 20) }, (_, i) => (
                      <line key={`vg${i}`} x1={i * 20} y1={0} x2={i * 20} y2={floor.dimensions.height} stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: Math.ceil(floor.dimensions.height / 20) }, (_, i) => (
                      <line key={`hg${i}`} x1={0} y1={i * 20} x2={floor.dimensions.width} y2={i * 20} stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" />
                    ))}
                  </g>
                )}

                {/* Zones */}
                {floor.zones.map(zone => (
                  <g key={zone.id}>
                    <rect
                      x={zone.bounds.x} y={zone.bounds.y}
                      width={zone.bounds.width} height={zone.bounds.height}
                      fill={zone.color} stroke="hsl(190, 100%, 50%)" strokeWidth="0.5" strokeOpacity="0.3"
                      rx="4"
                      className="cursor-pointer hover:stroke-opacity-80 transition-all"
                    />
                    <text
                      x={zone.bounds.x + zone.bounds.width / 2}
                      y={zone.bounds.y + zone.bounds.height / 2}
                      textAnchor="middle" dominantBaseline="middle"
                      fill="hsl(190, 100%, 80%)" fontSize="11" fontFamily="Share Tech Mono" opacity="0.7"
                    >
                      {zone.name}
                    </text>
                  </g>
                ))}

                {/* Access Points */}
                {floor.accessPoints.map(ap => (
                  <g key={ap.id}>
                    <circle cx={ap.position.x} cy={ap.position.y} r="6" fill="none" stroke="hsl(150, 100%, 45%)" strokeWidth="1" opacity="0.4" />
                    <circle cx={ap.position.x} cy={ap.position.y} r="3" fill="hsl(150, 100%, 45%)" opacity="0.6" />
                    <circle cx={ap.position.x} cy={ap.position.y} r="18" fill="none" stroke="hsl(150, 100%, 45%)" strokeWidth="0.5" opacity="0.15">
                      <animate attributeName="r" values="12;22;12" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}

                {/* Movement paths */}
                {showPaths && floorDevices.map(device => {
                  const history = movementHistory[device.id];
                  if (!history || history.length < 2) return null;
                  const pathD = history.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  return (
                    <path key={`path-${device.id}`} d={pathD} fill="none" stroke={deviceTypeColors[device.type]} strokeWidth="1.5" opacity="0.3" strokeDasharray="4 2" />
                  );
                })}

                {/* Device markers */}
                {floorDevices.map(device => {
                  const color = deviceTypeColors[device.type];
                  const isSelected = selectedDevice === device.id;
                  return (
                    <g
                      key={device.id}
                      className="cursor-pointer"
                      onClick={() => dispatch(selectDevice(isSelected ? null : device.id))}
                    >
                      {/* Pulse ring */}
                      {device.status === 'active' && (
                        <circle cx={device.currentPosition.x} cy={device.currentPosition.y} r="12" fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                          <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.3;0.05;0.3" dur="2s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Selection ring */}
                      {isSelected && (
                        <circle cx={device.currentPosition.x} cy={device.currentPosition.y} r="16" fill="none" stroke={color} strokeWidth="2" opacity="0.8" strokeDasharray="3 2">
                          <animateTransform attributeName="transform" type="rotate" from={`0 ${device.currentPosition.x} ${device.currentPosition.y}`} to={`360 ${device.currentPosition.x} ${device.currentPosition.y}`} dur="4s" repeatCount="indefinite" />
                        </circle>
                      )}
                      {/* Main dot */}
                      <circle cx={device.currentPosition.x} cy={device.currentPosition.y} r="6" fill={color} stroke="hsl(230, 25%, 7%)" strokeWidth="2" />
                      {/* Label */}
                      {(isSelected || zoom > 1.2) && (
                        <text
                          x={device.currentPosition.x} y={device.currentPosition.y - 14}
                          textAnchor="middle" fill={color} fontSize="8" fontFamily="Share Tech Mono"
                        >
                          {device.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Device Panel */}
        <Card className="w-72 shrink-0 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="font-orbitron text-sm text-primary flex items-center gap-2">
              <Wifi className="w-4 h-4" /> DEVICES ({floorDevices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 overflow-y-auto max-h-[calc(100vh-220px)]">
            <div className="space-y-1.5">
              {floorDevices.map(device => (
                <motion.div
                  key={device.id}
                  onClick={() => dispatch(selectDevice(selectedDevice === device.id ? null : device.id))}
                  className={cn(
                    'p-2.5 rounded-lg border cursor-pointer transition-all',
                    selectedDevice === device.id
                      ? 'border-primary/40 bg-muted/50 glow-cyan'
                      : 'border-border/30 bg-muted/20 hover:border-primary/20'
                  )}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: deviceTypeColors[device.type] }} />
                    <span className="text-xs font-medium truncate flex-1">{device.name}</span>
                    <span className={cn(
                      'text-[10px] font-mono px-1.5 py-0.5 rounded',
                      device.status === 'active' ? 'bg-accent/20 text-accent' :
                      device.status === 'idle' ? 'bg-neon-yellow/20 text-neon-yellow' : 'bg-destructive/20 text-destructive'
                    )}>
                      {device.status}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span>{device.currentPosition.zone}</span>
                    <span>🔋 {device.battery}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndoorMapPage;

import React from 'react';
import { useAppSelector } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Globe, Palette, Languages, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

const SettingsPage: React.FC = () => {
  const { connectionStatus, theme } = useAppSelector(s => s.ui);

  const settings = [
    { label: 'API Base URL', value: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', icon: Globe },
    { label: 'Theme', value: theme, icon: Palette },
    { label: 'Locale', value: 'en-US (stub)', icon: Languages },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-primary text-glow-cyan">SETTINGS</h1>
        <p className="text-muted-foreground text-sm font-mono">System configuration & preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-orbitron text-sm text-primary flex items-center gap-2">
              <Settings className="w-4 h-4" /> ENVIRONMENT
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2">
                  <s.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-muted-foreground">{s.label}</span>
                </div>
                <span className="text-sm font-mono text-foreground">{s.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-orbitron text-sm text-primary flex items-center gap-2">
              <Wifi className="w-4 h-4" /> CONNECTION STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-3 h-3 rounded-full',
                connectionStatus === 'connected' ? 'bg-accent animate-pulse-glow' :
                connectionStatus === 'reconnecting' ? 'bg-neon-yellow animate-pulse' : 'bg-destructive'
              )} />
              <span className="font-mono text-sm capitalize">{connectionStatus}</span>
            </div>
            <div className="space-y-2 text-xs font-mono text-muted-foreground">
              <p>WebSocket: <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent">Simulated</Badge></p>
              <p>Data Source: <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">Mock Local</Badge></p>
              <p>Update Interval: <span className="text-foreground">2000ms</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

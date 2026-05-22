import React from 'react';
import { useAppSelector } from '@/store';
import { useDeviceSimulation } from '@/hooks/useDeviceSimulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Wifi, Activity, Clock, AlertTriangle, Users, Cpu, Heart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const DashboardPage: React.FC = () => {
  useDeviceSimulation();
  
  const devices = useAppSelector(s => s.devices.devices);
  const activityLog = useAppSelector(s => s.devices.activityLog);

  const activeDevices = devices.filter(d => d.status === 'active').length;
  const avgSignal = -45; // simulated
  const alerts = devices.filter(d => d.battery < 20).length;
  const uptime = '99.7%';

  const stats = [
    { label: 'Active Devices', value: activeDevices, total: devices.length, icon: Wifi, color: 'text-primary', glow: 'glow-cyan' },
    { label: 'Avg Signal', value: `${avgSignal} dBm`, icon: Activity, color: 'text-accent', glow: 'glow-green' },
    { label: 'System Uptime', value: uptime, icon: Clock, color: 'text-secondary', glow: 'glow-magenta' },
    { label: 'Active Alerts', value: alerts, icon: AlertTriangle, color: alerts > 0 ? 'text-destructive' : 'text-accent', glow: alerts > 0 ? '' : 'glow-green' },
  ];

  // Device distribution data
  const typeCounts = { staff: 0, patient: 0, equipment: 0 };
  devices.forEach(d => typeCounts[d.type]++);
  const pieData = [
    { name: 'Staff', value: typeCounts.staff, color: 'hsl(190, 100%, 50%)' },
    { name: 'Patients', value: typeCounts.patient, color: 'hsl(310, 100%, 60%)' },
    { name: 'Equipment', value: typeCounts.equipment, color: 'hsl(150, 100%, 45%)' },
  ];

  // Fake signal trend
  const signalTrend = Array.from({ length: 12 }, (_, i) => ({
    time: `${String(i * 2).padStart(2, '0')}:00`,
    signal: -40 + Math.sin(i / 2) * 10 + Math.random() * 5,
  }));

  const typeIcons: Record<string, React.ReactNode> = {
    zone_enter: <Users className="w-3.5 h-3.5 text-accent" />,
    zone_exit: <Users className="w-3.5 h-3.5 text-muted-foreground" />,
    alert: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />,
    status_change: <Cpu className="w-3.5 h-3.5 text-secondary" />,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-orbitron text-2xl font-bold text-primary text-glow-cyan">SYSTEM DASHBOARD</h1>
          <p className="text-muted-foreground text-sm font-mono">Real-time indoor positioning overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          LIVE
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={cn('border-border/50 bg-card/50 backdrop-blur-sm', stat.glow)}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn('p-2.5 rounded-lg bg-muted/50', stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">{stat.label}</p>
                  <p className="text-2xl font-orbitron font-bold">{stat.value}
                    {stat.total !== undefined && <span className="text-sm text-muted-foreground font-rajdhani">/{stat.total}</span>}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signal Trend Chart */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-orbitron text-sm text-primary flex items-center gap-2">
              <Activity className="w-4 h-4" /> SIGNAL QUALITY TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={signalTrend}>
                <defs>
                  <linearGradient id="signalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(190, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="hsl(210, 20%, 35%)" tick={{ fontSize: 10, fontFamily: 'Share Tech Mono' }} />
                <YAxis stroke="hsl(210, 20%, 35%)" tick={{ fontSize: 10, fontFamily: 'Share Tech Mono' }} domain={[-60, -30]} />
                <Area type="monotone" dataKey="signal" stroke="hsl(190, 100%, 50%)" fill="url(#signalGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-orbitron text-sm text-primary flex items-center gap-2">
              <Cpu className="w-4 h-4" /> DEVICE DISTRIBUTION
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} strokeWidth={2} stroke="hsl(230, 25%, 7%)">
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs font-mono">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name} ({d.value})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-orbitron text-sm text-primary flex items-center gap-2">
            <Heart className="w-4 h-4" /> RECENT ACTIVITY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activityLog.slice(0, 10).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30 border border-border/30"
              >
                {typeIcons[entry.type]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    <span className="font-medium text-foreground">{entry.deviceName}</span>
                    <span className="text-muted-foreground"> — {entry.message}</span>
                  </p>
                </div>
                <span className="text-xs text-muted-foreground font-mono shrink-0">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

import React from 'react';
import { useAppSelector } from '@/store';
import { useDeviceSimulation } from '@/hooks/useDeviceSimulation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { Activity, Target, Radio, TrendingUp } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  useDeviceSimulation();
  const devices = useAppSelector(s => s.devices.devices);

  // Simulated RSSI over time
  const rssiData = Array.from({ length: 20 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    'AP-Lobby': -30 - Math.random() * 20,
    'AP-ER': -35 - Math.random() * 25,
    'AP-ICU': -28 - Math.random() * 22,
    'AP-Pharmacy': -40 - Math.random() * 18,
  }));

  // Signal comparison by AP
  const comparisonData = [
    { ap: 'Lobby', strength: -42, quality: 85 },
    { ap: 'ER', strength: -50, quality: 72 },
    { ap: 'ICU', strength: -38, quality: 90 },
    { ap: 'Pharmacy', strength: -48, quality: 76 },
    { ap: 'Surgery', strength: -45, quality: 80 },
    { ap: 'Lab', strength: -52, quality: 68 },
  ];

  // Radar data
  const radarData = comparisonData.map(d => ({ subject: d.ap, A: d.quality }));

  // Accuracy metrics
  const accuracy = { errorRadius: 2.3, confidence: 94.5, method: 'RSSI Fingerprinting + KNN' };

  // Device activity
  const activityData = devices.slice(0, 8).map(d => ({
    name: d.name.split(' ').slice(0, 2).join(' '),
    movements: Math.floor(Math.random() * 50 + 10),
    idle: Math.floor(Math.random() * 30),
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl font-bold text-primary text-glow-cyan">ANALYTICS</h1>
        <p className="text-muted-foreground text-sm font-mono">Signal analysis & positioning metrics</p>
      </div>

      {/* Accuracy Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Error Radius', value: `${accuracy.errorRadius}m`, icon: Target, color: 'text-primary' },
          { label: 'Confidence', value: `${accuracy.confidence}%`, icon: TrendingUp, color: 'text-accent' },
          { label: 'Method', value: accuracy.method, icon: Radio, color: 'text-secondary' },
        ].map((m, i) => (
          <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <m.icon className={`w-5 h-5 ${m.color}`} />
              <div>
                <p className="text-xs text-muted-foreground font-mono uppercase">{m.label}</p>
                <p className="text-lg font-orbitron font-bold">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RSSI Line Chart */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-orbitron text-sm text-primary flex items-center gap-2">
            <Activity className="w-4 h-4" /> RSSI SIGNAL OVER TIME
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={rssiData}>
              <XAxis dataKey="time" stroke="hsl(210,20%,35%)" tick={{ fontSize: 10, fontFamily: 'Share Tech Mono' }} />
              <YAxis stroke="hsl(210,20%,35%)" tick={{ fontSize: 10, fontFamily: 'Share Tech Mono' }} domain={[-70, -20]} />
              <Tooltip contentStyle={{ background: 'hsl(230,30%,10%)', border: '1px solid hsl(190,100%,50%,0.3)', fontFamily: 'Share Tech Mono', fontSize: 11 }} />
              <Line type="monotone" dataKey="AP-Lobby" stroke="hsl(190,100%,50%)" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="AP-ER" stroke="hsl(310,100%,60%)" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="AP-ICU" stroke="hsl(150,100%,45%)" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="AP-Pharmacy" stroke="hsl(50,100%,55%)" dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signal Comparison Bar */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-orbitron text-sm text-primary">SIGNAL STRENGTH BY AP</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparisonData}>
                <XAxis dataKey="ap" stroke="hsl(210,20%,35%)" tick={{ fontSize: 10, fontFamily: 'Share Tech Mono' }} />
                <YAxis stroke="hsl(210,20%,35%)" tick={{ fontSize: 10, fontFamily: 'Share Tech Mono' }} />
                <Tooltip contentStyle={{ background: 'hsl(230,30%,10%)', border: '1px solid hsl(190,100%,50%,0.3)', fontFamily: 'Share Tech Mono', fontSize: 11 }} />
                <Bar dataKey="quality" fill="hsl(190,100%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-orbitron text-sm text-primary">COVERAGE QUALITY RADAR</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(230,30%,18%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontFamily: 'Share Tech Mono', fill: 'hsl(190,100%,80%)' }} />
                <Radar dataKey="A" stroke="hsl(190,100%,50%)" fill="hsl(190,100%,50%)" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Activity */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-orbitron text-sm text-primary">DEVICE ACTIVITY SUMMARY</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <XAxis dataKey="name" stroke="hsl(210,20%,35%)" tick={{ fontSize: 9, fontFamily: 'Share Tech Mono' }} />
              <YAxis stroke="hsl(210,20%,35%)" tick={{ fontSize: 10, fontFamily: 'Share Tech Mono' }} />
              <Tooltip contentStyle={{ background: 'hsl(230,30%,10%)', border: '1px solid hsl(190,100%,50%,0.3)', fontFamily: 'Share Tech Mono', fontSize: 11 }} />
              <Bar dataKey="movements" fill="hsl(190,100%,50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="idle" fill="hsl(310,100%,60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;

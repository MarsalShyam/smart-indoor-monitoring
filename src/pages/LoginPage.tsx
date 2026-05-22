import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { login, clearError } from '@/store/slices/authSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Wifi, Shield, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(s => s.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute inset-0 scanline pointer-events-none" />
      
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
          animate={{ 
            y: [null, Math.random() * -200],
            opacity: [0, 0.8, 0],
          }}
          transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="rounded-xl border border-primary/20 bg-card/80 backdrop-blur-xl p-8 glow-cyan">
          {/* Logo Area */}
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary/40 mb-4 glow-cyan"
              animate={{ boxShadow: ['0 0 10px hsl(190 100% 50% / 0.3)', '0 0 25px hsl(190 100% 50% / 0.5)', '0 0 10px hsl(190 100% 50% / 0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Wifi className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="font-orbitron text-2xl font-bold text-primary text-glow-cyan">IPS TRACKER</h1>
            <p className="text-muted-foreground text-sm mt-1 font-mono">Indoor Position Identification System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-mono uppercase tracking-wider">Username</label>
              <Input
                value={username}
                onChange={e => { setUsername(e.target.value); dispatch(clearError()); }}
                placeholder="Enter username"
                className="bg-muted/50 border-primary/20 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50 font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-mono uppercase tracking-wider">Password</label>
              <Input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); dispatch(clearError()); }}
                placeholder="Enter password"
                className="bg-muted/50 border-primary/20 focus:border-primary/60 text-foreground placeholder:text-muted-foreground/50 font-mono"
              />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-destructive text-sm font-mono">
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={loading} className="w-full font-orbitron tracking-wider glow-cyan">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Shield className="w-4 h-4" />
                </motion.div>
              ) : 'ACCESS SYSTEM'}
            </Button>
          </form>

          {/* <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground font-mono text-center">
              Demo: <span className="text-primary">admin</span> / <span className="text-primary">admin123</span> (Admin)
              <br />
              Demo: <span className="text-primary">user</span> / <span className="text-primary">user123</span> (User)
            </p>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Map, BarChart3, History, Settings, 
  Wifi, LogOut, ChevronLeft, ChevronRight, Monitor, Menu,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map', icon: Map, label: 'Indoor Map' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/history', icon: History, label: 'Movement History' },
  { to: '/devices', icon: Monitor, label: 'Device Management', adminOnly: true },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(s => s.auth);
  const { sidebarCollapsed, connectionStatus } = useAppSelector(s => s.ui);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const filteredNav = navItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="relative flex flex-col border-r border-border bg-sidebar shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg border border-primary/30 glow-cyan">
            <Wifi className="w-4 h-4 text-primary" />
          </div>
          {!sidebarCollapsed && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-orbitron text-sm font-bold text-primary text-glow-cyan truncate">
              IPS TRACKER
            </motion.span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {filteredNav.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-accent text-primary border border-primary/20 glow-cyan'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-primary'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User & Collapse */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          {/* Connection status */}
          <div className="flex items-center gap-2 px-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              connectionStatus === 'connected' ? 'bg-accent animate-pulse-glow' : 
              connectionStatus === 'reconnecting' ? 'bg-neon-yellow animate-pulse' : 'bg-destructive'
            )} />
            {!sidebarCollapsed && (
              <span className="text-xs text-muted-foreground font-mono capitalize">{connectionStatus}</span>
            )}
          </div>

          {/* User info */}
          {!sidebarCollapsed && user && (
            <div className="px-2 py-1">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground font-mono uppercase">{user.role}</p>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => dispatch(toggleSidebar())} className="text-muted-foreground hover:text-primary">
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="scanline pointer-events-none fixed inset-0 z-50 opacity-20" />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

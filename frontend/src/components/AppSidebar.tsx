import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bot, FileText, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/bot', label: 'Bot', icon: Bot },
  { to: '/logs', label: 'Logs', icon: FileText },
];

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path: string) =>
    cn(
      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
      location.pathname === path
        ? 'text-primary-foreground bg-primary/10 text-primary'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    );

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <span className="text-foreground font-semibold text-lg tracking-tight">Bot Notas</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
          Principal
        </p>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass(item.to)}>
            {location.pathname === item.to && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 bg-primary/10 rounded-lg"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <item.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10">{item.label}</span>
          </NavLink>
        ))}


      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {typeof user?.group === 'object' ? (user.group as any)?.name : user?.group}
            </p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

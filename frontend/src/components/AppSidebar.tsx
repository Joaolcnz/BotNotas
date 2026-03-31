import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bot, FileText, LogOut, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useSidebarStore } from '@/store/sidebarStore';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/bot', label: 'Bot', icon: Bot },
  { to: '/cupons', label: 'Cupons', icon: FileText },
];

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const { isCollapsed, toggle } = useSidebarStore();
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path: string) =>
    cn(
      'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative',
      location.pathname === path
        ? 'text-primary-foreground bg-primary/10 text-primary'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent',
      isCollapsed && 'justify-center px-2'
    );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex h-screen bg-sidebar border-r border-sidebar-border flex-col fixed left-0 top-0 z-40"
    >
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground z-50 shadow-sm"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-foreground font-semibold text-lg tracking-tight whitespace-nowrap"
          >
            Bot Notas
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {!isCollapsed && (
          <p className="px-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2 whitespace-nowrap">
            Principal
          </p>
        )}
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass(item.to)} title={isCollapsed ? item.label : undefined}>
            {location.pathname === item.to && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 bg-primary/10 rounded-lg"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <item.icon className="w-4 h-4 relative z-10 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10 whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border overflow-hidden">
        <div className={cn("flex items-center gap-3 mb-3", isCollapsed && "justify-center")}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {typeof user?.group === 'object' ? (user.group as any)?.name : user?.group}
              </p>
            </motion.div>
          )}
        </div>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full",
            isCollapsed && "justify-center px-2"
          )}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap">Sair</span>}
        </button>
      </div>
    </motion.aside>
  );
}

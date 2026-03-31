import { useAuthStore } from '@/store/authStore';
import { Menu, Bot, LayoutDashboard, FileText, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/bot', label: 'Bot', icon: Bot },
  { to: '/cupons', label: 'Cupons', icon: FileText },
];

export function AppHeader() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path: string) =>
    cn(
      'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 relative',
      location.pathname === path
        ? 'text-primary-foreground bg-primary/10 text-primary'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    );

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-sidebar border-r border-sidebar-border">
              <div className="flex flex-col h-full">
                <SheetHeader className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border text-left">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <SheetTitle className="text-foreground font-semibold text-lg tracking-tight">Bot Notas</SheetTitle>
                </SheetHeader>
                
                <nav className="flex-1 px-3 py-6 space-y-1">
                  {navItems.map((item) => (
                    <NavLink key={item.to} to={item.to} className={linkClass(item.to)}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="p-4 border-t border-sidebar-border">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {typeof user?.group === 'object' ? (user.group as any)?.name : user?.group}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Desktop Title (Visible only when sidebar is hidden, or just hidden universally here to avoid double title) */}
        <div className="lg:hidden flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <span className="font-semibold tracking-tight">Bot Notas</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:block">
          Olá, <span className="text-foreground font-medium">{user?.name}</span>
        </span>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold sm:hidden">
            {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

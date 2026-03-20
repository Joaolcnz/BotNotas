import { useAuthStore } from '@/store/authStore';

export function AppHeader() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-30">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Olá, <span className="text-foreground font-medium">{user?.name}</span>
        </span>
      </div>
    </header>
  );
}

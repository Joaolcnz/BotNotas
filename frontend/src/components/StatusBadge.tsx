import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Pendente',
    className: 'bg-warning/15 text-warning border-warning/20',
  },
  ATTACHED: {
    label: 'Anexado',
    className: 'bg-success/15 text-success border-success/20',
  },
  ERROR: {
    label: 'Erro',
    className: 'bg-destructive/15 text-destructive border-destructive/20',
  },
  ACTIVE: {
    label: 'Ativo',
    className: 'bg-success/15 text-success border-success/20',
  },
  DISABLED: {
    label: 'Desativado',
    className: 'bg-muted-foreground/15 text-muted-foreground border-muted-foreground/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, RefreshCw } from 'lucide-react';
import { getCoupons } from '@/api/coupons';
import { StatusBadge } from '@/components/StatusBadge';

interface Coupon {
  id: string;
  code: string;
  status: string;
  createdAt?: string;
}

export default function LogsPage() {
  const { data: coupons = [], isLoading, refetch, isFetching } = useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: getCoupons,
    refetchInterval: 5000,
  });

  const sorted = [...coupons].sort((a, b) => {
    if (a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">Histórico de processamento de notas fiscais</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="h-9 px-4 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <FileText className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Nenhum log encontrado</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">ID</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Code</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Data</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Hora</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((coupon, i) => (
                <motion.tr
                  key={coupon.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors"
                >
                  <td className="px-6 py-3 text-sm text-muted-foreground font-mono">{coupon.id}</td>
                  <td className="px-6 py-3 text-sm text-foreground">{coupon.code}</td>
                  <td className="px-6 py-3"><StatusBadge status={coupon.status} /></td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{formatDate(coupon.createdAt)}</td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{formatTime(coupon.createdAt)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

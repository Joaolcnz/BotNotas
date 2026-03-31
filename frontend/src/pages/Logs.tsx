import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCoupons, type Coupon, type SpringPage } from '@/api/coupons';
import { StatusBadge } from '@/components/StatusBadge';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function LogsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const {
    data,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<SpringPage<Coupon>>({
    queryKey: ['coupons', page, size],
    queryFn: () => getCoupons(page, size, 'uploadedAt,desc'),
    refetchInterval: 5000,
    placeholderData: (prev) => prev,
  });

  const coupons = data?.content ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalElements = data?.totalElements ?? 0;

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Histórico de processamento de cupons
            {totalElements > 0 && (
              <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                {totalElements} {totalElements === 1 ? 'registro' : 'registros'}
              </span>
            )}
          </p>
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

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <FileText className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Nenhum log encontrado</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Código</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Enviado em</th>
                    <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Processado em</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon, i) => (
                    <motion.tr
                      key={coupon.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-foreground font-medium text-center">{coupon.code}</td>
                      <td className="px-6 py-3 text-center"><StatusBadge status={coupon.status} /></td>
                      <td className="px-6 py-3 text-sm text-muted-foreground whitespace-nowrap text-center">{formatDateTime(coupon.uploadedAt)}</td>
                      <td className="px-6 py-3 text-sm text-muted-foreground whitespace-nowrap text-center">{formatDateTime(coupon.processedAt)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Linhas por página:</span>
                <select
                  value={size}
                  onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
                  className="bg-background border border-border rounded-md px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>
                  Página <span className="text-foreground font-medium">{page + 1}</span> de{' '}
                  <span className="text-foreground font-medium">{totalPages}</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={data?.first ?? true}
                    className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={data?.last ?? true}
                    className="p-1.5 rounded-md hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Próxima página"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

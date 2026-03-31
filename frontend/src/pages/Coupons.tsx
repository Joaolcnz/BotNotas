import { getCoupons, type Coupon, type CouponFilterDTO, type SpringPage } from '@/api/coupons';
import { CouponFiltersPanel } from '@/components/CouponFiltersPanel';
import { StatusBadge } from '@/components/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText, Filter, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function CouponsPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CouponFilterDTO>({});
  const [draftFilters, setDraftFilters] = useState<CouponFilterDTO>({});

  const {
    data,
    isLoading,
    refetch,
    isFetching,
  } = useQuery<SpringPage<Coupon>>({
    queryKey: ['coupons', page, size, filters],
    queryFn: () => getCoupons(page, size, 'uploadedAt,desc', filters),
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

  const applyFilters = () => {
    setFilters(draftFilters);
    setPage(0);
  };

  const clearFilters = () => {
    setDraftFilters({});
    setFilters({});
    setPage(0);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cupons</h1>
          <p className="text-[15px] text-muted-foreground">
            Acompanhe o histórico de processamento.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 px-4 rounded-md border text-sm font-medium transition-colors flex items-center gap-2 ${showFilters || Object.keys(filters).length > 0
              ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
              : 'bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm'
              }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 bg-background/20 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 px-4 rounded-md bg-card border border-border text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <CouponFiltersPanel
        showFilters={showFilters}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-border bg-card/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Linhas por página:</span>
                <Select
                  value={size.toString()}
                  onValueChange={(v) => { setSize(Number(v)); setPage(0); }}
                >
                  <SelectTrigger className="h-8 w-[70px] bg-background">
                    <SelectValue placeholder={size.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s.toString()}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

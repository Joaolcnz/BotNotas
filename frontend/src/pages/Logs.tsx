import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, RefreshCw, ChevronLeft, ChevronRight, Filter, FilterX } from 'lucide-react';
import { getCoupons, type Coupon, type SpringPage, type CouponFilterDTO } from '@/api/coupons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/StatusBadge';
import { DateTimeRangePicker } from '@/components/ui/date-time-range-picker';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function LogsPage() {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-9 px-4 rounded-lg border text-sm transition-colors flex items-center gap-2 ${
              showFilters || Object.keys(filters).length > 0
                ? 'bg-primary border-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-card border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {Object.keys(filters).length > 0 && (
              <span className="ml-1 bg-background/20 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-4 rounded-lg bg-card border border-border text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-xl p-5 mb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Código</label>
                  <input
                    type="text"
                    className="w-full h-9 bg-background border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
                    value={draftFilters.code || ''}
                    onChange={(e) => setDraftFilters({ ...draftFilters, code: e.target.value })}
                    placeholder="Filtrar por código"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Status</label>
                  <Select
                    value={draftFilters.status || 'ALL'}
                    onValueChange={(value) => setDraftFilters({ ...draftFilters, status: value === 'ALL' ? '' : value })}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Todos</SelectItem>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="ATTACHED">Anexado</SelectItem>
                      <SelectItem value="ERROR">Erro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Enviado em</label>
                  <DateTimeRangePicker
                    from={draftFilters.uploadedAtStart}
                    to={draftFilters.uploadedAtEnd}
                    onChange={({ from, to }) =>
                      setDraftFilters({ ...draftFilters, uploadedAtStart: from, uploadedAtEnd: to })
                    }
                    placeholder="Filtrar envio"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Processado em</label>
                  <DateTimeRangePicker
                    from={draftFilters.processedAtStart}
                    to={draftFilters.processedAtEnd}
                    onChange={({ from, to }) =>
                      setDraftFilters({ ...draftFilters, processedAtStart: from, processedAtEnd: to })
                    }
                    placeholder="Filtrar processamento"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border">
                <button
                  onClick={clearFilters}
                  className="h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <FilterX className="w-4 h-4" />
                  Limpar
                </button>
                <button
                  onClick={applyFilters}
                  className="h-9 px-6 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

import { motion, AnimatePresence } from 'framer-motion';
import { FilterX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateTimeRangePicker } from '@/components/ui/date-time-range-picker';
import { type CouponFilterDTO } from '@/api/coupons';

interface CouponFiltersPanelProps {
  showFilters: boolean;
  draftFilters: CouponFilterDTO;
  setDraftFilters: React.Dispatch<React.SetStateAction<CouponFilterDTO>>;
  applyFilters: () => void;
  clearFilters: () => void;
}

export function CouponFiltersPanel({
  showFilters,
  draftFilters,
  setDraftFilters,
  applyFilters,
  clearFilters,
}: CouponFiltersPanelProps) {
  return (
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
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="Filtrar por código"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Status</label>
                <Select
                  value={draftFilters.status || 'ALL'}
                  onValueChange={(value) =>
                    setDraftFilters((prev) => ({ ...prev, status: value === 'ALL' ? '' : value }))
                  }
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
                    setDraftFilters((prev) => ({ ...prev, uploadedAtStart: from, uploadedAtEnd: to }))
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
                    setDraftFilters((prev) => ({ ...prev, processedAtStart: from, processedAtEnd: to }))
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
  );
}

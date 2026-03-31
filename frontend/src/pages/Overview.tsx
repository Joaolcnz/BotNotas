import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RefreshCw, Filter, PieChart as PieChartIcon, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { getCoupons, type Coupon, type SpringPage, type CouponFilterDTO } from '@/api/coupons';
import { CouponFiltersPanel } from '@/components/CouponFiltersPanel';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function OverviewPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CouponFilterDTO>({});
  const [draftFilters, setDraftFilters] = useState<CouponFilterDTO>({});

  // Limitando a um tamanho grande para coletar dados para o dashboard localmente (solução paliativa ao invés de um /api/stats)
  const { data, isLoading, refetch, isFetching } = useQuery<SpringPage<Coupon>>({
    queryKey: ['coupons-overview', filters],
    queryFn: () => getCoupons(0, 5000, 'uploadedAt,desc', filters),
    placeholderData: (prev) => prev,
  });

  const coupons = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;

  const applyFilters = () => {
    setFilters(draftFilters);
  };

  const clearFilters = () => {
    setDraftFilters({});
    setFilters({});
  };

  // KPI Data
  const attachedCount = coupons.filter(c => c.status === 'ATTACHED').length;
  const errorCount = coupons.filter(c => c.status === 'ERROR').length;
  const pendingCount = coupons.filter(c => c.status === 'PENDING').length;

  const statusData = useMemo(() => {
    return [
      { name: 'Pendente', value: pendingCount, color: '#f59e0b' },
      { name: 'Anexado', value: attachedCount, color: '#10b981' },
      { name: 'Erro', value: errorCount, color: '#ef4444' }
    ].filter(i => i.value > 0);
  }, [pendingCount, attachedCount, errorCount]);

  const volumeData = useMemo(() => {
    if (!coupons.length) return [];

    // Agrupa por dia (ignorando a hora)
    const grouped = coupons.reduce((acc, curr) => {
      if (!curr.uploadedAt) return acc;
      const day = curr.uploadedAt.split('T')[0];
      if (!acc[day]) acc[day] = { date: day, Total: 0, Anexados: 0, Erros: 0 };

      acc[day].Total++;
      if (curr.status === 'ATTACHED') acc[day].Anexados++;
      if (curr.status === 'ERROR') acc[day].Erros++;

      return acc;
    }, {} as Record<string, { date: string, Total: number, Anexados: number, Erros: number }>);

    return Object.values(grouped)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({
        ...item,
        label: format(parseISO(item.date), 'dd MMM', { locale: ptBR })
      }));
  }, [coupons]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-[15px] text-muted-foreground">
            Métricas e insights de processamento de notas.
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-card rounded-xl border border-border">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border text-muted-foreground">
          <PieChartIcon className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm">Nenhum cupom encontrado para os filtros ativos</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <p className="text-sm font-medium text-muted-foreground">Total de Cupons</p>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{totalElements}</div>
              <p className="text-xs text-muted-foreground mt-1">no período filtrado</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <p className="text-sm font-medium text-muted-foreground">Sucesso (Anexados)</p>
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="text-2xl font-bold text-success">{attachedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalElements ? Math.round((attachedCount / totalElements) * 100) : 0}% do total
              </p>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <p className="text-sm font-medium text-muted-foreground">Em Processamento</p>
                <RefreshCw className="w-4 h-4 text-warning" />
              </div>
              <div className="text-2xl font-bold text-warning">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">aguardando o bot</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
              <div className="flex flex-row items-center justify-between pb-2">
                <p className="text-sm font-medium text-muted-foreground">Erros</p>
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
              <div className="text-2xl font-bold text-destructive">{errorCount}</div>
              <p className="text-xs text-muted-foreground mt-1">requerem atenção</p>
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            {/* Pie Chart */}
            <div className="bg-card border border-border p-5 rounded-xl shadow-sm col-span-1 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Distribuição de Status</h3>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} cupons`, 'Quantidade']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-card border border-border p-5 rounded-xl shadow-sm lg:col-span-2 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">Volume por Dia de Envio</h3>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#fff', fontSize: 13 }}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fill: '#fff', fontSize: 13 }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ fill: 'var(--accent)', opacity: 0.2 }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Total" fill="#64748b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Anexados" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Erros" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Layers, X, Loader2, Pencil, Trash2 } from 'lucide-react';
import { getGroups, createGroup, activateGroup, disableGroup, updateGroup, deleteGroup } from '@/api/groups';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';

interface GroupData {
  id: string;
  name: string;
  locality: string;
  status: string;
}

export default function GroupsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', locality: '', frotaflexUser: '', frotaflexPassword: '' });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: groups = [], isLoading } = useQuery<GroupData[]>({ queryKey: ['groups'], queryFn: getGroups });

  const createMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setModalOpen(false);
      resetForm();
      toast({ title: 'Grupo criado com sucesso' });
    },
    onError: () => toast({ title: 'Erro ao criar grupo', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof form> }) => updateGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setModalOpen(false);
      setEditingGroup(null);
      resetForm();
      toast({ title: 'Grupo atualizado com sucesso' });
    },
    onError: () => toast({ title: 'Erro ao atualizar grupo', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      setDeleteConfirm(null);
      toast({ title: 'Grupo excluído' });
    },
    onError: () => toast({ title: 'Erro ao excluir grupo', variant: 'destructive' }),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? disableGroup(id) : activateGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast({ title: 'Status atualizado' });
    },
  });

  const resetForm = () => setForm({ name: '', locality: '', frotaflexUser: '', frotaflexPassword: '' });

  const openCreate = () => {
    resetForm();
    setEditingGroup(null);
    setModalOpen(true);
  };

  const openEdit = (group: any) => {
    setEditingGroup(group);
    setForm({
      name: group.name,
      locality: group.locality,
      frotaflexUser: group.frotaflexUser || '',
      frotaflexPassword: '',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Grupos</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os grupos do sistema</p>
        </div>
        <button
          onClick={openCreate}
          className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Grupo
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Layers className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Nenhum grupo encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['ID', 'Name', 'Locality', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-3 text-sm text-muted-foreground font-mono">{group.id}</td>
                  <td className="px-6 py-3 text-sm text-foreground font-medium">{group.name}</td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{group.locality}</td>
                  <td className="px-6 py-3"><StatusBadge status={group.status} /></td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(group)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {deleteConfirm === group.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteMutation.mutate(group.id)}
                            disabled={deleteMutation.isPending}
                            className="px-2 py-1 rounded text-xs bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-50"
                          >
                            {deleteMutation.isPending ? 'Excluindo...' : 'Confirmar'}
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded text-xs text-muted-foreground hover:text-foreground"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(group.id)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleMutation.mutate({ id: group.id, active: group.status === 'ACTIVE' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ml-2 ${
                          group.status === 'ACTIVE'
                            ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                            : 'bg-success/10 text-success hover:bg-success/20'
                        }`}
                      >
                        {group.status === 'ACTIVE' ? 'Desativar' : 'Ativar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border border-border rounded-2xl p-6 md:p-8 shadow-2xl mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {editingGroup ? 'Editar Grupo' : 'Novo Grupo'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Name', key: 'name', type: 'text' },
                  { label: 'Locality', key: 'locality', type: 'text' },
                  { label: 'FrotaFlex User', key: 'frotaflexUser', type: 'text' },
                  { label: 'FrotaFlex Password', key: 'frotaflexPassword', type: 'password' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">{label}</label>
                    <input
                      type={type}
                      value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      required
                      className="w-full h-10 px-3 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ))}
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingGroup ? 'Salvar' : 'Criar'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

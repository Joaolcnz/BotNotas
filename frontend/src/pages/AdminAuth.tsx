import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/api/apiClient';

export default function AdminAuth() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/users';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    try {
      // Validate token with backend
      await apiClient.post('/admin/validate-token', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Store token if validation successful
      sessionStorage.setItem('admin_token', token);
      
      toast({ title: 'Acesso concedido', description: 'Token validado com sucesso.' });
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({ 
        title: 'Acesso negado', 
        description: error.response?.data?.message || 'Token inválido', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground text-center">
            Esta área exige um token de acesso administrativo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Token de Admin</label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              placeholder="Insira o seu token..."
              className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Validando...' : 'Acessar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

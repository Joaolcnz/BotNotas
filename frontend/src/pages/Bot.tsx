import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, FolderOpen, Play, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { uploadCoupons } from '@/api/coupons';
import { useToast } from '@/hooks/use-toast';

export default function BotPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dirSelected, setDirSelected] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSelectDir = () => {
    fileInputRef.current?.click();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setDirSelected(true);
    }
  };

  const handleStart = async () => {
    if (files.length === 0) {
      toast({ title: 'Erro', description: 'Selecione as notas primeiro.', variant: 'destructive' });
      return;
    }

    setRunning(true);
    setProgress({ current: 0, total: files.length });

    try {
      const batchSize = 10;
      let processed = 0;
      
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        await uploadCoupons(batch);
        processed += batch.length;
        setProgress({ current: processed, total: files.length });
      }
      
      toast({ title: 'Concluído', description: `${files.length} notas processadas com sucesso.` });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao processar as notas.', variant: 'destructive' });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Bot Notas</h2>
            <p className="text-sm text-muted-foreground mt-1">Anexe Notas a Prazo automaticamente</p>
          </div>

          {/* Directory Selection */}
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFilesChange}
            />
            <button
              onClick={handleSelectDir}
              disabled={running}
              className="w-full h-12 rounded-xl bg-accent border border-border text-foreground font-medium text-sm hover:bg-accent/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FolderOpen className="w-4 h-4" />
              {dirSelected ? 'Notas selecionadas' : 'Selecionar notas'}
            </button>

            {dirSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-sm text-success"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{files.length} arquivo(s) selecionado(s)</span>
              </motion.div>
            )}


            {/* Start Button */}
            <button
              onClick={handleStart}
              disabled={running || !dirSelected}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Iniciar
                </>
              )}
            </button>

            {/* Progress */}
            <AnimatePresence>
              {running && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Anexando Notas</span>
                    <span className="text-foreground font-medium">
                      {progress.current}/{progress.total}
                    </span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FrotaFlex Button */}
            <a
              href="https://zmaisz.frotaflex.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:text-foreground hover:border-foreground/20 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir FrotaFlex
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

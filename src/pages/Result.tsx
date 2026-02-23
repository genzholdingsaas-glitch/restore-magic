import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestoreFlow } from '@/context/RestoreFlowContext';
import { motion } from 'framer-motion';
import { Download, Share2, ArrowLeftRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Result = () => {
  const navigate = useNavigate();
  const { flow, resetFlow } = useRestoreFlow();
  const [showBefore, setShowBefore] = useState(false);

  const handleSave = () => {
    if (!flow.outputImageUrl) return;
    const link = document.createElement('a');
    link.href = flow.outputImageUrl;
    link.download = 'foto-restaurada.jpg';
    link.click();
    toast.success('Foto salva!');
  };

  const handleShare = async () => {
    if (navigator.share && flow.outputImageUrl) {
      try {
        await navigator.share({ title: 'Minha foto restaurada', url: flow.outputImageUrl });
      } catch { /* user cancelled */ }
    } else {
      toast.info('Compartilhamento não disponível neste navegador');
    }
  };

  const handleGoHome = () => {
    resetFlow();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="px-5 pt-14 pb-4">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-foreground text-center"
        >
          Sua foto restaurada! ✨
        </motion.h1>
      </div>

      <div className="px-5">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-2xl bg-card shadow-card"
        >
          <img
            src={showBefore ? (flow.imageUri ?? '') : (flow.outputImageUrl ?? '')}
            alt={showBefore ? 'Foto original' : 'Foto restaurada'}
            className="mx-auto max-h-[55vh] w-full object-contain"
          />
          <div className="absolute top-3 left-3 rounded-full bg-card/80 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
            {showBefore ? 'Antes' : 'Depois'}
          </div>
        </motion.div>

        {/* Compare toggle */}
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBefore(!showBefore)}
            className="rounded-full"
          >
            <ArrowLeftRight className="mr-1.5 h-4 w-4" />
            {showBefore ? 'Ver restaurada' : 'Comparar antes/depois'}
          </Button>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            onClick={handleSave}
            className="rounded-xl py-5 gradient-accent text-accent-foreground font-bold"
          >
            <Download className="mr-2 h-4 w-4" /> Salvar
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="rounded-xl py-5 font-bold"
          >
            <Share2 className="mr-2 h-4 w-4" /> Compartilhar
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={handleGoHome}
          className="mt-4 w-full"
        >
          <Home className="mr-2 h-4 w-4" /> Voltar para o início
        </Button>
      </div>
    </div>
  );
};

export default Result;

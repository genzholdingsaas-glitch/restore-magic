import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestoreFlow } from '@/context/RestoreFlowContext';
import { motion } from 'framer-motion';
import { Loader2, Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stages = [
  { status: 'QUEUED', label: 'Na fila…', progress: 20 },
  { status: 'RUNNING', label: 'Restaurando sua foto…', progress: 60 },
  { status: 'FINISHING', label: 'Finalizando…', progress: 90 },
];

const Processing = () => {
  const navigate = useNavigate();
  const { flow, setStatus, setOutputImageUrl } = useRestoreFlow();
  const [stageIdx, setStageIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  // Simulate processing
  useEffect(() => {
    setStatus('PROCESSING');
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setStageIdx(1), 2000));
    timers.push(setTimeout(() => setStageIdx(2), 5000));
    timers.push(
      setTimeout(() => {
        // Simulate success — use original image as "restored" for demo
        setOutputImageUrl(flow.imageUri ?? '');
        navigate('/restore/result');
      }, 7000)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const stage = stages[stageIdx];

  if (failed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5 bg-background">
        <p className="text-lg font-bold text-destructive">Ops, algo deu errado</p>
        <p className="mt-2 text-sm text-muted-foreground text-center">
          Houve um problema ao processar sua foto. Não se preocupe, você não será cobrado novamente.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" /> Início
          </Button>
          <Button
            className="gradient-accent text-accent-foreground"
            onClick={() => {
              setFailed(false);
              setStageIdx(0);
            }}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center"
      >
        <Loader2 className="h-12 w-12 text-accent animate-spin" />
        <h2 className="mt-6 text-xl font-bold text-foreground">{stage.label}</h2>

        {/* Progress bar */}
        <div className="mt-6 w-64 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full gradient-accent rounded-full"
            initial={{ width: '10%' }}
            animate={{ width: `${stage.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Isso pode levar alguns instantes…
        </p>

        <div className="mt-10 flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <Home className="mr-1.5 h-4 w-4" /> Início
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
            <Clock className="mr-1.5 h-4 w-4" /> Histórico
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Processing;

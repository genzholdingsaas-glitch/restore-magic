import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestoreFlow } from '@/context/RestoreFlowContext';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Loader2, Home, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Processing = () => {
  const navigate = useNavigate();
  const { flow, setStatus, setOutputImageUrl } = useRestoreFlow();
  const [label, setLabel] = useState('Enviando para restauração…');
  const [progress, setProgress] = useState(15);
  const [failed, setFailed] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const run = async () => {
      try {
        setStatus('PROCESSING');

        // Create the order in the database
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            status: 'PROCESSING',
            input_image_url: flow.imageUri,
            customer_name: flow.customer?.fullName,
            customer_email: flow.customer?.email,
            customer_phone: flow.customer?.phone,
            original_price_cents: Math.round(flow.pricing.originalPrice * 100),
            discount_price_cents: Math.round(flow.pricing.discountPrice * 100),
          })
          .select('id')
          .single();

        if (orderError || !order) throw new Error(orderError?.message || 'Failed to create order');

        setLabel('Restaurando sua foto com IA…');
        setProgress(40);

        // Call edge function
        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/restore-image`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              orderId: order.id,
              imageUrl: flow.imageUri,
            }),
          }
        );

        setProgress(80);
        setLabel('Finalizando…');

        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          if (resp.status === 429) {
            toast.error('Limite de requisições excedido. Tente novamente em alguns minutos.');
          } else if (resp.status === 402) {
            toast.error('Créditos de IA esgotados.');
          } else {
            toast.error(errData.error || 'Erro ao processar imagem.');
          }
          setFailed(true);
          return;
        }

        const result = await resp.json();
        setProgress(100);
        setOutputImageUrl(result.outputImageUrl);
        navigate('/restore/result');
      } catch (err) {
        console.error('Processing error:', err);
        toast.error('Erro ao processar sua foto.');
        setFailed(true);
      }
    };

    run();
  }, []);

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
              calledRef.current = false;
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
        <h2 className="mt-6 text-xl font-bold text-foreground">{label}</h2>

        <div className="mt-6 w-64 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full gradient-accent rounded-full"
            initial={{ width: '10%' }}
            animate={{ width: `${progress}%` }}
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

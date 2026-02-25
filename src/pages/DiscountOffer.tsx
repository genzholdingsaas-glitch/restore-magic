import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestoreFlow } from '@/context/RestoreFlowContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, PartyPopper, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DiscountOffer = () => {
  const navigate = useNavigate();
  const { flow, setStatus } = useRestoreFlow();
  const { user } = useAuth();
  const [revealed, setRevealed] = useState(false);
  const [paying, setPaying] = useState(false);
  const firstName = flow.customer?.fullName.split(' ')[0] ?? user?.user_metadata?.full_name?.split(' ')[0] ?? 'Amigo';

  const handleClaim = async () => {
    if (!user) {
      toast.error('Faça login para continuar');
      navigate('/auth');
      return;
    }

    setPaying(true);
    try {
      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          status: 'AWAITING_PAYMENT',
          input_image_url: flow.imageUri,
          customer_name: flow.customer?.fullName || user.user_metadata?.full_name,
          customer_email: flow.customer?.email || user.email,
          customer_phone: flow.customer?.phone,
          original_price_cents: Math.round(flow.pricing.originalPrice * 100),
          discount_price_cents: Math.round(flow.pricing.discountPrice * 100),
          user_id: user.id,
        })
        .select('id')
        .single();

      if (orderError || !order) throw new Error(orderError?.message || 'Erro ao criar pedido');

      setStatus('AWAITING_PAYMENT');

      // Create Stripe checkout
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { orderId: order.id },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de pagamento não retornada');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.message || 'Erro ao iniciar pagamento');
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="gift"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center text-center"
          >
            <motion.h2
              className="text-2xl font-bold text-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Quase lá! 🎉
            </motion.h2>
            <p className="mt-3 text-base text-muted-foreground max-w-xs">
              Ei, <span className="font-semibold text-foreground">{firstName}</span>! 🎁 Você ganhou um presente especial!
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Clique para abrir</p>

            <motion.button
              onClick={() => setRevealed(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="mt-8 flex h-40 w-40 items-center justify-center rounded-3xl gradient-gift shadow-lg"
            >
              <Gift className="h-20 w-20 text-accent-foreground drop-shadow-lg" />
            </motion.button>

            <p className="mt-4 text-xs text-muted-foreground animate-pulse">
              Toque no presente para abrir
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="discount"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', bounce: 0.4 }}
            className="flex flex-col items-center text-center w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
            >
              <PartyPopper className="h-12 w-12 text-gold mx-auto" />
            </motion.div>

            <h2 className="mt-3 text-3xl font-extrabold text-gradient-gift">
              PARABÉNS! 🎊
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              Você ganhou um super desconto!
            </p>

            {/* Price card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 w-full rounded-2xl bg-card p-6 shadow-card border border-border"
            >
              <p className="text-sm text-muted-foreground line-through">
                De R$ {flow.pricing.originalPrice.toFixed(2).replace('.', ',')}
              </p>
              <p className="mt-1 text-4xl font-extrabold text-accent">
                R$ {flow.pricing.discountPrice.toFixed(2).replace('.', ',')}
              </p>
              <div className="mt-2 inline-block rounded-full gradient-gold px-3 py-1">
                <span className="text-xs font-bold text-gold-foreground">
                  ECONOMIA DE R$ {(flow.pricing.originalPrice - flow.pricing.discountPrice).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </motion.div>

            {/* Warning */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2.5"
            >
              <AlertTriangle className="h-4 w-4 text-gold shrink-0" />
              <p className="text-xs font-medium text-gold-foreground">
                Desconto válido apenas para compra agora!
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 w-full"
            >
              <Button
                onClick={handleClaim}
                disabled={paying}
                className="w-full rounded-xl py-6 text-base font-bold gradient-accent text-accent-foreground shadow-accent animate-pulse-glow"
              >
                {paying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecionando…
                  </>
                ) : (
                  'QUERO MEU DESCONTO →'
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscountOffer;

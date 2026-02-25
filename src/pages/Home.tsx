import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Users, Palette, Sparkles, ChevronRight, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const comingSoon = [
    { icon: Users, label: 'Juntar duas pessoas', desc: 'Combine rostos em uma foto' },
    { icon: Palette, label: 'Colorizar foto', desc: 'Dê vida a fotos P&B' },
    { icon: Sparkles, label: 'Melhorar qualidade', desc: 'Aumente a resolução' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            FotoRestaurar
          </motion.h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Dê nova vida às suas fotos antigas ✨
          </p>
        </div>
        {!user && (
          <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="rounded-full">
            <LogIn className="mr-1.5 h-4 w-4" /> Entrar
          </Button>
        )}
      </div>

      {/* Main CTA Card */}
      <div className="px-5">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/restore')}
          className="w-full rounded-2xl gradient-accent p-6 text-left shadow-accent"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-foreground/20">
              <Camera className="h-7 w-7 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-accent-foreground">Restaurar fotos antigas</h2>
              <p className="mt-0.5 text-sm text-accent-foreground/80">
                Recupere detalhes e nitidez com IA
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-accent-foreground/60" />
          </div>
        </motion.button>
      </div>

      {/* Coming Soon */}
      <div className="mt-10 px-5">
        <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Em breve
        </h3>
        <div className="space-y-3">
          {comingSoon.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card opacity-60"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

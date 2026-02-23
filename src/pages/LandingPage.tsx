import { useNavigate } from 'react-router-dom';
import { Camera, Sparkles, Shield, Zap, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import exampleRestore from '@/assets/example-restore.png';

const features = [
  {
    icon: Sparkles,
    title: 'IA de última geração',
    desc: 'Nossa inteligência artificial restaura detalhes perdidos, corrige danos e melhora a nitidez automaticamente.',
  },
  {
    icon: Zap,
    title: 'Rápido e fácil',
    desc: 'Envie sua foto e receba o resultado restaurado em poucos minutos. Sem complicação.',
  },
  {
    icon: Shield,
    title: 'Seguro e privado',
    desc: 'Suas fotos são processadas com segurança e nunca compartilhadas com terceiros.',
  },
];

const steps = [
  { num: '1', title: 'Envie sua foto', desc: 'Escolha a foto antiga que deseja restaurar' },
  { num: '2', title: 'Preencha seus dados', desc: 'Informe nome, email e celular' },
  { num: '3', title: 'Receba o resultado', desc: 'Nossa IA restaura a imagem em minutos' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            <Camera className="h-4 w-4" />
            FotoRestaurar
          </div>
          <h1 className="text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            Dê nova vida às suas
            <span className="block text-accent"> fotos antigas</span>
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-base text-muted-foreground">
            Restaure fotos danificadas, desbotadas ou rasgadas com inteligência artificial em poucos cliques.
          </p>
        </motion.div>

        {/* Example image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-8 max-w-sm overflow-hidden rounded-2xl shadow-accent"
        >
          <img
            src={exampleRestore}
            alt="Exemplo de foto restaurada: antes e depois"
            className="w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={() => navigate('/restore')}
            className="rounded-xl px-8 py-6 text-base font-bold gradient-accent text-accent-foreground shadow-accent"
          >
            Restaurar minha foto
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-5 py-12">
        <h2 className="mb-8 text-center text-xl font-bold text-foreground">Como funciona</h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-start gap-4 rounded-xl bg-card p-4 shadow-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-accent text-sm font-bold text-accent-foreground">
                {step.num}
              </div>
              <div>
                <p className="font-semibold text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-card px-5 py-12">
        <h2 className="mb-8 text-center text-xl font-bold text-foreground">Por que usar o FotoRestaurar?</h2>
        <div className="space-y-5">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex items-start gap-4"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <feat.icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{feat.title}</p>
                <p className="text-sm text-muted-foreground">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-5 py-12">
        <div className="rounded-2xl bg-muted p-6 text-center">
          <div className="mb-2 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold text-gold" />
            ))}
          </div>
          <p className="text-sm italic text-foreground">
            "Consegui restaurar uma foto do meu avô que estava completamente danificada. O resultado ficou incrível!"
          </p>
          <p className="mt-3 text-xs font-semibold text-muted-foreground">— Maria S., São Paulo</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-24 pt-4 text-center">
        <h2 className="text-xl font-bold text-foreground">Pronto para restaurar?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Comece agora e veja a mágica acontecer ✨
        </p>
        <Button
          onClick={() => navigate('/restore')}
          className="mt-6 w-full rounded-xl py-6 text-base font-bold gradient-accent text-accent-foreground shadow-accent"
        >
          Começar agora
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;

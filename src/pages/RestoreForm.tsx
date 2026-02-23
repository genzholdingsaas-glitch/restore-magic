import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestoreFlow } from '@/context/RestoreFlowContext';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const RestoreForm = () => {
  const navigate = useNavigate();
  const { setCustomer } = useRestoreFlow();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Obrigatório';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = 'Celular inválido';
    if (!accepted) e.terms = 'Aceite os termos';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setCustomer({ fullName: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim() });
    navigate('/restore/offer');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate('/restore')} className="rounded-full p-1 hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Seus dados</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 space-y-5"
      >
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input
            id="fullName"
            placeholder="Maria da Silva"
            value={form.fullName}
            onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
          />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="maria@email.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Celular</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: formatPhone(e.target.value) }))}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={accepted}
            onCheckedChange={v => setAccepted(!!v)}
          />
          <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
            Li e aceito os <span className="text-accent font-medium">Termos de Uso</span> e{' '}
            <span className="text-accent font-medium">Política de Privacidade</span>
          </label>
        </div>
        {errors.terms && <p className="text-xs text-destructive -mt-2">{errors.terms}</p>}

        <Button
          onClick={handleSubmit}
          className="w-full rounded-xl py-6 text-base font-bold gradient-accent text-accent-foreground shadow-accent"
        >
          Continuar
        </Button>
      </motion.div>
    </div>
  );
};

export default RestoreForm;

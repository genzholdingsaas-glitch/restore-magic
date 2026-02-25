import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, HelpCircle, FileText, LogOut, LogIn, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Você saiu da conta');
    navigate('/');
  };

  const menuItems = [
    { icon: HelpCircle, label: 'Suporte', action: () => {} },
    { icon: FileText, label: 'Termos de Uso', action: () => {} },
    { icon: FileText, label: 'Política de Privacidade', action: () => {} },
    ...(user
      ? [{ icon: LogOut, label: 'Sair', action: handleSignOut, destructive: true }]
      : [{ icon: LogIn, label: 'Entrar', action: () => navigate('/auth') }]),
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
      </div>

      {/* Avatar card */}
      <div className="px-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-card"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <User className="h-7 w-7 text-accent" />
          </div>
          <div>
            <p className="font-bold text-foreground">
              {user?.user_metadata?.full_name || user?.email || 'Visitante'}
            </p>
            <p className="text-sm text-muted-foreground">
              {user ? user.email : 'Faça login para ver seus dados'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="mt-6 px-5 space-y-1">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={item.action}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 transition-colors hover:bg-muted ${
              (item as any).destructive ? 'text-destructive' : 'text-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-muted-foreground">FotoRestaurar v1.0</p>
      </div>
    </div>
  );
};

export default Profile;

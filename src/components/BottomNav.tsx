import { NavLink, useLocation } from 'react-router-dom';
import { Home, Clock, User } from 'lucide-react';

const tabs = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/history', icon: Clock, label: 'Histórico' },
  { to: '/profile', icon: User, label: 'Perfil' },
];

const BottomNav = () => {
  const location = useLocation();
  // Hide nav during restore flow
  const hideOn = ['/restore', '/restore/form', '/restore/offer', '/restore/processing', '/restore/result'];
  if (hideOn.some(p => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1 text-xs font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-muted-foreground'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;

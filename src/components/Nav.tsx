import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const links = [
  { to: '/', label: 'Главная' },
  { to: '/gallery', label: 'Галерея' },
  { to: '/admin', label: 'Админ' },
];

const Nav = () => {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <Icon name="Aperture" size={22} className="text-accent transition-transform group-hover:rotate-90 duration-500" />
          <span className="font-display text-2xl font-semibold tracking-tight">Tihaya</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                pathname === l.to
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Nav;

import { Link, useLocation } from 'react-router-dom';

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
          <span className="font-display text-2xl font-semibold tracking-tight">Studio.m</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 text-sm rounded-full transition-all ${
                pathname === l.to
                  ? 'text-foreground font-semibold'
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
import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import Icon from '@/components/ui/icon';
import { useStore } from '@/lib/store';

const Index = () => {
  const { media, loading } = useStore();

  return (
    <div className="min-h-screen grain">
      <Nav />

      <section className="container pt-24 pb-32 md:pt-36 md:pb-40">
        <div className="flex items-center gap-4 animate-fade-up">
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:gap-3 transition-all"
          >
            <Icon name="ArrowLeft" size={16} className="transition-transform group-hover:-translate-x-1" />
            Галерея
          </Link>
        </div>
        <p className="mt-8 text-lg text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: '80ms' }}>
          Фотографии, видео и гифки — собранные с любовью к деталям. Лайкайте,
          комментируйте, находите своё.
        </p>
      </section>

      <section className="container pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-secondary animate-pulse" />
              ))
            : media.slice(0, 3).map((m, i) => (
                <Link
                  key={m.id}
                  to="/gallery"
                  className="group relative aspect-[3/4] rounded-2xl overflow-hidden hover-lift animate-scale-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <img
                    src={m.url}
                    alt={m.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-5 left-5 text-white">
                    <h3 className="font-display text-3xl">{m.title}</h3>
                    <p className="text-sm opacity-80">{m.category}</p>
                  </div>
                </Link>
              ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container py-10 flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-display text-xl text-foreground">Studio.m</span>
          <span>© 2026 — сделано с заботой</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
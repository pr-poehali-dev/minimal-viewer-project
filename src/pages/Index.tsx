import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import Icon from '@/components/ui/icon';
import { useStore } from '@/lib/store';

const Index = () => {
  const { media } = useStore();

  return (
    <div className="min-h-screen grain">
      <Nav />

      <section className="container pt-24 pb-32 md:pt-36 md:pb-40">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground animate-fade-up">
          Минималистичная галерея
        </p>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] mt-6 max-w-5xl animate-fade-up" style={{ animationDelay: '80ms' }}>
          Пространство,
          <br />
          где живёт <span className="italic text-accent">тишина</span>
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-xl animate-fade-up" style={{ animationDelay: '160ms' }}>
          Фотографии, видео и гифки — собранные с любовью к деталям. Лайкайте,
          комментируйте, находите своё.
        </p>
        <div className="mt-10 flex items-center gap-4 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <Link
            to="/gallery"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:gap-3 transition-all"
          >
            Смотреть галерею
            <Icon name="ArrowRight" size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
          >
            <Icon name="Upload" size={16} />
            Загрузить
          </Link>
        </div>
      </section>

      <section className="container pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {media.slice(0, 3).map((m, i) => (
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
          <span className="font-display text-xl text-foreground">Tihaya</span>
          <span>© 2026 — сделано с заботой</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;

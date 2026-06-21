import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Nav from '@/components/Nav';
import MediaCard from '@/components/MediaCard';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/gallery';

const Gallery = () => {
  const { media, loading } = useStore();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('Все');

  const filtered = useMemo(
    () =>
      media.filter((m) => {
        const byCat =
          cat === 'Все' ||
          m.category === cat ||
          (cat === 'Видео' && m.type === 'video');
        const byQuery =
          m.title.toLowerCase().includes(query.toLowerCase()) ||
          m.category.toLowerCase().includes(query.toLowerCase());
        return byCat && byQuery;
      }),
    [media, query, cat]
  );

  return (
    <div className="min-h-screen grain">
      <Nav />

      <div className="container pt-16 pb-10">
        <div className="flex items-center gap-4 mb-6 animate-fade-up">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:gap-3 transition-all"
          >
            <Icon name="ArrowLeft" size={16} className="transition-transform group-hover:-translate-x-1" />
            Главная
          </Link>
        </div>

        <h1 className="font-display text-5xl md:text-7xl animate-fade-up">Галерея</h1>

        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 animate-fade-up" style={{ animationDelay: '80ms' }}>
          <div className="relative flex-1 max-w-md">
            <Icon
              name="Search"
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию…"
              className="pl-11 h-12 rounded-full"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  cat === c
                    ? 'bg-foreground text-background'
                    : 'border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container pb-24">
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="break-inside-avoid mb-6 rounded-2xl bg-secondary animate-pulse"
                style={{ height: `${200 + (i % 3) * 80}px` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 text-muted-foreground animate-fade-up">
            <Icon name="ImageOff" size={40} className="mx-auto mb-4 opacity-50" />
            Ничего не найдено
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
            {filtered.map((m, i) => (
              <MediaCard key={m.id} item={m} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;

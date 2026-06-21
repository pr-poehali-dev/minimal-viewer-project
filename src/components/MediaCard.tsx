import { useState } from 'react';
import { MediaItem } from '@/lib/gallery';
import { useStore } from '@/lib/store';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

const typeBadge: Record<MediaItem['type'], string> = {
  photo: 'Фото',
  video: 'Видео',
  gif: 'GIF',
};

const MediaCard = ({ item, index }: { item: MediaItem; index: number }) => {
  const { toggleLike, addComment } = useStore();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    addComment(item.id, 'Гость', text.trim());
    setText('');
  };

  return (
    <article
      className="group break-inside-avoid mb-6 rounded-2xl overflow-hidden bg-card border border-border hover-lift animate-fade-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative overflow-hidden">
        {item.type === 'video' ? (
          <video
            src={item.url}
            muted={item.muted}
            loop
            autoPlay
            playsInline
            className="w-full object-cover"
          />
        ) : (
          <img
            src={item.url}
            alt={item.title}
            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <span className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm font-medium">
          {typeBadge[item.type]}
        </span>
        {item.type === 'video' && item.muted && (
          <span className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm">
            <Icon name="VolumeX" size={14} />
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-2xl leading-tight">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
          </div>
          <button
            onClick={() => toggleLike(item.id)}
            className="flex items-center gap-1.5 text-sm transition-transform active:scale-90"
          >
            <Icon
              name="Heart"
              size={20}
              className={item.liked ? 'text-accent fill-accent' : 'text-muted-foreground'}
            />
            <span className={item.liked ? 'text-accent' : 'text-muted-foreground'}>
              {item.likes}
            </span>
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon name="MessageCircle" size={14} />
          {item.comments.length} комментариев
        </button>

        {open && (
          <div className="mt-3 space-y-2 animate-fade-up">
            {item.comments.map((c) => (
              <div key={c.id} className="text-sm">
                <span className="font-medium">{c.author}</span>{' '}
                <span className="text-muted-foreground">{c.text}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Оставить комментарий…"
                className="h-9 rounded-full"
              />
              <button
                onClick={submit}
                className="shrink-0 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center active:scale-90 transition-transform"
              >
                <Icon name="ArrowUp" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default MediaCard;

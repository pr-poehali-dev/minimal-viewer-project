import { useEffect } from 'react';
import { MediaItem } from '@/lib/gallery';
import Icon from '@/components/ui/icon';

interface Props {
  item: MediaItem;
  onClose: () => void;
}

const Lightbox = ({ item, onClose }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-scale-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <Icon name="X" size={20} />
      </button>

      <div
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'video' ? (
          <video
            src={item.url}
            muted={item.muted}
            controls
            autoPlay
            loop
            playsInline
            className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain"
          />
        ) : (
          <img
            src={item.url}
            alt={item.title}
            className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain"
          />
        )}

        <div className="absolute bottom-0 inset-x-0 p-5 rounded-b-xl bg-gradient-to-t from-black/60 to-transparent text-white pointer-events-none">
          <p className="font-display text-2xl leading-tight">{item.title}</p>
          <p className="text-sm opacity-70">{item.category}</p>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;

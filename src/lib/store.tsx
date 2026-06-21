import { createContext, useContext, useState, ReactNode } from 'react';
import { MediaItem, initialMedia } from './gallery';

interface Store {
  media: MediaItem[];
  addMedia: (m: Omit<MediaItem, 'id' | 'likes' | 'comments' | 'liked'>) => void;
  toggleLike: (id: string) => void;
  addComment: (id: string, author: string, text: string) => void;
}

const Ctx = createContext<Store | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);

  const addMedia: Store['addMedia'] = (m) =>
    setMedia((prev) => [
      { ...m, id: Date.now().toString(), likes: 0, comments: [] },
      ...prev,
    ]);

  const toggleLike: Store['toggleLike'] = (id) =>
    setMedia((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) }
          : x
      )
    );

  const addComment: Store['addComment'] = (id, author, text) =>
    setMedia((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              comments: [
                ...x.comments,
                { id: Date.now().toString(), author, text },
              ],
            }
          : x
      )
    );

  return (
    <Ctx.Provider value={{ media, addMedia, toggleLike, addComment }}>
      {children}
    </Ctx.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};

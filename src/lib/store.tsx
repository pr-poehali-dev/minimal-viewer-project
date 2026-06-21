import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MediaItem } from './gallery';
import { api, getSessionId } from './api';

interface Store {
  media: MediaItem[];
  loading: boolean;
  addMedia: (m: Omit<MediaItem, 'id' | 'likes' | 'comments' | 'liked'>, file?: File) => Promise<void>;
  updateMedia: (id: string, patch: Partial<Pick<MediaItem, 'title' | 'category' | 'muted'>>) => Promise<void>;
  deleteMedia: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  addComment: (id: string, author: string, text: string) => Promise<void>;
}

const Ctx = createContext<Store | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMedia().then((data) => {
      setMedia(data);
      setLoading(false);
    });
  }, []);

  const addMedia: Store['addMedia'] = async (m, file) => {
    let url = m.url;
    if (file) {
      const res = await api.uploadFile(file);
      url = res.url;
    }
    const res = await api.createMedia({ ...m, url });
    const newItem: MediaItem = { ...m, url, id: res.id, likes: 0, comments: [] };
    setMedia((prev) => [newItem, ...prev]);
  };

  const updateMedia: Store['updateMedia'] = async (id, patch) => {
    const item = media.find((x) => x.id === id);
    if (!item) return;
    const updated = { ...item, ...patch };
    await api.updateMedia({ id, title: updated.title, category: updated.category, muted: updated.muted ?? true });
    setMedia((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const deleteMedia: Store['deleteMedia'] = async (id) => {
    await api.hideMedia(id);
    setMedia((prev) => prev.filter((x) => x.id !== id));
  };

  const toggleLike: Store['toggleLike'] = async (id) => {
    const sessionId = getSessionId();
    const res = await api.toggleLike(id, sessionId);
    setMedia((prev) =>
      prev.map((x) => (x.id === id ? { ...x, likes: res.likes, liked: res.liked } : x))
    );
  };

  const addComment: Store['addComment'] = async (id, author, text) => {
    const res = await api.addComment(id, author, text);
    setMedia((prev) =>
      prev.map((x) =>
        x.id === id
          ? { ...x, comments: [...x.comments, { id: String(res.id), author, text }] }
          : x
      )
    );
  };

  return (
    <Ctx.Provider value={{ media, loading, addMedia, updateMedia, deleteMedia, toggleLike, addComment }}>
      {children}
    </Ctx.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
};

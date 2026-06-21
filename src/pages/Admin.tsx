import { useState, useRef } from 'react';
import Nav from '@/components/Nav';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { CATEGORIES, MediaType, MediaItem } from '@/lib/gallery';

const ADMIN_PASSWORD = 'studio2026';

const TYPES: { value: MediaType; label: string; icon: string }[] = [
  { value: 'photo', label: 'Фото', icon: 'Image' },
  { value: 'video', label: 'Видео', icon: 'Video' },
  { value: 'gif', label: 'GIF', icon: 'Film' },
];

const EditModal = ({ item, onClose }: { item: MediaItem; onClose: () => void }) => {
  const { updateMedia } = useStore();
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [muted, setMuted] = useState(item.muted ?? true);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await updateMedia(item.id, { title: title.trim(), category, muted });
    toast.success('Изменения сохранены');
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl">Редактировать</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-sm">Название</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 h-11 rounded-xl" />
          </div>
          <div>
            <Label className="text-sm">Категория</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c !== 'Все').map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${category === c ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          {item.type === 'video' && (
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div className="flex items-center gap-2">
                <Icon name={muted ? 'VolumeX' : 'Volume2'} size={18} />
                <span className="text-sm">Без звука</span>
              </div>
              <Switch checked={muted} onCheckedChange={setMuted} />
            </div>
          )}
          <button onClick={save} disabled={saving}
            className="w-full py-3 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? 'Сохраняю…' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { addMedia, deleteMedia, media } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState('');
  const [pwdError, setPwdError] = useState(false);
  const [preview, setPreview] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('photo');
  const [category, setCategory] = useState('Природа');
  const [muted, setMuted] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [tab, setTab] = useState<'upload' | 'manage'>('upload');

  const checkPassword = () => {
    if (pwd === ADMIN_PASSWORD) { setUnlocked(true); setPwdError(false); }
    else { setPwdError(true); setPwd(''); }
  };

  const onFile = (f?: File) => {
    if (!f) return;
    setSelectedFile(f);
    setPreview(URL.createObjectURL(f));
    if (f.type.startsWith('video')) setType('video');
    else if (f.type === 'image/gif') setType('gif');
    else setType('photo');
  };

  const publish = async () => {
    if (!selectedFile || !title.trim()) { toast.error('Добавьте файл и название'); return; }
    setPublishing(true);
    try {
      await addMedia({ url: '', title: title.trim(), type, category, muted }, selectedFile);
      toast.success('Опубликовано в галерею');
      setPreview('');
      setTitle('');
      setSelectedFile(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch {
      toast.error('Ошибка загрузки файла');
    } finally {
      setPublishing(false);
    }
  };

  const confirmDelete = async (id: string, name: string) => {
    if (window.confirm(`Удалить «${name}»?`)) {
      await deleteMedia(id);
      toast.success('Удалено');
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen grain">
        <Nav />
        <div className="container flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-sm animate-fade-up">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-border mb-5">
                <Icon name="Lock" size={24} className="text-muted-foreground" />
              </div>
              <h1 className="font-display text-4xl">Доступ закрыт</h1>
              <p className="mt-2 text-sm text-muted-foreground">Введите пароль для входа в панель</p>
            </div>
            <div className="space-y-3">
              <Input type="password" value={pwd}
                onChange={(e) => { setPwd(e.target.value); setPwdError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
                placeholder="Пароль"
                className={`h-12 rounded-xl text-center tracking-widest ${pwdError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {pwdError && <p className="text-xs text-destructive text-center animate-fade-up">Неверный пароль</p>}
              <button onClick={checkPassword}
                className="w-full py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                Войти
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grain">
      <Nav />
      {editItem && <EditModal item={editItem} onClose={() => setEditItem(null)} />}

      <div className="container pt-16 pb-24 max-w-5xl">
        <h1 className="font-display text-5xl md:text-7xl animate-fade-up">Админ-панель</h1>

        <div className="mt-8 flex gap-1 p-1 bg-secondary rounded-full w-fit animate-fade-up">
          <button onClick={() => setTab('upload')}
            className={`px-5 py-2 rounded-full text-sm transition-colors ${tab === 'upload' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>
            Загрузить
          </button>
          <button onClick={() => setTab('manage')}
            className={`px-5 py-2 rounded-full text-sm transition-colors ${tab === 'manage' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>
            Управление ({media.length})
          </button>
        </div>

        {tab === 'upload' && (
          <div className="mt-10 grid md:grid-cols-2 gap-8 animate-fade-up">
            <div onClick={() => fileRef.current?.click()}
              className="cursor-pointer aspect-square rounded-2xl border-2 border-dashed border-border hover:border-accent transition-colors flex items-center justify-center overflow-hidden bg-card">
              {preview ? (
                type === 'video'
                  ? <video src={preview} muted loop autoPlay playsInline className="w-full h-full object-cover" />
                  : <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Icon name="ImagePlus" size={40} className="mx-auto mb-3" />
                  <p className="text-sm">Нажмите, чтобы выбрать файл</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])} />
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-sm">Название</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например, «Закат»" className="mt-2 h-11 rounded-xl" />
              </div>
              <div>
                <Label className="text-sm">Тип медиа</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {TYPES.map((t) => (
                    <button key={t.value} onClick={() => setType(t.value)}
                      className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-colors ${type === t.value ? 'border-accent bg-accent/10 text-accent' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                      <Icon name={t.icon} size={20} />
                      <span className="text-xs">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm">Категория</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => c !== 'Все').map((c) => (
                    <button key={c} onClick={() => setCategory(c)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${category === c ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              {type === 'video' && (
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Icon name={muted ? 'VolumeX' : 'Volume2'} size={18} />
                    <span className="text-sm">Без звука</span>
                  </div>
                  <Switch checked={muted} onCheckedChange={setMuted} />
                </div>
              )}
              <button onClick={publish} disabled={publishing}
                className="w-full py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {publishing
                  ? <><Icon name="Loader" size={16} className="animate-spin" />Загружаю…</>
                  : <><Icon name="Send" size={16} />Опубликовать</>}
              </button>
            </div>
          </div>
        )}

        {tab === 'manage' && (
          <div className="mt-10 space-y-3 animate-fade-up">
            {media.length === 0 && (
              <p className="text-muted-foreground text-sm py-10 text-center">Нет опубликованных материалов</p>
            )}
            {media.map((m) => (
              <div key={m.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-muted-foreground/30 transition-colors">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-secondary">
                  {m.type === 'video'
                    ? <div className="w-full h-full flex items-center justify-center"><Icon name="Video" size={20} className="text-muted-foreground" /></div>
                    : <img src={m.url} alt={m.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{m.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {m.category} · {m.type === 'photo' ? 'Фото' : m.type === 'video' ? 'Видео' : 'GIF'} · ❤️ {m.likes}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditItem(m)}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                    <Icon name="Pencil" size={15} />
                  </button>
                  <button onClick={() => confirmDelete(m.id, m.title)}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                    <Icon name="Trash2" size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

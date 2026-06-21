import { useState, useRef } from 'react';
import Nav from '@/components/Nav';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useStore } from '@/lib/store';
import { CATEGORIES, MediaType } from '@/lib/gallery';

const TYPES: { value: MediaType; label: string; icon: string }[] = [
  { value: 'photo', label: 'Фото', icon: 'Image' },
  { value: 'video', label: 'Видео', icon: 'Video' },
  { value: 'gif', label: 'GIF', icon: 'Film' },
];

const Admin = () => {
  const { addMedia, media } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('photo');
  const [category, setCategory] = useState('Природа');
  const [muted, setMuted] = useState(true);

  const onFile = (f?: File) => {
    if (!f) return;
    setPreview(URL.createObjectURL(f));
    if (f.type.startsWith('video')) setType('video');
    else if (f.type === 'image/gif') setType('gif');
    else setType('photo');
  };

  const publish = () => {
    if (!preview || !title.trim()) {
      toast.error('Добавьте файл и название');
      return;
    }
    addMedia({ url: preview, title: title.trim(), type, category, muted });
    toast.success('Опубликовано в галерею');
    setPreview('');
    setTitle('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="min-h-screen grain">
      <Nav />

      <div className="container pt-16 pb-24 max-w-5xl">
        <h1 className="font-display text-5xl md:text-7xl animate-fade-up">Админ-панель</h1>
        <p className="text-muted-foreground mt-3 animate-fade-up" style={{ animationDelay: '60ms' }}>
          Загрузите фото, видео или гифку — они появятся в галерее.
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div
            onClick={() => fileRef.current?.click()}
            className="animate-fade-up cursor-pointer aspect-square rounded-2xl border-2 border-dashed border-border hover:border-accent transition-colors flex items-center justify-center overflow-hidden bg-card"
          >
            {preview ? (
              type === 'video' ? (
                <video src={preview} muted loop autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              )
            ) : (
              <div className="text-center text-muted-foreground">
                <Icon name="ImagePlus" size={40} className="mx-auto mb-3" />
                <p className="text-sm">Нажмите, чтобы выбрать файл</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>

          <div className="space-y-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div>
              <Label className="text-sm">Название</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например, «Закат»"
                className="mt-2 h-11 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm">Тип медиа</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-colors ${
                      type === t.value
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
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
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      category === c
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
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

            <button
              onClick={publish}
              className="w-full py-3.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Icon name="Send" size={16} />
              Опубликовать
            </button>
          </div>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Всего в галерее: {media.length}
        </p>
      </div>
    </div>
  );
};

export default Admin;

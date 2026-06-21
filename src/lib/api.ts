const MEDIA_URL = 'https://functions.poehali.dev/2ea01408-61f6-49ce-a68e-26617248899f';
const UPLOAD_URL = 'https://functions.poehali.dev/2d40e903-3c3a-470f-9b62-49d0105b9cf0';

export const api = {
  getMedia: () =>
    fetch(MEDIA_URL).then((r) => r.json()),

  createMedia: (data: {
    type: string; url: string; title: string; category: string; muted: boolean;
  }) =>
    fetch(MEDIA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', ...data }),
    }).then((r) => r.json()),

  updateMedia: (data: {
    id: string; title: string; category: string; muted: boolean;
  }) =>
    fetch(MEDIA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', ...data }),
    }).then((r) => r.json()),

  hideMedia: (id: string) =>
    fetch(MEDIA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'hide', id }),
    }).then((r) => r.json()),

  addComment: (media_id: string, author: string, text: string) =>
    fetch(MEDIA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'comment', media_id, author, text }),
    }).then((r) => r.json()),

  toggleLike: (media_id: string, session_id: string) =>
    fetch(MEDIA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', media_id, session_id }),
    }).then((r) => r.json()),

  uploadFile: (file: File): Promise<{ url: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch(UPLOAD_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64, content_type: file.type }),
        });
        if (!res.ok) reject(new Error('Upload failed'));
        else resolve(res.json());
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }),
};

// Уникальный ID сессии для лайков
export const getSessionId = (): string => {
  let id = localStorage.getItem('studio_session');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('studio_session', id);
  }
  return id;
};

export type MediaType = 'photo' | 'video' | 'gif';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  title: string;
  category: string;
  muted?: boolean;
  likes: number;
  liked?: boolean;
  comments: { id: string; author: string; text: string }[];
}

export const CATEGORIES = ['Все', 'Природа', 'Архитектура', 'Абстракция', 'Видео'];
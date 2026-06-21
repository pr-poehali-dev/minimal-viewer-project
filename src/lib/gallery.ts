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

const IMG = (n: number) =>
  [
    'https://cdn.poehali.dev/projects/914aeb30-c6cd-441a-8fd3-b8b3551c630a/files/7c542a5f-2dc0-42a0-947f-a46784d74c86.jpg',
    'https://cdn.poehali.dev/projects/914aeb30-c6cd-441a-8fd3-b8b3551c630a/files/d5908ac0-3642-4fc7-b763-293a3bf2aced.jpg',
    'https://cdn.poehali.dev/projects/914aeb30-c6cd-441a-8fd3-b8b3551c630a/files/9b581f43-dc37-4a94-b7a0-e09fd8d72327.jpg',
  ][n];

export const initialMedia: MediaItem[] = [
  {
    id: '1',
    type: 'photo',
    url: IMG(0),
    title: 'Тишина',
    category: 'Природа',
    likes: 124,
    comments: [{ id: 'c1', author: 'Аня', text: 'Какой свет!' }],
  },
  {
    id: '2',
    type: 'photo',
    url: IMG(1),
    title: 'Изгиб',
    category: 'Архитектура',
    likes: 89,
    comments: [],
  },
  {
    id: '3',
    type: 'photo',
    url: IMG(2),
    title: 'Баланс',
    category: 'Абстракция',
    likes: 211,
    comments: [
      { id: 'c2', author: 'Макс', text: 'Медитативно' },
      { id: 'c3', author: 'Лера', text: 'Очень спокойно' },
    ],
  },
];

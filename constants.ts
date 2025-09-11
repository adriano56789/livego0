
import { Stream } from './types';

export const CATEGORIES = [
  'Popular',
  'Seguido',
  'Perto',
  'PK',
  'Novo',
  'Música',
  'Dança',
  'Festa',
  'Privada',
];

export const MOCK_STREAMS: Stream[] = [
  {
    id: 1,
    title: 'Desafio PK',
    streamer: 'Lest Go 500...',
    viewers: 0,
    country: 'br',
    imageUrl: 'https://picsum.photos/seed/1/400/600',
    tags: ['PK', 'Evento de PK'],
  },
  {
    id: 2,
    title: 'Festa dançante!',
    streamer: 'Rainha PK',
    viewers: 0,
    country: 'br',
    imageUrl: 'https://picsum.photos/seed/2/400/600',
    tags: ['Dança', 'PK'],
  },
  {
    id: 3,
    title: 'Sessão Privada',
    streamer: 'PK Pro',
    viewers: 0,
    country: 'br',
    imageUrl: 'https://picsum.photos/seed/3/400/600',
    tags: ['Privada'],
  },
  {
    id: 4,
    title: 'Música ao vivo',
    streamer: 'DJ Code',
    viewers: 1200,
    country: 'us',
    imageUrl: 'https://picsum.photos/seed/4/400/600',
    tags: ['Música'],
  },
  {
    id: 5,
    title: 'Novo no LiveGo!',
    streamer: 'Aventureira',
    viewers: 350,
    country: 'br',
    imageUrl: 'https://picsum.photos/seed/5/400/600',
    tags: ['Novo'],
  },
  {
    id: 6,
    title: 'Festa na piscina',
    streamer: 'Summer Vibes',
    viewers: 5600,
    country: 'us',
    imageUrl: 'https://picsum.photos/seed/6/400/600',
    tags: ['Festa'],
  },
];

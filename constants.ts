

import { GiftCategory } from './types.js';

// A lista de presentes estática (GIFTS) foi removida.
// Os presentes agora são carregados dinamicamente da API no GiftModal.

export const GIFT_CATEGORIES: GiftCategory[] = [
  { id: 'Mochila', label: 'Mochila' },
  { id: 'Popular', label: 'Popular' },
  { id: 'Luxo', label: 'Luxo' },
  { id: 'Atividade', label: 'Atividade' },
  { id: 'VIP', label: 'VIP' },
  { id: 'Efeito', label: 'Efeito' },
  { id: 'Entrada', label: 'Entrada' },
  { id: 'Galeria', label: 'Galeria' }
];

export const QUANTITY_OPTIONS = [1, 10, 99, 188, 520, 1314];
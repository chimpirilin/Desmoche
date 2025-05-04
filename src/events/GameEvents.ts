import { GameEventNames } from './constants';

export type GameEvents = {
  [GameEventNames.CARD_DRAWN]: { cardId: string };
  [GameEventNames.CARD_DISCARDED]: { index: number };
};
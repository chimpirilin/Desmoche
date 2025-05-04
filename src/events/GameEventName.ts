import { GameEventNames } from './constants';

export type GameEventName = typeof GameEventNames[keyof typeof GameEventNames];

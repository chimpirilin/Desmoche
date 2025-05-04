// GameEventBus.ts
import mitt, { Emitter } from 'mitt';
import { GameEventNames } from './constants';
import { GameEvents } from './GameEvents';

export class GameEventBus {
  private emitter: Emitter<GameEvents>;

  constructor() {
    this.emitter = mitt<GameEvents>();
  }

  // Emit
  public emitDrawCard(data: { cardId: string }) {
    this.emitter.emit(GameEventNames.CARD_DRAWN, data);
  }

  public emitDiscardCard(data: { index: number }) {
    this.emitter.emit(GameEventNames.CARD_DISCARDED, data);
  }

  public emitGameStarted() {
    this.emitter.emit(GameEventNames.GAME_STARTED, {});
  }

  // Listen
  onDrawCard(handler: (data: { cardId: string }) => void) {
    this.emitter.on(GameEventNames.CARD_DRAWN, (event) => {
      if ('cardId' in event) {
        handler(event);
      }
    });
  }

  onDiscardCard(handler: (data: { index: number }) => void) {
    this.emitter.on(GameEventNames.CARD_DISCARDED, (event) => {
      if ('index' in event) {
        handler(event);
      }
    });
  }

  onGameStarted(handler: () => void) {
    this.emitter.on(GameEventNames.GAME_STARTED, handler);
  }
}

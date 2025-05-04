import { describe, it, expect, vi } from 'vitest';
import { GameEventBus } from './GameEventBus';

describe('GameEventBus', () => {
    it('should emit and listen to CARD_DRAWN event', () => {
        const bus = new GameEventBus();
        const handler = vi.fn();

        bus.onDrawCard(handler);

        const eventData = { cardId: '123' };
        bus.emitDrawCard(eventData);

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(eventData);
    });

    it('should emit and listen to CARD_DISCARDED event', () => {
        const bus = new GameEventBus();
        const handler = vi.fn();

        bus.onDiscardCard(handler);

        const eventData = { index: 2 };
        bus.emitDiscardCard(eventData);

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(eventData);
    });

    it('should not call handler if event data does not match', () => {
        const bus = new GameEventBus();
        const handler = vi.fn();

        bus.onDrawCard(handler);

        // Emit an unrelated event
        bus.emitDiscardCard({ index: 1 });

        expect(handler).not.toHaveBeenCalled();
    });
});

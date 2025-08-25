import { describe, expect, test } from 'vitest';
import { Deck } from '../models/Deck';
import { DiscardPile } from '../models/DiscardPile';
import { BotPlayer } from '../models/BotPlayer';
import { Actor } from 'xstate';

describe('Bot turn FSM', () => {
    // IMPLEMENT ME
    test.skip('foo', () => {
        const deck: Deck = new Deck();
        const discardPile: DiscardPile = new DiscardPile();
        const botPlayer: BotPlayer = new BotPlayer(deck, discardPile, 'testBot');
    })
})
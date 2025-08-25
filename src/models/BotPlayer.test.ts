import { beforeEach, describe, test, expect, vi } from "vitest"
import { Card } from "./Card"
import { Deck } from "./Deck"
import { DiscardPile } from "./DiscardPile"
import { BotPlayer } from "./BotPlayer"
import { MeldPile } from "./MeldPile"

describe('Bot player', () => {
    let deck: Deck;
    let discardPile: DiscardPile;
    let bot: BotPlayer;

    // let's add predictable cards to the deck
    // this way we can test the bot's behavior without relying on randomness
    const mockCards: Card[] = [
        // initial hand
        { suit: 'spade', rank: 1, weight: Infinity },
        { suit: 'spade', rank: 2, weight: Infinity },
        { suit: 'spade', rank: 9, weight: Infinity },
        { suit: 'heart', rank: 2, weight: Infinity },
        { suit: 'heart', rank: 5, weight: Infinity },
        { suit: 'diamond', rank: 1, weight: Infinity },
        { suit: 'diamond', rank: 3, weight: Infinity },
        { suit: 'club', rank: 3, weight: Infinity },
        { suit: 'club', rank: 7, weight: Infinity },
        // draw after deal
        { suit: 'spade', rank: 3, weight: Infinity },
    ];
    beforeEach(() => {
        deck = new Deck();
        const mockGetRandomCardAndRemoveItFromDeck = vi.spyOn(deck, 'getRandomCardAndRemoveItFromDeck');
        mockGetRandomCardAndRemoveItFromDeck.mockImplementation(() => {
            return mockCards.shift()!;
        });
        discardPile = new DiscardPile();
        bot = new BotPlayer(deck, discardPile, 'bot');
    });

    // FIX ME
    test.skip('play and meld', () => {
        bot.play();

        // wanna do a "foo was called" type of test
        // but it needs methods of the class to be public
        // I'm gonna review the best OOP and unit testing practices
        // and decide what's best
        // commenting out for now

        // const spyDraw = vi.spyOn(bot, 'draw');
        // const spyCanMeld = vi.spyOn(bot, 'canMeld');
        // const spyMeld = vi.spyOn(bot, 'meld');

        // expect(spyDraw).toHaveBeenCalled();
        // expect(spyCanMeld).toHaveBeenCalled();
        // expect(spyMeld).toHaveBeenCalled();
        const nonEmptyMeldPile: MeldPile = bot.meldPiles.find(meldPile => meldPile.cardsInPile() > 0)!;
        expect(nonEmptyMeldPile.cardsInPile()).toBe(3);
    });

})
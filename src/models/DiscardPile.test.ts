import { Card } from "./Card";
import { DiscardPile } from "./DiscardPile";
import { describe, expect, it } from "vitest";

describe("DiscardPile", () => {
    const discardPile = new DiscardPile();
    
    it("should create an empty discard pile", () => {
        expect(discardPile.isPileEmpty()).toBeTruthy();
    });
    
    it("should add a card to the discard pile", () => {
        const card: Card = {rank: 1, suit: 'heart', weight: Infinity };
        discardPile.addCardToTop(card);
        expect(discardPile.cardsLeft()).toBe(1);
    });

    it('should retrieve the top card from the discard pile', () => {
        const card: Card = {rank: 1, suit: 'heart', weight: Infinity };
        const topCard: Card = discardPile.getTopCard();
        expect(topCard).toEqual(card);
    })
    
    it("should remove a card from the discard pile", () => {
        discardPile.removeTopCard();
        expect(discardPile.isPileEmpty()).toBeTruthy();
    });

    it('should throw while retrieving the top card', () => {
        expect(() => discardPile.getTopCard()).toThrow(/Cannot retrieve top card, pile is empty!/);
    })
})
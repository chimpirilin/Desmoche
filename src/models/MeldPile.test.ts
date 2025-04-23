import { Card } from "./Card";
import { MeldPile } from "./MeldPile";
import { describe, expect, it } from "vitest";
 
describe("MeldPile", () => {
    const meldPile = new MeldPile();
    
    it("should create an empty meld pile", () => {
        expect(meldPile.isEmpty()).toBeTruthy();
    });
    
    it("should add a card to the meld pile", () => {
        const card: Card = {rank: 1, suit: 'heart', weight: Infinity };
        meldPile.addCard(card);
        expect(meldPile.isEmpty()).toBeFalsy();
        expect(meldPile.cardsInPile()).toBe(1);
    });

    it("should add a card to the meld pile when pile is not empty", () => {
        const card: Card = {rank: 1, suit: 'heart', weight: Infinity };
        meldPile.addCard(card);
        expect(meldPile.isEmpty()).toBeFalsy();
        expect(meldPile.cardsInPile()).toBe(2);
    });

    it("should not add a card with different suit and rank", () => {
        const card: Card = {rank: 2, suit: 'diamond', weight: Infinity };
        const result = meldPile.addCard(card);
        expect(result).toBe("Cannot add card: suits do not match.");
        expect(meldPile.cardsInPile()).toBe(2);
    });

    it("should not add a card of same suit and rank not a consecutive number", () => {
        const card: Card = {rank: 3, suit: 'heart', weight: Infinity };
        const result = meldPile.addCard(card);
        expect(result).toBe("Cannot add card: ranks are not consecutive.");
        expect(meldPile.cardsInPile()).toBe(2);
    });

    it("should add a card of same suit and rank a consecutive number", () => {
        const card: Card = {rank: 2, suit: 'heart', weight: Infinity };
        const result = meldPile.addCard(card);
        expect(result).toBe("");
        expect(meldPile.cardsInPile()).toBe(3);
    });

})
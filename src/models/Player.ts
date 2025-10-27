import { Card } from "./Card";
import { Deck } from "./Deck";
import { DiscardPile } from "./DiscardPile";
import { MeldPile } from "./MeldPile";

function cardToString(card: Card): string {
    if(card.suit === HEART) return `♥${card.rank}`
    if(card.suit === DIAMOND) return `♦${card.rank}`
    if(card.suit === SPADE) return `♠${card.rank}`
    return `♣${card.rank}`
}

import { DECK_COMPONENTS, DIAMOND, HEART, INITIAL_HAND_SIZE, MELD_PILES_SIZE, SPADE } from "./constants";
//TODO: revise public methods to be private or protected
export abstract class Player {
    private _hand: Card[] = []
    private _meldPiles: MeldPile[] = []
    private _isFirstTurn: boolean = false
    private _isFirstPlayer: boolean = false

    constructor(private deck: Deck, protected discardPile : DiscardPile, private _name: string = 'Player') {
        this.initializeHand();

        for(let i = 0; i < MELD_PILES_SIZE; i++) {
            this._meldPiles.push(new MeldPile());
        }            
    }

    private set isFirstTurn(value: boolean) {
        this._isFirstTurn = value;
    }

    private initializeHand(): void {
        for(let i = 0; i < INITIAL_HAND_SIZE; i++) {
            this.drawFromDeck()
        }
    }

    private removeCardAtIndex(cardIndex: number) {
        this._hand.splice(cardIndex, 1);
    }

    public drawFromDeck(): void {
        if(this.deck.cardsLeft() === 0) {
            // we probably want to emit an event instead of throwing
            throw new Error('Cannot draw, deck is empty!');
        }
        this.addToHand(this.deck.getRandomCardAndRemoveItFromDeck());
        console.log(`${this._name} drew a card from the deck.`)
        console.log(`There are ${this.deck.cardsLeft()} cards left in the deck.`)
    }

    public addToHand(card: Card): void {
        this._hand.push(card);
    }

    public discardToPile(cardIndex: number): void {
        const cardToDiscard = this._hand[cardIndex];
        this.discardPile.addCardToTop(cardToDiscard);

        this.removeCardAtIndex(cardIndex);
    }

    public handOutCard(cardIndex: number): Card {
        const cardToHandOut = this._hand[cardIndex];
        this.removeCardAtIndex(cardIndex);
        return cardToHandOut
    }

    public receiveCard(card: Card): void {
        this.addToHand(card);
    }

    public cardsInHand(): string {
        const cardStrings = this._hand.map(card => cardToString(card));
        return cardStrings.join('| ');
    }

    public cardsInMeldPiles(): string {
        const piles = this._meldPiles.map((pile, index) => {
            const cardStrings = pile.pile.map(card => cardToString(card));
            return `Pile ${index + 1}: ${cardStrings.join('| ')}`;
        });
        return piles.join('\n');
    }

    public isWinner(): boolean {
        return this._hand.length === 0;
    }

    abstract exchangeCard(): void;

    get name(): string {
        return this._name;
    }

    get hand(): Card[] {
        return this._hand;
    }

    get meldPiles(): MeldPile[] {
        return this._meldPiles;
    }
}
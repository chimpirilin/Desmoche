import { Card } from "./Card";
import { Deck } from "./Deck";
import { DiscardPile } from "./DiscardPile";
import { MeldPile } from "./MeldPile";

import { INITIAL_HAND_SIZE, MELD_PILES_SIZE } from "./constants";
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
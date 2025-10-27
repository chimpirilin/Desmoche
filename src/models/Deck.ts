import { Card } from "./Card"
import { DECK_COMPONENTS } from "./constants"

export class Deck {
    private deck: Card[] = []

    constructor() {
        this.createDeck()
    }

    private createDeck(): void {
        for (const suit of DECK_COMPONENTS.suits) {
            for (const rank of DECK_COMPONENTS.values) {
                this.deck.push({ suit, rank, weight: Infinity })
            }
        }
        console.log('Deck created with', this.deck.length, 'cards.')
    }

    public getRandomCardAndRemoveItFromDeck(): Card {
        const index = Math.floor(Math.random() * this.deck.length)
        const card = this.deck[index]
        // splice is O(n), we have at most 52 cards in the deck so it's not a big deal
        this.deck.splice(index, 1)
        return card
    }

    public cardsLeft(): number {
        return this.deck.length
    }
}
import { Card } from "./Card"

// It only keeps track of the topmost card in the pile, the methods look like an overkill
export class DiscardPile {
    private pile: Card[] = []

    public isPileEmpty(): boolean {
        return this.cardsLeft() === 0
    }

    public cardsLeft(): number {
        return this.pile.length
    }

    public addCardToTop(card: Card): void {
        this.removeTopCard()
        this.pile.push(card)
    }   

    public getTopCard(): Card {
        if(this.isPileEmpty()) {
            throw new Error('Cannot retrieve top card, pile is empty!')
        }
        return this.pile[this.pile.length - 1]
    }

    public removeTopCard(): void {
        if(!this.isPileEmpty()) {
            this.pile.pop()
        }
    } 
}
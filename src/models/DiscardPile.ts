import { Card } from "./Card"

// It only keeps track of the topmost card in the pile, the methods look like an overkill
export class DiscardPile {
    private pile: Card[] = []

    private isPileEmpty(): boolean {
        return this.pile.length === 0
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
        if(this.isPileEmpty()) {
            throw new Error('Cannot remove top card, pile is empty!')
        }
        this.pile.pop()
    } 
}
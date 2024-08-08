import { Card } from "./Card";


export class MeldPile {
    private _pile: Card[] = []

    public addCard(card: Card): string {
        if(this._pile.length === 0) {
            this._pile.push(card)
            return ""
        }
        const topCard = this._pile[this._pile.length - 1]

        if(card.rank === topCard.rank) {
            this._pile.push(card)
            return ""
        }

        if(card.suit !== topCard.suit) {
            return "Cannot add card: suits do not match."
        }

        const nextRank = topCard.rank + 1 === 14 ? 1 : topCard.rank + 1

        if(card.rank !== nextRank) {
            return "Cannot add card: ranks are not consecutive."
        }
        this._pile.push(card)
        return ""
    }

    get pile(): Card[] {
        return this._pile
    }
}
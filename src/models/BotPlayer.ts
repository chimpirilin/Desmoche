import { Card } from "./Card";
import { Deck } from "./Deck";
import { DiscardPile } from "./DiscardPile";
import { Player } from "./Player";
import { CLUB, DIAMOND, HEART, SPADE } from "./constants";

export class BotPlayer extends Player {

    constructor(deck: Deck, discardPile : DiscardPile, name: string = 'Player') {
        super(deck, discardPile, name);
    }

    private getCardBySuit(suit: string): Card[] {
        const sortByRankAscending = (a: Card, b: Card) => a.rank - b.rank;

        return this.hand.filter(card => card.suit === suit).sort(sortByRankAscending)
    }

    private weightByDistance(distance: number): number {
        switch(distance) {
            case 1:
                return 3
            case 2:
                return 2
            case 3:
                return 1
            default:
                return 0
        }
    }

    // assign weights by suit
    private assignWeights(cards: Card[]): void {
        const addWeight = (card: Card, weight: number): void => {
            const existingWeight = card.weight ?? 0
            card.weight = existingWeight + weight
        }

        if(cards.length === 1) {
            addWeight(cards[0], 0)
        }

        for(let i = 0; i < cards.length - 1; i++) {
            const distance: number = cards[i + 1].rank - cards[i].rank
            const weight: number = this.weightByDistance(distance)

            addWeight(cards[i], weight)
            addWeight(cards[i+1], weight)
        }
    }

    private analyzeHand(): void {
        const hearts: Card[] = this.getCardBySuit(HEART)
        const clubs: Card[] = this.getCardBySuit(CLUB)
        const diamonds: Card[] = this.getCardBySuit(DIAMOND)
        const spades: Card[] = this.getCardBySuit(SPADE)

        const cardsBySuit: Array<Card[]> = [hearts, clubs, diamonds, spades]

        cardsBySuit.forEach(cards => {
            this.assignWeights(cards)
        })

        console.log('sds')
    }

    public exchangeCard(): void {
        
    }

    public play(): void {
        this.draw();
        this.analyzeHand();
    }
}
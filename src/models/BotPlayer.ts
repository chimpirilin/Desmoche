import { ALLOWED_CARDS_BY_PLAYER, CLUB, DIAMOND, HEART, SPADE } from "./constants";
import { Card } from "./Card";
import { Deck } from "./Deck";
import { DiscardPile } from "./DiscardPile";
import { Player } from "./Player";
import 
{ Suits } from "./Suits";
import { MeldPile } from "./MeldPile";

export class BotPlayer extends Player {

    constructor(deck: Deck, discardPile : DiscardPile, name: string = 'Player', private firstTurn: boolean = false) {
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
    private assignWeightsToSuit(cards: Card[]): void {
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

    
    
    public exchangeCard(): void {
        // implement me!
    }
    
    private checkNumberOfCardsByPlayerInvariant(): void {
        const handAndMelds: number = this.hand.length + this.meldPiles.reduce((acc, meldPile) => acc + meldPile.pile.length, 0)
        if(handAndMelds !== ALLOWED_CARDS_BY_PLAYER) {
            throw new Error(`Invariant exception:  BotPlayer ${this.name} has an invalid number of cards!`)
        }
    }
    
    private canMeld(suits: Suits): boolean {
        for(const suit of suits) {
            for(let i = 0; i < suit.length - 2; i++) {
                if(suit[i].rank + 1 === suit[i+1].rank && suit[i].rank+2 === suit[i+2].rank) {
                    return true
                }
            }
        }

        return false
    }

    private findEmptyMeldPile(): MeldPile | null {
        for(const meldPile of this.meldPiles) {
            if(meldPile.isEmpty()) {
                return meldPile
            }
        }
        return null
    }
                
                
    // run if and only if canMeld is true
    private meld(suits: Suits): void {
        if(this.findEmptyMeldPile() === null) {
            // handle this case
        }
        else {
            // check if there is a meld in the suit, the way we do it is by checking if we have 3 ascending cards
            // in the same suit, we can assume that the cards are sorted by rank
            for(const suit of suits) {
                for(let i = 0; i < suit.length - 2; i++) {
                    // check if the cards are in ascending order
                    if(suit[i].rank + 1 === suit[i+1].rank && suit[i].rank +2  === suit[i+2].rank) {
                        const meld: Card[] = [suit[i], suit[i+1], suit[i+2]]
                        // given that we are in the else case, we can assume that there is an empty meld pile
                        const meldPile: MeldPile = this.findEmptyMeldPile() as MeldPile
                        for(const card of meld) {
                            meldPile.addCard(card)
                            const indexOfMeldedCard: number = this.hand.findIndex(card => card.suit === meld[0].suit && card.rank === meld[0].rank)
                            this.discardToPile(indexOfMeldedCard)
                        }
                    }
                }
            }
        }
    }

    private assignWeights(): Suits {
        // Assign weights to cards in hand
        const hearts: Card[] = this.getCardBySuit(HEART)
        const clubs: Card[] = this.getCardBySuit(CLUB)
        const diamonds: Card[] = this.getCardBySuit(DIAMOND)
        const spades: Card[] = this.getCardBySuit(SPADE)

        const cardsBySuit: Suits = [hearts, clubs, diamonds, spades]

        cardsBySuit.forEach(cards => {
            this.assignWeightsToSuit(cards)
        })
        
        return cardsBySuit
    }

    public play(): void {
        // Invariant!
        this.checkNumberOfCardsByPlayerInvariant()
        this.draw()
        const drawnCard: Card = this.hand[this.hand.length - 1]

        const cardsBySuit: Suits = this.assignWeights()

        if(this.canMeld(cardsBySuit)) {
            // TODO: We need to take into account the case where all the meld piles
            // are full and we can just meld as implemented, instead we add a single card to the meld pile
            // and the game is over
            this.meld(cardsBySuit)
        }else if(this.firstTurn) {
            this.firstTurn = false
            const indexOfDrawnCard: number = this.hand.findIndex(card => card.suit === drawnCard.suit && card.rank === drawnCard.rank)

            if(indexOfDrawnCard === -1)  {
                throw new Error('Error while trying to discard drawn card!')
            }
            this.discardToPile(indexOfDrawnCard)
            this.play()
        }
    }
}
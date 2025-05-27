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
    
    // needed?
    // if yes, what's the best place to run it?
    // new run invariants state in FSM?
    private checkNumberOfCardsByPlayerInvariant(): void {
        const handAndMelds: number = this.hand.length + this.meldPiles.reduce((acc, meldPile) => acc + meldPile.pile.length, 0)
        if(handAndMelds !== ALLOWED_CARDS_BY_PLAYER) {
            throw new Error(`Invariant exception:  BotPlayer ${this.name} has an invalid number of cards!`)
        }
    }

    public isCardOnTopOfDiscardPileUseful(): boolean {
        if(this.discardPile.isPileEmpty()) return false
        const topOfDiscardPile: Card = this.discardPile.getTopCard()
        this.addToHand(topOfDiscardPile)

        const useful: boolean = this.isUseful(topOfDiscardPile)
        const indexOfDrawnCard: number = this.hand.findIndex(card => card.suit === topOfDiscardPile.suit && card.rank === topOfDiscardPile.rank)
        this.discardToPile(indexOfDrawnCard)

        return useful
    }

    public drawFromDiscardPile(): void {
        const topOfDiscardPile: Card = this.discardPile.getTopCard()
        this.addToHand(topOfDiscardPile)
    }

    private ascendingRankHand(): Card[] {
        // we don't want to mutate original array of cards
        const handCopy = structuredClone(this.hand)
        return handCopy.sort((a, b) => a.rank - b.rank)
    }

    private isUseful(card: Card): boolean {
        const ascendingHand = this.ascendingRankHand()
        const worstRank = ascendingHand[0].rank
        return card.rank > worstRank
    }
    
    public canMeld(): boolean {
        const suits: Suits = this.assignWeights()

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
    private meld(): void {
        const suits: Suits = this.assignWeights()
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

    /**
     * Discards the worst-ranked card from the player's hand.
     * The hand is first sorted in ascending order of rank, 
     * and the worst-ranked card (the first card in the sorted hand) 
     * is discarded to the pile.
     */
    public discard(): void {
        const ascendingHand: Card[] = this.ascendingRankHand()
        
        // after sorting the hand, the worst ranked card is the first one
        const worstRankedCard: Card = ascendingHand[0]
        const indexOfWorstRankedCard: number = this.hand.findIndex(card => card.suit === worstRankedCard.suit && card.rank === worstRankedCard.rank)
        this.discardToPile(indexOfWorstRankedCard)
    }
}
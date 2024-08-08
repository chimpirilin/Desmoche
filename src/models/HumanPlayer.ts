import { Deck } from "./Deck";
import { DiscardPile } from "./DiscardPile";
import { Player } from "./Player";

export class HumanPlayer extends Player {
    constructor(deck: Deck, discardPile : DiscardPile, name: string = 'Player') {
        super(deck, discardPile, name);
    }
}
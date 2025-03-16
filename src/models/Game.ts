import { Deck } from "./Deck"
import { BotPlayer } from "./BotPlayer"
import { HumanPlayer } from "./HumanPlayer"
import { DiscardPile } from "./DiscardPile"
import { Player } from "./Player"

// NOTE: this code mixes both model and controller functionality, refactor it to separate concerns
// create a GameModel that holds the state of the game (e.g., players, deck, discard pile).
// create a GameController class that holds game initialization, turn management, and player actions

export class GameModel {
    private botPlayers: BotPlayer[] = []
    // private humanPlayer: HumanPlayer
    private humanPlayer: HumanPlayer[] = []
    private _players: Player[]
    private deck: Deck
    private discardPile: DiscardPile
    private currentPlayer: Player
    private currentPlayerIndex: number = 0

    constructor(private playerCount: number) {
        this.deck = new Deck()
        this.discardPile = new DiscardPile()
        
        // this.humanPlayer = new HumanPlayer(this.deck, this.discardPile, 'Human')
        // we substract one because we don't count the human player
        // for(let i = 0; i < this.playerCount - 1; i++) {
        //     this.botPlayers.push(new BotPlayer(this.deck, this.discardPile, `Bot ${i}`))
        // }

        for(let i = 0; i < this.playerCount; i++) {
            this.humanPlayer.push(new HumanPlayer(this.deck, this.discardPile, `Human ${i}`))
        }

        this._players = [...this.humanPlayer, ...this.botPlayers]
        this.currentPlayer = this.determineInitialPlayer()

    }

    private determineInitialPlayer(): Player {
        this.currentPlayerIndex = Math.floor(Math.random() * this._players.length)
        return this._players[this.currentPlayerIndex]
    }

    private nextPlayer(): Player {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this._players.length
        return this._players[this.currentPlayerIndex]
    }

    public get players(): Player[] {
        return this._players;
    }
}


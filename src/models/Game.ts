import { Deck } from "./Deck"
import { BotPlayer } from "./BotPlayer"
import { HumanPlayer } from "./HumanPlayer"
import { DiscardPile } from "./DiscardPile"
import { Player } from "./Player"

import { GameEventBus } from "../events/GameEventBus"

export class GameModel {
    private botPlayers: BotPlayer[] = []
    // private humanPlayer: HumanPlayer
    private humanPlayer: HumanPlayer
    private _players: Player[]
    private deck: Deck
    private discardPile: DiscardPile
    private currentPlayer: Player
    private currentPlayerIndex: number = 0

    private eventEmitter: GameEventBus

    constructor(private playerCount: number) {
        this.deck = new Deck()
        this.discardPile = new DiscardPile()
        
        this.humanPlayer = new HumanPlayer(this.deck, this.discardPile, 'Human')
        // we substract one because we don't count the human player
        // Rememeber to substract one wehn when we finish human player
        for(let i = 0; i < this.playerCount; i++) {
            this.botPlayers.push(new BotPlayer(this.deck, this.discardPile, `Bot ${i}`))
        }

        // uncomment this line to add the human player to the game
        // this._players = [this.humanPlayer, ...this.botPlayers]
        this._players = [...this.botPlayers]
        this.currentPlayer = this.determineInitialPlayer()

        this.eventEmitter = new GameEventBus
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

    public startGame() {
        this.eventEmitter.emitGameStarted()
    }
}


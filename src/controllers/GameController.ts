import { GameModel } from "../models/Game";

export class GameController {
    private gameModel: GameModel

    constructor(playerCount: number) {
        this.gameModel = new GameModel(playerCount)
    }
}
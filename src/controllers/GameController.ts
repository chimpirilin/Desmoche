import { GameModel } from "../models/Game";
import { GameEventBus } from "../events/GameEventBus";

export class GameController {
    private gameModel: GameModel

    constructor(playerCount: number) {
        this.gameModel = new GameModel(playerCount)
    }

    // NOTE: we might not need a controller
    // event handlers should be enough

    public isFirstPlay() {
        return this.gameModel.isFirstPlay() 
    }

}
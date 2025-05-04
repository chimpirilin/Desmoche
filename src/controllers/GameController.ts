import { GameModel } from "../models/Game";
import { GameEventBus } from "../events/GameEventBus";

export class GameController {
    private gameModel: GameModel

    constructor(playerCount: number) {
        this.gameModel = new GameModel(playerCount)
    }

    // NOTE: we might not need a controller
    // event handlers should be enough

    private suscribeToEvents() {
        const eventBus = new GameEventBus()
        eventBus.onDrawCard((data) => {
            console.log("Card drawn:", data.cardId);
            // Handle card drawn event
        });
        eventBus.onDiscardCard((data) => {
            console.log("Card discarded:", data.index);
            // Handle card discarded event
        });

        eventBus.onGameStarted(() => {
            console.log("Game started");
            this.play();
        });
    }
   
    public play() {

    }
}
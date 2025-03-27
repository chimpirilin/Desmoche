import { GameModel } from "./models/Game"
import { PlayerStatus } from "./component/PlayerStatus"
import { GameArea } from "./component/GameArea"

function App() {
    // const game : GameModel = new GameModel(4)

    // return (
    //     <div>
    //         {game.players.map(player => (
    //             <PlayerStatus key={player.name} player={player} />
    //         ))}
    //     </div>
    // )

    return (
        <div>
            <GameArea />
        </div>
    )

    
}

export default App

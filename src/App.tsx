import { Game } from "./models/Game"
import { PlayerStatus } from "./component/PlayerStatus"

function App() {
    const game : Game = new Game(4)

    return (
        <div>
            {game.players.map(player => (
                <PlayerStatus key={player.name} player={player} />
            ))}
        </div>
    )
}

export default App

import { PlayerPosition } from '../models/constants'
import { BotMeldsPile } from './BotMeldsPile'
import { BotPlayerCards } from './BotPlayerCards'
import './GameArea.css'

export function GameArea() {
    return (
        <div className="background">
            <div className="game-area">
                <div></div>
                <div></div>
                <BotPlayerCards position={PlayerPosition.TOP} />
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <BotMeldsPile position={PlayerPosition.TOP} />
                <div></div>
                <div></div>
                <BotPlayerCards position={PlayerPosition.LEFT} />
                <BotMeldsPile position={PlayerPosition.LEFT} />
                <div></div>
                <BotMeldsPile position={PlayerPosition.RIGHT} />
                <BotPlayerCards position={PlayerPosition.RIGHT} />
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}
    

    
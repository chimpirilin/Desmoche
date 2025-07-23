import { useEffect } from 'react'

import { drawFromDeck } from '../animations/draw_from_deck'

import { PlayerPosition } from '../models/constants'
import { PlayerCards } from './PlayerCards'
import { MeldsPile } from './MeldsPile'
import { DeckAndDiscardPile } from './DeckAndDiscardPile'
import './GameArea.css'

export function GameArea() {

    useEffect(() => {
        const runAnimation = async () => {
            await drawFromDeck()
        }
        runAnimation()

    }, [])

    return (
        <div className="background">
            <div className="game-area">
                <div></div>
                <div></div>
                <PlayerCards position={PlayerPosition.TOP} />
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <MeldsPile position={PlayerPosition.TOP} />
                <div></div>
                <div></div>
                <PlayerCards position={PlayerPosition.LEFT} />
                <MeldsPile position={PlayerPosition.LEFT} />
                <DeckAndDiscardPile />
                <MeldsPile position={PlayerPosition.RIGHT} />
                <PlayerCards position={PlayerPosition.RIGHT} />
                <div></div>
                <div></div>
                <MeldsPile position={PlayerPosition.BOTTOM} />
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <PlayerCards position={PlayerPosition.BOTTOM} />
                <div></div>
                <div></div>
            </div>
        </div>
    )
}



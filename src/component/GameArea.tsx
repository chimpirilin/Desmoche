import { useEffect, useRef } from 'react'

import { drawFromDeck } from '../animations/draw_from_deck'

import { PlayerPosition } from '../models/constants'
import { PlayerCards } from './PlayerCards'
import { MeldsPile } from './MeldsPile'
import { DeckAndDiscardPile } from './DeckAndDiscardPile'
import './GameArea.css'
import { discard } from '../animations/discard'
import { decreaseNumberOfCardsOnDeck } from '../models/globals'
import { drawfromDiscardPile } from '../animations/draw_from_discard_pile'
import { meld } from '../animations/meld'
import { GameModel } from '../models/Game'
import { createGameMachine } from '../finite_state_machines/gameFsm'
import { createActor, toPromise } from 'xstate'

export function GameArea() {
    let shouldMount = useRef(true)

    useEffect(() => {
        // const runAnimation = async () => {
        //     // await meld(3, 'TOP', 'HORIZONTAL')
        //     // await discard()
        //     // await drawfromDiscardPile()
        //     // await drawFromDeck()
        //     // decreaseNumberOfCardsOnDeck();
        //     // await drawFromDeck()
        //     // decreaseNumberOfCardsOnDeck();
        //     // await drawFromDeck()
        //     // decreaseNumberOfCardsOnDeck();
        // }
        // runAnimation()
        if(shouldMount.current === false) return;
        shouldMount.current = false;
        let mounted = true;
        console.log('GameArea useEffect mounted');
        (async () => {
            if(!mounted) return;
            const gameModel = new GameModel(4);

            const gameMachine = createGameMachine(gameModel, true);

            const gameActor = createActor(gameMachine);
            gameActor.start();
            await toPromise(gameActor);
        })();
        return () => { 
            mounted = false
        }
    }, [])

    return (
        <div className="background">
            <div className="game-area">

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
                <PlayerCards position={PlayerPosition.TOP} />
                <div></div>
                <div></div>
                <div></div>

                <div></div>
                <div></div>
                <div></div>
                <MeldsPile position={PlayerPosition.TOP} />
                <div></div>
                <div></div>
                <div></div>

                <div></div>
                <PlayerCards position={PlayerPosition.LEFT} />
                <MeldsPile position={PlayerPosition.LEFT} />
                <DeckAndDiscardPile />
                <MeldsPile position={PlayerPosition.RIGHT} />
                <PlayerCards position={PlayerPosition.RIGHT} />
                <div></div>

                <div></div>
                <div></div>
                <div></div>
                <MeldsPile position={PlayerPosition.BOTTOM} />
                <div></div>
                <div></div>
                <div></div>

                <div></div>
                <div></div>
                <div></div>
                <PlayerCards position={PlayerPosition.BOTTOM} />
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}



import { fromPromise, setup } from 'xstate';
import { GameModel } from '../models/Game';
import { BotPlayer } from '../models/BotPlayer';

import { drawFromDeck } from '../animations/draw_from_deck';

export function createBotMachine(bot: BotPlayer) {
    return setup({
        actors: {
            drawingFromDiscardPileAnimation: fromPromise(async () => {
                await drawFromDeck()
            })
        },
        guards: {
            isFirstTurn: () => GameModel.isFirstPlay(),
            isCardOnTopOfDiscardPileUseful: ({context}) => context.bot.isCardOnTopOfDiscardPileUseful(),
            canMeld: ({context}) => context.bot.canMeld()
        },
        actions: {
            setFirstTurnToFalse: () => {
                if(GameModel.isFirstPlay()) GameModel.setFirstPlayToFalse()
            }
        }
    }).createMachine({
        id: 'botTurn',
        initial: 'start',
        context: {
            bot
        },
        states: {
            start: {
                description: 'let copilot do it',
                always: 'determiningIfDiscaredCardIsUseful'
            },
            determiningIfDiscaredCardIsUseful: {
                always: [
                    // we probably need an action to be performed if it's the first play of the game
                    // it will just set firPlay to false
                    // dont forget to add that later
                    {guard: 'isCardOnTopOfDiscardPileUseful', target: 'drawingFromDiscardPile'},
                    {target: 'drawingFromDeck'}
                ]
            },
            drawingFromDiscardPile: {
                invoke: {
                    src: 'drawingFromDiscardPileAnimation',
                    onDone: {
                        target: 'canMeld',
                        actions: () => console.log('drawingFromDiscardPile ended qq')
                    },
                }
            },
            drawingFromDeck: {

            },
            canMeld: {
                always: [
                    {guard: 'canMeld', target: 'melding'},
                    {target: 'discarding'},
                ]
            },
            melding: {

            },
            discarding: {

            },
            isFirstTurn: {
                always: [
                    {guard: 'isFirstTurn', actions: 'setFirstTurnToFalse', target: 'drawingFromDeck'},
                    {actions: 'setFirstTurnToFalse', target: 'turnEnd'}
                ]
            },
            turnEnd: {
                type: 'final'
            }
        }
    })
}
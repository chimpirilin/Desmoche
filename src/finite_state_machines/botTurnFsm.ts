import { createMachine } from 'xstate';
import { GameController } from '../controllers/GameController';
import { GameModel } from '../models/Game';
import { BotPlayer } from '../models/BotPlayer';

export function createBotMachine(bot: BotPlayer) {
    return createMachine({
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
                on: {
                    OnDrawingFromDiscardPileEnd: {
                        target: 'UPDATE ME' 
                    }
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
    }, 
    {
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
    })
}
import { fromPromise, setup } from 'xstate';
import { GameModel } from '../models/Game';
import { BotPlayer } from '../models/BotPlayer';

import { discard } from '../animations/discard';
import { drawFromDeck } from '../animations/draw_from_deck';
import { drawfromDiscardPile } from '../animations/draw_from_discard_pile';
import { meld } from '../animations/meld';

export function createBotMachine(bot: BotPlayer, animationsEnabled: boolean = true) {
    return setup({
        actors: {
            drawFromDiscardPileAnimation: fromPromise(async () => {
                await drawfromDiscardPile()
            }),
            drawFromDeckAnimation: fromPromise(async () => {
                await drawFromDeck()
            }),
            discardAnimation: fromPromise(async () => {
                await discard()
            }),
            meldAnimation: fromPromise(async () => {
                await meld()
            })
        },
        guards: {
            isFirstTurn: () => GameModel.isFirstPlay(),
            isCardOnTopOfDiscardPileUseful: ({context}) => context.bot.isCardOnTopOfDiscardPileUseful(),
            canMeld: ({context}) => context.bot.canMeld(),
            shouldAnimate: ({context}) => context.shouldAnimate
        },
        actions: {
            setFirstTurnToFalse: () => {
                if(GameModel.isFirstPlay()) GameModel.setFirstPlayToFalse()
            },
            drawFromTheDeck: ({context}) => context.bot.drawFromDeck(),
            drawfromTheDiscardPile: ({context}) => context.bot.drawFromDiscardPile(),
            meld: ({context}) => context.bot.meld(),
            discard: ({context}) => context.bot.discard()
        }
    }).createMachine({
        id: 'botTurn',
        initial: 'start',
        context: {
            bot,
            animationsEnabled
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
                    {guard: 'isCardOnTopOfDiscardPileUseful', target: 'drawingFromDiscardPileAnimation'},
                    {target: 'drawingFromDeck'}
                ]
            },
            drawingFromDiscardPile: {
                always: [
                    // if this action doesn't behave as expected, add target: can meld to to other two below
                    {actions: 'drawfromTheDiscardPile'},
                    {guard: 'shouldAnimate', target: 'drawFromDiscardPileAnimation'},
                    {target: 'canMeld'}
                ]
            },
            drawingFromDiscardPileAnimation: {
                invoke: {
                    src: 'drawFromDiscardPileAnimation',
                    onDone: {
                        target: 'canMeld',
                        actions: () => console.log('drawingFromDiscardPile ended qq')
                    },
                }
            },
            drawingFromDeck: {
                always: [
                    // if this action doesn't behave as expected, add target: can meld to to other two below
                    {actions: 'drawFromTheDeck'},
                    {guard: 'shouldAnimate', target: 'drawingFromDeckAnimation'},
                    {target: 'canMeld'}
                ]
            },
            drawingFromDeckAnimation: {
                invoke: {
                    src: 'drawFromDeckAnimation',
                    onDone: {
                        target: 'canMeld',
                        actions: () => console.log('drawingFromDeckAnimation ended qq')
                    },
                }
            },
            canMeld: {
                always: [
                    {guard: 'canMeld', target: 'melding'},
                    {target: 'discarding'},
                ]
            },
            melding: {
                always: [
                    {actions: 'meld'},
                    {guard: 'shouldAnimate', target: 'meldingAnimation'},
                    {target: 'discard'}
                ]
            },
            meldingAnimation: {
                invoke: {
                    src: 'meldAnimation',
                    onDone: {
                        target: 'discard',
                        actions: () => console.log('meldingAnimation ended qq')
                    },
                }
            },
            discarding: {
                always: [
                    {actions: 'discard'},
                    {guard: 'shouldAnimate', target: 'discardingAnimation'},
                    {target: 'isFirstTurn'}
                ]
            },
            discardingAnimation: {
                invoke: {
                    src: 'discardAnimation',
                    onDone: {
                        target: 'isFirstTurn',
                        actions: () => console.log('discardingAnimations ended qq')
                    },
                }
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
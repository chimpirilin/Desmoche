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
                console.log('drawFromDeckAnimation actor started')
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
            shouldAnimate: ({context}) => {
                console.log('shouldAnimate guard evaluated to', context.animationsEnabled)
                return context.animationsEnabled
            }
        },
        actions: {
            setFirstTurnToFalse: () => {
                if(GameModel.isFirstPlay()) GameModel.setFirstPlayToFalse()
            },
            drawFromTheDeck: ({context}) => {
                console.log('action drawFromTheDeck started')
                context.bot.drawFromDeck()
                console.log('action drawFromTheDeck ended')
            },
            drawfromTheDiscardPile: ({context}) => context.bot.drawFromDiscardPile(),
            meld: ({context}) => context.bot.meld(),
            discard: ({context}) => {
                console.log('action discard started')
                context.bot.discard()
                console.log('action discard ended')
            }
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
                entry: () => console.log('start state entered'),
                description: 'let copilot do it',
                always: 'determiningIfDiscardedCardIsUseful',
            },
            determiningIfDiscardedCardIsUseful: {
                entry: () => console.log('determiningIfDiscardedCardIsUseful state entered'),
                always: [
                    // we probably need an action to be performed if it's the first play of the game
                    // it will just set firstPlay to false
                    // dont forget to add that later
                    {guard: 'isCardOnTopOfDiscardPileUseful', target: 'drawingFromDiscardPileAnimation'},
                    {target: 'drawingFromDeck'}
                ]
            },
            drawingFromDiscardPile: {
                entry: () => console.log('drawingFromDiscardPile state entered'),
                always: [
                    // if this action doesn't behave as expected, add target: can meld to to other two below
                    {actions: 'drawfromTheDiscardPile'},
                    {guard: 'shouldAnimate', target: 'drawingFromDiscardPileAnimation'},
                    {target: 'canMeld'}
                ]
            },
            drawingFromDiscardPileAnimation: {
                entry: () => console.log('drawingFromDiscardPileAnimation state entered'),
                invoke: {
                    src: 'drawFromDiscardPileAnimation',
                    onDone: {
                        target: 'canMeld',
                        actions: () => console.log('drawingFromDiscardPile ended qq')
                    },
                }
            },
            drawingFromDeck: {
                entry: () => console.log('drawingFromDeck state entered'),

                always: [
                    // if this action doesn't behave as expected, add target: can meld to to other two below
                    // {actions: 'drawFromTheDeck'},
                    {guard: 'shouldAnimate', actions: 'drawFromTheDeck', target: 'drawingFromDeckAnimation'},
                    {actions: 'drawFromTheDeck', target: 'canMeld'}
                ]
            },
            drawingFromDeckAnimation: {
                // entry: () => console.log('drawingFromDeckAnimation state entered'),
                invoke: {
                    entry: () => console.log('drawingFromDeckAnimation state entered'),
                    src: 'drawFromDeckAnimation',
                    onDone: {
                        target: 'canMeld',
                        actions: () => console.log('drawingFromDeckAnimation ended qq')
                    },
                }
            },
            canMeld: {
                entry: () => console.log('canMeld state entered'),
                always: [
                    {guard: 'canMeld', target: 'melding'},
                    {target: 'discarding'},
                ]
            },
            melding: {
                entry: () => console.log('melding state entered'),
                always: [
                    // {actions: 'meld'},
                    {guard: 'shouldAnimate', actions: 'meld', target: 'meldingAnimation'},
                    {actions: 'meld', target: 'discarding'}
                ]
            },
            meldingAnimation: {
                entry: () => console.log('meldingAnimation state entered'),
                invoke: {
                    src: 'meldAnimation',
                    onDone: {
                        target: 'discarding',
                        actions: () => console.log('meldingAnimation ended qq')
                    },
                }
            },
            discarding: {
                entry: () => console.log('discarding state entered'),
                always: [
                    // {actions: 'discard'},
                    {guard: 'shouldAnimate', actions: 'discard', target: 'discardingAnimation'},
                    {actions: 'discard', target: 'isFirstTurn'}
                ]
            },
            discardingAnimation: {
                entry: () => console.log('discardingAnimation state entered'),
                invoke: {
                    src: 'discardAnimation',
                    onDone: {
                        target: 'isFirstTurn',
                        actions: () => console.log('discardingAnimations ended qq')
                    },
                }
            },
            isFirstTurn: {
                entry: () => console.log('isFirstTurn state entered'),
                always: [
                    {guard: 'isFirstTurn', actions: 'setFirstTurnToFalse', target: 'drawingFromDeck'},
                    {actions: 'setFirstTurnToFalse', target: 'turnEnd'}
                ]
            },
            turnEnd: {
                entry: () => console.log('turnEnd state entered'),
                type: 'final'
            }
        }
    })
}
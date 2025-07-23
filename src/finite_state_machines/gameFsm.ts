import { Actor, createActor , fromPromise, setup, toPromise } from 'xstate';
import { GameModel } from '../models/Game';
import { createBotMachine } from './botTurnFsm';
import { BotPlayer } from '../models/BotPlayer';
import { Player } from '../models/Player';

// TODO: should this FSM also handle an animation for game winner?

async function botPlay(bot: any) {
    const botActor = createActor(bot)
    botActor.start()
    await toPromise(botActor)
}


type PlayerExpanded = {
    player: BotPlayer,
    // machine: ReturnType<typeof createBotMachine>, // Do I need the machine?
    actor: Actor<ReturnType<typeof createBotMachine>>
}

function createGameMachine(game: GameModel) {

    const initialPlayer: Player = game.currentPlayer

    const botPlayers: PlayerExpanded[] = []
    
    const initialPlayerActor = createActor(createBotMachine(initialPlayer as BotPlayer))

    const initalPlayerExpanded: PlayerExpanded = {
        player: initialPlayer as BotPlayer,
        actor: initialPlayerActor
    }

    botPlayers.push(initalPlayerExpanded)

    // Note below code is old, but might still be relevant
    // assumption: botMachines[0] is the inital player of the game
    // botMachines.push(createBotMachine(initialPlayer as BotPlayer))
    for(const botPlayer of game.botPlayersList) {
        if(botPlayer.name === initalPlayerExpanded.player.name) continue
        const playerActor = createActor(createBotMachine(botPlayer))
        const playerExpanded: PlayerExpanded = {
            player: botPlayer as BotPlayer,
            actor: playerActor
        }
        botPlayers.push(playerExpanded)
    }

    return setup({
        actions: {
            setFirstPlayer: ({ context }) => {
                context.currentPlayer = context.player1
            },
            setNextPlayer: ({ context }) => {
                context.currentPlayer = context.game.nextPlayer()
            },
            determineCurrentPlayer: ({ context }) => {
                const botActor = [...botActorsMap]
                const bot1 = (botActor[0][1].config.context as { bot: BotPlayer }).bot;
                if(bot1.name === context.gameModel.currentPlayer.name ) {
                    context.currentPlayer = context.player1
                    return
                }

                const bot2 = (botMachines[1].config.context as { bot: BotPlayer }).bot;
                if(bot2.name === context.gameModel.currentPlayer.name ) {
                    context.currentPlayer = context.player2
                    return
                }
                
                const bot3 = (botMachines[2].config.context as { bot: BotPlayer }).bot;
                if(bot3.name === context.gameModel.currentPlayer.name ) {
                    context.currentPlayer = context.player3
                    return
                }

                const bot4 = (botMachines[3].config.context as { bot: BotPlayer }).bot;
                if(bot4.name === context.gameModel.currentPlayer.name ) {
                    context.currentPlayer = context.player4
                    return
                }
            },
        },
        actors: {
            botTurn: fromPromise(async ({input}: {input: any}) => {
                const currentPlayer = input.bot
                await botPlay(currentPlayer)
            })
        },
        guards: {
            isTheMatchOver: () => game.matchOver()
        }
    }).createMachine({
        id: 'game',
        initial: 'start',
        context: {
            // remember that player1 is the inital player of the game
            player1: createActor(botMachines[0]),
            player2: createActor(botMachines[1]),
            player3: createActor(botMachines[2]),
            player4: createActor(botMachines[3]),
            // the value assigned is a dummy placeholder
            // its purpose is to prevent TS from yelling at us
            // in setFirstPlayer guard
            currentPlayer: createActor(botMachines[0]),
            gameModel: game
        },
        states: {
            start: {
                always: [
                    {actions: 'setFirstPlayer', target: 'determineTheCurrentPlayer'}
                ]
            },
            determineTheCurrentPlayer: {
                always: [
                    {actions: 'determineCurrentPlayer', target: 'play'}
                ]
            },
            play: {
                invoke: {
                    src: 'botTurn',
                    onDone: {
                        target: 'isMatchOver',
                        actions: () => console.log('turn ended')
                    },
                    input: {
                        bot: ({context}: { context: { currentPlayer: Actor<any> } }) => context.currentPlayer
                    },
                    
                }
            },
            setNextPlayer: {
                always: [
                    {actions: ''}
                ]
            },
            isMatchOver: {
                always: [
                    {guard: 'isTheMatchOver', target: 'matchOver'},
                    {target: }
                ]
            },
            matchOver: {
                type: "final"
            }
        }
    })
}
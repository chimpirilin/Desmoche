import { Actor, assign, createActor , fromPromise, setup, toPromise } from 'xstate';
import { GameModel } from '../models/Game';
import { createBotMachine } from './botTurnFsm';
import { BotPlayer } from '../models/BotPlayer';
import { Player } from '../models/Player';

// TODO: should this FSM also handle an animation for game winner?

async function botPlay(bot: ReturnType<typeof createBotMachine>) {
    const botActor = createActor(bot)
    botActor.start()
    await toPromise(botActor)
}

type PlayerAndMachine = {
    player: BotPlayer,
    machine: ReturnType<typeof createBotMachine>, // Do I need the machine?
}

export function createGameMachine(game: GameModel, animationsEnabled: boolean = true) {

    const initialPlayer: Player = game.currentPlayer

    const botPlayers: PlayerAndMachine[] = []
    
    const initialPlayerMachine = createBotMachine(initialPlayer as BotPlayer, true, animationsEnabled)

    const initalPlayerAndMachine: PlayerAndMachine = {
        player: initialPlayer as BotPlayer,
        machine: initialPlayerMachine
    }

    botPlayers.push(initalPlayerAndMachine)

    // Note below code is old, but might still be relevant
    // assumption: botMachines[0] is the inital player of the game
    // botMachines.push(createBotMachine(initialPlayer as BotPlayer))
    for(const botPlayer of game.botPlayersList) {
        if(botPlayer.name === initalPlayerAndMachine.player.name) continue
        const playerMachine = createBotMachine(botPlayer, false, animationsEnabled)
        const PlayerAndMachine: PlayerAndMachine = {
            player: botPlayer as BotPlayer,
            machine: playerMachine
        }
        botPlayers.push(PlayerAndMachine)
    }

    return setup({
        actions: {
            setFirstPlayer: ({ context }) => {
                context.currentPlayer = context.player1
            },
            setTheNextPlayer: assign(({context}) => {
                const nextPlayer = game.nextPlayer()
                
                console.log(`current player was: ${context.currentPlayer.player.name}`)
                console.log(`Determining next player: ${nextPlayer.name}`)

                // player1.player, yikes!
                if(nextPlayer.name === context.player1.player.name) {
                    console.log(`Next player is: ${context.player1.player.name}`);
                    return {
                        currentPlayer: context.player1
                    }
                }
                if(nextPlayer.name === context.player2.player.name) {
                    console.log(`Next player is: ${context.player2.player.name}`);
                    return {
                        currentPlayer: context.player2
                    }
                }
                if(nextPlayer.name === context.player3.player.name) {
                    console.log(`Next player is: ${context.player3.player.name}`);
                    return {
                        currentPlayer: context.player3
                    }
                }
                if(nextPlayer.name === context.player4.player.name) {
                    console.log(`Next player is: ${context.player4.player.name}`);
                    return {
                        currentPlayer: context.player4
                    }
                }
            }),
        },
        actors: {
            botTurn: fromPromise(async ({input}: {input: any}) => {
                const currentPlayer = input.botMachine
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
            player1: botPlayers[0],
            player2: botPlayers[1],
            player3: botPlayers[2],
            player4: botPlayers[3],
            // the value assigned is a dummy placeholder
            // its purpose is to prevent TS from yelling at us
            // in setFirstPlayer guard
            currentPlayer: botPlayers[0],
            gameModel: game
        },
        states: {
            start: {
                entry: () => console.log(`game start state entered`),
                always: [
                    {actions: 'setFirstPlayer', target: 'play'}
                ]
            },
            play: {
                entry: () => console.log(`game play state entered, bot to play is ${game.currentPlayer.name}`),
                invoke: {
                    src: 'botTurn',
                    onDone: {
                        target: 'isMatchOver',
                        actions: assign({ // this is horrible, but we need to do it cause otherwise
                            // player1 will draw twice on each turn
                            // Will leave it like this for now
                            // We could have two machines for the first player, one for the first turn and another for subsequent turns
                            // and have a first turn boolean in the context of the game machine
                            // still dont like it but way better than running below on each turn
                            player1: ({context}) => {
                                console.log('resetting player1 machine')
                                const player = context.player1.player
                                const machine = createBotMachine(player, false, animationsEnabled)
                                return {player, machine}
                                },
                            // currentPlayer: ({context}) => context.player1 // reset current player to player1 after each turn
                            })
                    },
                    input: ({context}: { context: { currentPlayer: PlayerAndMachine } }) => ({botMachine: context.currentPlayer.machine})
                    
                }
            },
            setNextPlayer: {
                entry: () => console.log('setNextPlayer state entered'),
                always: [
                    {actions: 'setTheNextPlayer', target: 'play'}
                ]
            },
            isMatchOver: {
                entry: () => console.log('isMatchOver state entered'),
                always: [
                    {guard: 'isTheMatchOver', target: 'matchOver'},
                    {target: 'setNextPlayer'} 
                ]
            },
            matchOver: {
                entry: () => console.log('matchOver state entered'),
                type: "final"
            }
        }
    })
}
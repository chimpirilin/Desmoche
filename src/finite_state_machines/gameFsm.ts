import { Actor, createActor , fromPromise, setup, toPromise } from 'xstate';
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

function createGameMachine(game: GameModel) {

    const initialPlayer: Player = game.currentPlayer

    const botPlayers: PlayerAndMachine[] = []
    
    const initialPlayerMachine = createBotMachine(initialPlayer as BotPlayer)

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
        const playerMachine = createBotMachine(botPlayer)
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
            setTheNextPlayer: ({ context }) => {
                const nextPlayer = context.game.nextPlayer()

                // player1.player, yikes!
                if(nextPlayer.name === context.player1.player.name) {
                    context.currentPlayer = context.player1
                    return
                }
                if(nextPlayer.name === context.player2.player.name) {
                    context.currentPlayer = context.player2
                    return
                }
                if(nextPlayer.name === context.player3.player.name) {
                    context.currentPlayer = context.player3
                    return
                }
                if(nextPlayer.name === context.player4.player.name) {
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
                always: [
                    {actions: 'setFirstPlayer', target: 'play'}
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
                        // this is wrong, we need to send a machine and not an actor
                        bot: ({context}: { context: { currentPlayer: PlayerAndMachine } }) => context.currentPlayer.machine
                    },
                    
                }
            },
            setNextPlayer: {
                always: [
                    {actions: 'setTheNextPlayer', target: 'play'}
                ]
            },
            isMatchOver: {
                always: [
                    {guard: 'isTheMatchOver', target: 'matchOver'},
                    {target: 'play'} 
                ]
            },
            matchOver: {
                type: "final"
            }
        }
    })
}
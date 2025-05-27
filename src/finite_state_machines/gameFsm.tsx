import { Actor, createActor ,createMachine } from 'xstate';
import { GameModel } from '../models/Game';
import { createBotMachine } from './botTurnFsm';
import { BotPlayer } from '../models/BotPlayer';
import { Player } from '../models/Player';

function createGameMachine(game: GameModel) {

    const initialPlayer: Player = game.currentPlayer

    const botMachines: ReturnType<typeof createBotMachine>[] = []

    // assumption: botMachines[0] is the inital player of the game
    botMachines.push(createBotMachine(initialPlayer as BotPlayer))

    for(const botPlayer of game.botPlayersList) {
        if(botPlayer.name === initialPlayer.name) continue
        botMachines.push(createBotMachine(botPlayer))
    }

    return createMachine({
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
                
            }
        }
    },
    {
        actions: {
            setFirstPlayer: ({context}) => {
                context.currentPlayer = context.player1
            },
            determineCurrentPlayer: ({ context }) => {
                const bot1 = (botMachines[0].config.context as { bot: BotPlayer }).bot;
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

            }
        }
    })
}
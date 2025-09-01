import { describe, expect, test } from 'vitest';
import { Actor, createActor, toPromise } from 'xstate';

import { GameModel } from '../models/Game';
import { createGameMachine } from './gameFsm';

describe('Bot turn FSM', () => {
    // IMPLEMENT ME
    test('foo', async () => {
        const gameModel = new GameModel(4);

        const gameMachine = createGameMachine(gameModel);
        expect(gameMachine).toBeDefined();

        const gameActor = createActor(gameMachine);
        gameActor.start();
        await toPromise(gameActor);
    })
})
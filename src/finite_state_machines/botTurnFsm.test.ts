import {afterEach, describe, test, expect } from "vitest"
import { Actor, createActor, toPromise } from "xstate"

import { createBotMachine } from "./botTurnFsm"
import { BotPlayer } from "../models/BotPlayer"
import { Deck } from "../models/Deck"
import { DiscardPile } from "../models/DiscardPile"

describe('Bot turn FSM', () => {

    let machineActor: Actor<any> ;
    afterEach(() => {
        machineActor!.stop();
  });

    test('foo', async () => {
        const deck: Deck = new Deck();
        const discardPile: DiscardPile = new DiscardPile();
        const botPlayer: BotPlayer = new BotPlayer(deck, discardPile, 'testBot');
        const botMachine = createBotMachine(botPlayer, true, false);
        
        expect(botMachine).toBeDefined();
        
        machineActor = createActor(botMachine);
        expect(machineActor).toBeDefined();

        machineActor.start();

        await toPromise(machineActor);
    }, 3000)
})



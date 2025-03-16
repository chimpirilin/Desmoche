import {expect, test} from 'vitest'
import { GameModel } from './Game'

const game = new GameModel(2)

test('should create a game with 2 players', () => {
    expect(game).toBeDefined()
})
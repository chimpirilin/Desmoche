import {expect, test} from 'vitest'
import { Game } from './GameModel'

const game = new Game(2)

test('should create a game with 2 players', () => {
    expect(game).toBeDefined()
})
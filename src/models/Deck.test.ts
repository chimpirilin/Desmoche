import {expect, test} from 'vitest'
import { Deck } from './Deck'

const deck = new Deck()

test('should create a deck with 52 cards', () => {
    expect(deck.cardsLeft()).toBe(52)
})

test('should remove a card from deck', () => {
    const card = deck.getRandomCardAndRemoveItFromDeck()
    expect(card).toBeDefined()
    expect(deck.cardsLeft()).toBe(51)
})
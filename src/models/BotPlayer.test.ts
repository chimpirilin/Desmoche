import { describe } from "vitest"
import { Deck } from "./Deck"
import { DiscardPile } from "./DiscardPile"
import { BotPlayer } from "./BotPlayer"


describe('Bot player', () => {
    const deck = new Deck()
    const discardPile = new DiscardPile()
    const bot = new BotPlayer(deck, discardPile, 'bot');
    bot.play();
})
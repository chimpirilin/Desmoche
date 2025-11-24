import { CARDS_ON_DECK_AFTER_DEALING } from "./constants";

export let numberOfCardsOnDeck = CARDS_ON_DECK_AFTER_DEALING

export function decreaseNumberOfCardsOnDeck() {
    if (numberOfCardsOnDeck > 0) {
        console.log('decreased numberOfCardsOnDeck from', numberOfCardsOnDeck, 'to', numberOfCardsOnDeck - 1);

        numberOfCardsOnDeck--;
    }
}
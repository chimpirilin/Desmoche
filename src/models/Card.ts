import { DECK_COMPONENTS } from "./constants";
export type Card = {
    suit: typeof DECK_COMPONENTS.suits[number];
    rank: typeof DECK_COMPONENTS.values[number];
    weight: number;
}
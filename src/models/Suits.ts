import { Card } from "./Card";
// This type represents an array of arrays of Card objects.
// Each array represents a suit of cards.
// For example, the first array might contain all the hearts in a player's hand.
export type Suits = Array<Array<Card>>;
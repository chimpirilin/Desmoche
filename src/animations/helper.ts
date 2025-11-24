import { Card } from "../models/Card";

/**
 * Return the filename (without file extension) for a card image corresponding to the given card.
 *
 * The function maps face-card ranks to their names and appends an "s" to the suit:
 * - rank 1  -> "ace"
 * - rank 11 -> "jack"
 * - rank 12 -> "queen"
 * - rank 13 -> "king"
 * For all other ranks the numeric value is used as-is.
 *
 * Example return values:
 * - ace_of_spades.png
 * - 10_of_clubs.png
 * - queen_of_hearts.png
 *
 * Note: The function appends the ".png" extension to the generated name,
 * and does not perform case normalization or validation of the suit.
 *
 * @param card - The card object containing a numeric `rank` and a `suit` string.
 *               Expected shape: { rank: number; suit: string }
 * @returns The image filename for the card (e.g. "queen_of_hearts.png"), including file extension.
 */
export function nameOfCardImage(card: Card): string {
    const {rank, suit} = card;
    let rootPath = './src/assets/cards/'
    if(rank === 11) return rootPath + `jack_of_${suit}s.svg`;
    if(rank === 12) return rootPath + `queen_of_${suit}s.svg`;
    if(rank === 13) return rootPath + `king_of_${suit}s.svg`;
    if(rank === 1) return rootPath + `ace_of_${suit}s.svg`;
    return rootPath + `${card.rank}_of_${card.suit}s.svg`;
}
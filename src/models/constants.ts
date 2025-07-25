export const INITIAL_HAND_SIZE = 9
export const MELD_PILES_SIZE = 3

export const HEART = 'heart' 
export const DIAMOND = 'diamond'
export const CLUB = 'club'
export const SPADE = 'spade'

export const DECK_COMPONENTS = {
    suits: [HEART, DIAMOND, CLUB, SPADE],
    values: [1,2,3,4,5,6,7,8,9,10,11,12,13]
} as const

export enum PlayerPosition {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT
}

export enum CardsOrientation {
    VERTICAL,
    HORIZONTAL
}

export const ALLOWED_DEALT_CARDS: number = 9
export const CARDS_ON_DECK_AFTER_DEALING: number = 16
export const ALLOWED_CARDS_BY_PLAYER: number = 9
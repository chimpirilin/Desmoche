import { CARDS_ON_DECK_AFTER_DEALING } from "../models/constants"

export function DeckAndDiscardPile() : JSX.Element {
    const stackingOffset = 0.3
     return (
        <div>
            <div className={`deck-container`}>
                {Array.from({ length: CARDS_ON_DECK_AFTER_DEALING }).map((_, index) => (
                    <img key={index} src={`./src/assets/cards/face_down_vertical.svg`} className={`deck-card`} 
                    style={{
                        left: `${index * stackingOffset}px`,
                        top: `${index * stackingOffset}px`,
                    }}
                    />
                ))}
            </div>
            <div className={`discard-pile`}>
            </div>
        </div>
     ) 
}
import { ALLOWED_DEALT_CARDS, CardsOrientation, PlayerPosition } from "../models/constants";

export function PlayerCards({position}: {position: PlayerPosition}) : JSX.Element {
    const orientation: CardsOrientation = position === PlayerPosition.LEFT || position === PlayerPosition.RIGHT ? CardsOrientation.VERTICAL : CardsOrientation.HORIZONTAL;

     return (
        <div className={`card-container-${PlayerPosition[position]}`}>
            {Array.from({ length: ALLOWED_DEALT_CARDS }).map((_, index) => (
                <img key={index} src={`./src/assets/cards/face_down_vertical.svg`} className={`card-${CardsOrientation[orientation]} card-${PlayerPosition[position]}`} />
            ))}
        </div>
     ) 
}
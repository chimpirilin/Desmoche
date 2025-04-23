import { CardsOrientation, PlayerPosition } from "../models/constants";

export function MeldsPile({position}: {position: PlayerPosition}) : JSX.Element {
    const orientation: CardsOrientation = position === PlayerPosition.LEFT || position === PlayerPosition.RIGHT ? CardsOrientation.VERTICAL : CardsOrientation.HORIZONTAL;

     return (
        <div className={`meld-pile-container-${PlayerPosition[position]}`}>
            <div className={`meld-pile-${CardsOrientation[orientation]}`}></div>
            <div className={`meld-pile-${CardsOrientation[orientation]}`}></div>
            <div className={`meld-pile-${CardsOrientation[orientation]}`}></div>
        </div>
     ) 
}

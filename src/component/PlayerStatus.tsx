import { Player } from "../models/Player";

interface PlayerStatusProps {
    player: Player;
  }
  
  export function PlayerStatus({ player }: PlayerStatusProps) {

    return (
        <>
            <h2>{player.name}</h2>
            <h3>Hand: {player.hand.reduce((partial, card) => partial+`${partial === '' ? '' : ' - '} ${card.rank} of ${card.suit}`, '')}</h3>
            <h3>Meld Piles</h3>
            {
                player.meldPiles.map((pile, pileIndex) => {
                    return (
                        <div key={`pile-${pileIndex}`}>
                            <h4>Meld Pile {pileIndex + 1}</h4>
                            <ul>
                                {pile.pile.map((card, cardIndex) => {
                                    return (
                                        <li key={`pile-${pileIndex}-card-${cardIndex}`}>{card.rank} of {card.suit}</li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })
            }
        </>
    )
}
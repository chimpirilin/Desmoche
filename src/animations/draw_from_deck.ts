import { numberOfCardsOnDeck } from "../models/globals"

export function drawFromDeck() {
    // TODO programatically deduce orientation and direction
    const hand: HTMLImageElement  = document.querySelector('.card-container-TOP')!
    const tmpImg: HTMLImageElement = document.createElement('img')
    // TODO programatically deduce if it's vertical or horizontal and
    tmpImg.classList.add('card-HORIZONTAL', 'card-TOP')
    tmpImg.style.visibility = 'hidden'
    hand.appendChild(tmpImg)

    // final destination of animation, that is the hand
    const finalRect: DOMRect = tmpImg.getBoundingClientRect()
    hand.removeChild(tmpImg)

    const deck: HTMLImageElement = document.querySelector('.deck-container')!
    
    // top card of the deck is the source
    const sourceCard: HTMLImageElement = deck.querySelector(`#deck-card-${numberOfCardsOnDeck}`)! as HTMLImageElement

    sourceCard.style.position = 'absolute';
    // source destination of the animation, that is the deck
    const sourceRect: DOMRect = sourceCard.getBoundingClientRect()

     // Get the closest positioned ancestor of sourceCard
     const positionedAncestor = sourceCard.offsetParent as HTMLElement;
     const ancestorRect = positionedAncestor.getBoundingClientRect();
 
     // Calculate relative coordinates
     const relativeLeft = finalRect.left - ancestorRect.left;
     const relativeTop = finalRect.top - ancestorRect.top;
 
     // Set the initial position of the source card
     sourceCard.style.left = `${sourceRect.left - ancestorRect.left}px`;
     sourceCard.style.top = `${sourceRect.top - ancestorRect.top}px`;
 


    sourceCard.style.transition = 'all 4s ease'
    // TODO: make it programatically
    sourceCard.src = './src/assets/cards/2_of_clubs.svg'

    requestAnimationFrame(() => {
        sourceCard.style.left = `${relativeLeft}px`
        sourceCard.style.top = `${relativeTop}px`
    })

    return new Promise<void>((resolve) => {
        sourceCard.addEventListener('transitionend', () => {
            hand.appendChild(sourceCard);
            sourceCard.style.left = '';
            sourceCard.style.top = '';
            sourceCard.style.zIndex = '';
            sourceCard.style.position = '';
            sourceCard.style.transition = '';
            sourceCard.classList = 'card-HORIZONTAL card-TOP'
            //TODO: below must be programtically to determine vertical or horizonatl
            sourceCard.src = './src/assets/cards/face_down_vertical.svg'
            resolve();
        });
    });
}
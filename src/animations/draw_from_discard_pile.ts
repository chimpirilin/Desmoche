// IMPLEMENT ME
export async function drawfromDiscardPile(): Promise<void> {
    console.log('entered drawfromDiscardPile animation');
    const discardContainer = document.querySelector('.discard-pile') as HTMLElement | null;
    const hand = document.querySelector('.card-container-TOP') as HTMLElement | null;

    if (!discardContainer || !hand) return;

    const cards = Array.from(discardContainer.querySelectorAll('img')) as HTMLImageElement[];
    if (cards.length === 0) return;

    // take the topmost card (last child) from discard
    const sourceCard = cards[cards.length - 1];

    // measure final destination by inserting a hidden image into the hand
    const tmp = document.createElement('img') as HTMLImageElement;
    tmp.classList.add('card-HORIZONTAL', 'card-TOP');
    tmp.style.visibility = 'hidden';
    hand.appendChild(tmp);
    const finalRect = tmp.getBoundingClientRect();
    hand.removeChild(tmp);

    const sourceRect = sourceCard.getBoundingClientRect();

    // get closest positioned ancestor for consistent coordinates
    const positionedAncestor = (sourceCard.offsetParent as HTMLElement) || document.body;
    const ancestorRect = positionedAncestor.getBoundingClientRect();

    const relativeLeft = finalRect.left - ancestorRect.left;
    const relativeTop = finalRect.top - ancestorRect.top;

    // set initial absolute positioning
    sourceCard.style.position = 'absolute';
    sourceCard.style.left = `${sourceRect.left - ancestorRect.left}px`;
    sourceCard.style.top = `${sourceRect.top - ancestorRect.top}px`;
    sourceCard.style.zIndex = '1000';

    // optional: reveal card image while moving (adjust image as needed)
    // sourceCard.src = './src/assets/cards/2_of_clubs.svg'

    // prepare transition
    sourceCard.style.transition = 'left 600ms ease, top 600ms ease';

    // ensure layout applies before starting animation
    await new Promise<void>(r => requestAnimationFrame(() => r()));

    // animate and await completion
    await new Promise<void>((resolve) => {
        const onEnd = () => {
            sourceCard.removeEventListener('transitionend', onEnd);
            // append to hand and cleanup
            hand.appendChild(sourceCard);
            sourceCard.style.left = '';
            sourceCard.style.top = '';
            sourceCard.style.zIndex = '';
            sourceCard.style.position = '';
            sourceCard.style.transition = '';
            sourceCard.classList = 'card-HORIZONTAL card-TOP';
            sourceCard.src = './src/assets/cards/face_down_vertical.svg'
            resolve();
        };

        sourceCard.addEventListener('transitionend', onEnd);

        // start the animation
        requestAnimationFrame(() => {
            sourceCard.style.left = `${relativeLeft}px`;
            sourceCard.style.top = `${relativeTop}px`;
        });
    });
}
// IMPLEMENT ME
export async function discard(): Promise<void> {
    const hand = document.querySelector('.card-container-TOP') as HTMLElement | null;
    const discardContainer = document.querySelector('.discard-pile') as HTMLElement | null;

    if (!hand || !discardContainer) return;

    const cards = Array.from(hand.querySelectorAll('img')) as HTMLImageElement[];
    if (cards.length === 0) return;

    // we could make it random, for now just take the last card
    const sourceCard = cards[0];

    // create temporary hidden image in discard to measure destination
    const tmp = document.createElement('img') as HTMLImageElement;
    tmp.classList.add('card-HORIZONTAL', 'card-TOP');
    tmp.style.visibility = 'hidden';
    discardContainer.appendChild(tmp);
    const finalRect = tmp.getBoundingClientRect();
    discardContainer.removeChild(tmp);

    const sourceRect = sourceCard.getBoundingClientRect();

    // closest positioned ancestor
    const positionedAncestor = (sourceCard.offsetParent as HTMLElement) || document.body;
    const ancestorRect = positionedAncestor.getBoundingClientRect();

    // relative coordinates
    const relativeLeft = finalRect.left - ancestorRect.left;
    const relativeTop = finalRect.top - ancestorRect.top;

    // set initial position
    sourceCard.style.position = 'absolute';
    sourceCard.style.left = `${sourceRect.left - ancestorRect.left}px`;
    sourceCard.style.top = `${sourceRect.top - ancestorRect.top}px`;
    sourceCard.style.zIndex = '1000';

    // trigger layout then animate
    // use a short transition; adjust duration as needed
    sourceCard.style.transition = 'all 4s ease'
    sourceCard.src = './src/assets/cards/2_of_clubs.svg'

    // ensure next frame before changing values
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

    return new Promise<void>((resolve) => {
        const onEnd = (ev: Event) => {
            sourceCard.removeEventListener('transitionend', onEnd);
            // move to discard container
            discardContainer.appendChild(sourceCard);
            // cleanup inline styles
            sourceCard.style.left = '';
            sourceCard.style.top = '';
            sourceCard.style.zIndex = '';
            sourceCard.style.position = '';
            sourceCard.style.transition = '';
            // set classes appropriately (adjust as needed)
            sourceCard.classList = 'card-HORIZONTAL card-TOP';
            // wait 1 second after animation finishes before resolving
            setTimeout(() => resolve(), 1000);
        };

        sourceCard.addEventListener('transitionend', onEnd);

        // start animation
        requestAnimationFrame(() => {
            sourceCard.style.left = `${relativeLeft}px`;
            sourceCard.style.top = `${relativeTop}px`;
        });
    });
}
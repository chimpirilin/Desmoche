// IMPLEMENT ME
export async function meld(count: number, fromPosition: string = 'TOP', toPosition: string = 'TOP'): Promise<void> {
    console.log(`entered meld animation from ${fromPosition} to ${toPosition} with count ${count}`);
    const hand = document.querySelector(`.card-container-${fromPosition}`) as HTMLElement | null;
    const meldContainer = document.querySelector(`.meld-pile-${toPosition}`) as HTMLElement | null;

    if (!hand || !meldContainer) return;

    const cards = Array.from(hand.querySelectorAll('img')) as HTMLImageElement[];
    if (cards.length === 0) return;

    // take up to `count` cards from the hand (take the first `count` cards)
    const selected = cards.slice(0, Math.max(0, Math.min(count, cards.length)));

    // measure final destination rect (we'll offset subsequent cards slightly)
    const tmp = document.createElement('img') as HTMLImageElement;
    tmp.classList.add('card-HORIZONTAL', 'card-TOP');
    tmp.style.visibility = 'hidden';
    meldContainer.appendChild(tmp);
    const baseFinalRect = tmp.getBoundingClientRect();
    meldContainer.removeChild(tmp);

    // animate cards sequentially with a small stagger
    for (let i = 0; i < selected.length; i++) {
        const sourceCard = selected[i];

        const sourceRect = sourceCard.getBoundingClientRect();
        const positionedAncestor = (sourceCard.offsetParent as HTMLElement) || document.body;
        const ancestorRect = positionedAncestor.getBoundingClientRect();

        // relative destination with small offsets so melded cards are slightly fanned/staggered
        const offsetX = i * 12; // adjust spacing as desired
        const offsetY = i * 4;
        const relativeLeft = baseFinalRect.left - ancestorRect.left + offsetX;
        const relativeTop = baseFinalRect.top - ancestorRect.top + offsetY;

        // set initial absolute positioning
        sourceCard.style.position = 'absolute';
        sourceCard.style.left = `${sourceRect.left - ancestorRect.left}px`;
        sourceCard.style.top = `${sourceRect.top - ancestorRect.top}px`;
        sourceCard.style.zIndex = `${1000 + i}`;

        // prepare transition
        sourceCard.style.transition = 'left 400ms ease, top 400ms ease';
        sourceCard.src = './src/assets/cards/5_of_hearts.svg'

        // ensure layout applied
        await new Promise<void>(r => requestAnimationFrame(() => r()));

        // animate and await completion
        await new Promise<void>((resolve) => {
            const onEnd = (ev: Event) => {
                sourceCard.removeEventListener('transitionend', onEnd);
                // append to meld pile and cleanup styles
                meldContainer.appendChild(sourceCard);
                sourceCard.style.left = '';
                sourceCard.style.top = '';
                sourceCard.style.zIndex = '';
                sourceCard.style.position = '';
                sourceCard.style.transition = '';
                // keep classes consistent (adjust if you track orientation)
                sourceCard.classList = 'card-HORIZONTAL card-TOP';
                // small pause after each card finishes to create visible stagger
                setTimeout(() => resolve(), 80);
            };
            sourceCard.addEventListener('transitionend', onEnd);

            // start animation
            requestAnimationFrame(() => {
                sourceCard.style.left = `${relativeLeft}px`;
                sourceCard.style.top = `${relativeTop}px`;
            });
        });
    }
}
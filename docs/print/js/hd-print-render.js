(() => {
  const root = document.getElementById('hd-print-root');
  const deckSelect = document.getElementById('hd-print-deck');
  const sidesSelect = document.getElementById('hd-print-sides');
  const guidesInput = document.getElementById('hd-print-guides');
  const typeInputs = [...document.querySelectorAll(
    '.hd-print-controls fieldset input[type="checkbox"]'
  )];
  const count = document.getElementById('hd-print-count');
  const printButton = document.getElementById('hd-print-button');

  const backByKind = {
    race: 'hd-raster-v0.5/print-master/png/backs/verso-race.png',
    tactic: 'hd-raster-v0.5/print-master/png/backs/verso-tactic.png',
    decree: 'hd-raster-v0.5/print-master/png/backs/verso-decree.png',
  };

  function frontPath(card) {
    return `hd-raster-v0.5/print-master/png/fronts/${card.id.toLowerCase()}-frente.png`;
  }

  function copiesFor(card, mode) {
    if (mode === 'models') return 1;
    if (card.kind === 'race') return 2;
    if (card.kind === 'decree') return 1;
    return HD_TACTIC_COPIES[card.id] ?? 2;
  }

  function selectedCards() {
    const enabledKinds = new Set(
      typeInputs.filter(input => input.checked).map(input => input.value)
    );
    return HD_PRINT_CARDS
      .filter(card => enabledKinds.has(card.kind))
      .flatMap(card =>
        Array.from(
          { length: copiesFor(card, deckSelect.value) },
          (_, copy) => ({ ...card, copy: copy + 1 })
        )
      );
  }

  function pagesOf(cards) {
    const pages = [];
    for (let index = 0; index < cards.length; index += 9) {
      const page = cards.slice(index, index + 9);
      while (page.length < 9) page.push(null);
      pages.push(page);
    }
    return pages;
  }

  function mirrorPage(page) {
    return [
      page[2], page[1], page[0],
      page[5], page[4], page[3],
      page[8], page[7], page[6],
    ];
  }

  function cardSlot(card, side) {
    const slot = document.createElement('div');
    slot.className = 'hd-print-slot';
    if (guidesInput.checked) slot.classList.add('guides');

    if (!card) {
      slot.classList.add('blank');
      return slot;
    }

    const image = document.createElement('img');
    image.src = side === 'front' ? frontPath(card) : backByKind[card.kind];
    image.alt = side === 'front'
      ? `${card.id} ${card.name}, frente`
      : `Verso de ${card.kind}`;
    slot.appendChild(image);
    return slot;
  }

  function sheetHeading(side, index, total) {
    const heading = document.createElement('div');
    heading.className = 'hd-sheet-heading';
    heading.innerHTML = `
      <strong>${side === 'front' ? 'Frentes' : 'Versos'}</strong>
      <span>folha ${index + 1}/${total}</span>
    `;
    return heading;
  }

  function sheet(page, side) {
    const element = document.createElement('section');
    element.className = `hd-a4-sheet hd-${side}-sheet`;
    const orderedCards = side === 'front' ? page : mirrorPage(page);
    orderedCards.forEach(card => element.appendChild(cardSlot(card, side)));
    return element;
  }

  function sheetGroup(cards, side) {
    const group = document.createElement('div');
    group.className = `hd-sheet-group hd-${side}-group`;
    const pages = pagesOf(cards);

    pages.forEach((page, index) => {
      group.appendChild(sheetHeading(side, index, pages.length));
      group.appendChild(sheet(page, side));
    });

    return group;
  }

  function duplexSheetGroup(cards) {
    const group = document.createElement('div');
    group.className = 'hd-sheet-group hd-duplex-group';
    const pages = pagesOf(cards);

    pages.forEach((page, index) => {
      group.appendChild(sheetHeading('front', index, pages.length));
      group.appendChild(sheet(page, 'front'));
      group.appendChild(sheetHeading('back', index, pages.length));
      group.appendChild(sheet(page, 'back'));
    });

    return group;
  }

  function render() {
    const cards = selectedCards();
    const sides = sidesSelect.value;
    root.replaceChildren();

    if (sides === 'both') {
      root.appendChild(duplexSheetGroup(cards));
    } else if (sides === 'front') {
      root.appendChild(sheetGroup(cards, 'front'));
    } else {
      root.appendChild(sheetGroup(cards, 'back'));
    }

    const pageCount = Math.ceil(cards.length / 9);
    const sideCount = sides === 'both' ? 2 : 1;
    count.textContent =
      `${cards.length} cartas · ${pageCount * sideCount} folhas A4`;
  }

  [deckSelect, sidesSelect, guidesInput, ...typeInputs]
    .forEach(control => control.addEventListener('change', render));
  printButton.addEventListener('click', () => window.print());
  render();
})();

/**
 * Renderizador do microprotótipo DemonLord v0.2.1.
 */

function microCardShell(kind, body) {
  return `<div class="card-sheet micro-card-sheet">
    <article class="card-face micro-card ${kind}">${body}</article>
  </div>`;
}

function renderMicroRace(card) {
  const effect = card.effect === '—'
    ? '<span class="micro-muted">Sem habilidade</span>'
    : card.effect;

  return microCardShell('micro-race', `
    <div class="micro-cost" title="Contrato">${card.cost}<span>◆</span></div>
    <header class="micro-race-title">${card.name}</header>
    <div class="micro-stats">
      <div><b>♥</b><span>PV</span><strong>${card.pv}</strong></div>
      <div><b>✦</b><span>ATK</span><strong>${card.atk}</strong></div>
      <div><b>INT</b><span>INT</span><strong>${card.int}</strong></div>
    </div>
    <div class="micro-art" aria-label="Placeholder de arte">
      <span>${card.art}</span>
      <small>ARTE PROVISÓRIA</small>
    </div>
    <footer class="micro-race-footer">
      <span class="micro-trait">${card.trait} · ${card.sex}</span>
      <p>${effect}</p>
    </footer>
    <span class="micro-id">${card.id}</span>
  `);
}

function renderMicroItem(card) {
  return microCardShell(`micro-item item-${card.type.toLowerCase().replace(/\s+/g, '-')}`, `
    <header class="micro-item-head">
      <span class="micro-item-type">${card.type}</span>
      <h3>${card.name}</h3>
    </header>
    <div class="micro-item-art">
      <span>${card.icon}</span>
      <small>ITEM</small>
    </div>
    <div class="micro-rules">
      <p>${card.effect}</p>
    </div>
    <span class="micro-id">${card.id}</span>
  `);
}

function renderMicroDecree(card) {
  return microCardShell('micro-decree', `
    <div class="micro-secret">SECRETO</div>
    <header class="micro-decree-head">
      <span>Decreto do Rei Demônio</span>
      <h3>${card.name}</h3>
    </header>
    <div class="micro-budget">
      <small>ORÇAMENTO</small>
      <strong>${card.budget}<span>◆</span></strong>
    </div>
    <div class="micro-requirements">
      <small>REQUISITOS</small>
      ${card.requirements.map((req) => `<div>✓ ${req}</div>`).join('')}
    </div>
    <div class="micro-decree-note">Menor Verba resolve empates.</div>
    <span class="micro-id">${card.id}</span>
  `);
}

function microChunk(cards, size) {
  const chunks = [];
  for (let i = 0; i < cards.length; i += size) {
    chunks.push(cards.slice(i, i + size));
  }
  return chunks;
}

function renderMicroSheets(root, title, cards, renderer) {
  const pages = microChunk(cards, 9);

  pages.forEach((page, pageIndex) => {
    const sheet = document.createElement('section');
    sheet.className = 'micro-sheet print-only';
    sheet.innerHTML = `<div class="micro-sheet-label">${title} · folha ${pageIndex + 1}/${pages.length}</div>`;

    page.forEach((card) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = renderer(card);
      sheet.appendChild(wrap.firstElementChild);
    });

    for (let i = page.length; i < 9; i += 1) {
      const blank = document.createElement('div');
      blank.className = 'card-sheet micro-card-sheet';
      blank.innerHTML = '<div class="card-face micro-card micro-blank">ESPAÇO VAZIO</div>';
      sheet.appendChild(blank);
    }

    root.appendChild(sheet);
  });
}

function renderMoneySheet(root) {
  const sheet = document.createElement('section');
  sheet.className = 'money-sheet print-only';
  sheet.innerHTML = `
    <header>
      <h2>Verba Real</h2>
      <p>24× 1◆ · 16× 3◆ · 8× 5◆ · Tesouro ilimitado no protótipo</p>
    </header>
    <div class="money-grid"></div>
  `;

  const grid = sheet.querySelector('.money-grid');
  [
    ...Array(24).fill(1),
    ...Array(16).fill(3),
    ...Array(8).fill(5),
  ].forEach((value) => {
    const token = document.createElement('div');
    token.className = `money-token money-${value}`;
    token.innerHTML = `<span class="money-crown">♛</span><strong>${value}</strong><small>VERBA<br>REAL</small>`;
    grid.appendChild(token);
  });

  root.appendChild(sheet);
}

function renderMicroPrototype(targetId) {
  const root = document.getElementById(targetId);
  if (!root) return;

  const count = document.getElementById('micro-count');
  if (count) {
    count.textContent = `${MICRO_COUNTS.total} cartas: ${MICRO_COUNTS.races} Raças, ${MICRO_COUNTS.items} Itens e ${MICRO_COUNTS.decrees} Decretos`;
  }

  renderMicroSheets(root, 'Raças', MICRO_RACES, renderMicroRace);
  renderMicroSheets(root, 'Itens', MICRO_ITEMS, renderMicroItem);
  renderMicroSheets(root, 'Decretos', MICRO_DECREES, renderMicroDecree);
  renderMoneySheet(root);
}

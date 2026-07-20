/**
 * Render card DOM from cards-data.js
 */
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
}

function cardShell(innerHtml) {
  return `<div class="card-sheet"><div class="card-face">${innerHtml}</div></div>`;
}

function backShell() {
  return cardShell(`
    <div class="card-back" style="width:100%;height:100%">
      <div class="emblem">✦</div>
      <div class="title">DemonLord</div>
      <div class="sub">Generais do Rei Demônio</div>
    </div>`);
}

function renderResource(c) {
  return cardShell(`
    <div class="card-resource ${c.subtype}" style="width:100%;height:100%">
      <div class="res-icon">${c.icon}</div>
      <div class="res-label">${c.label}</div>
      <div class="res-value">${c.value}</div>
      <div class="card-footer">63,5 × 88,9 mm</div>
    </div>`);
}

function renderMarket(c) {
  return cardShell(`
    <div class="card-market" style="width:100%;height:100%">
      <div class="card-header">
        <div class="card-type">${c.subtype}</div>
        <div class="card-name">${c.name}</div>
      </div>
      <div class="card-body">
        <div class="card-cost">Custo: ${c.cost}</div>
        <div>${c.effect}</div>
      </div>
      <div class="card-footer-id">${c.id}</div>
    </div>`);
}

function renderMission(c) {
  return cardShell(`
    <div class="card-mission" style="width:100%;height:100%">
      <div class="card-header">
        <div class="card-type">Missão ${c.mission} · Fase ${c.phase} <span class="mission-stars">${c.stars}</span></div>
        <div class="card-name">${c.title}</div>
      </div>
      <div class="card-body">
        <strong>${c.name}</strong>
        <div class="mission-req">${c.req}</div>
        <p style="margin:2mm 0 0;font-size:3.2mm;color:#9a9488">Falha total: ${c.fail}</p>
      </div>
      <div class="card-footer-id">${c.id}</div>
    </div>`);
}

function renderHero(c) {
  const title = c.title ? `, ${c.title}` : '';
  return cardShell(`
    <div class="card-hero" style="width:100%;height:100%">
      <div class="card-header">
        <div class="card-type">Herói humano · Defensor</div>
        <div class="card-name">${c.name}${title}</div>
      </div>
      <div class="card-body">${c.effect}</div>
      <div class="card-footer-id">${c.id}</div>
    </div>`);
}

function renderEvent(c) {
  return cardShell(`
    <div class="card-event" style="width:100%;height:100%">
      <div class="card-header">
        <div class="card-type">Decreto real</div>
        <div class="card-name">${c.name}</div>
      </div>
      <div class="card-body">${c.effect}</div>
      <div class="card-footer-id">${c.id}</div>
    </div>`);
}

function renderMandate(c) {
  const catClass = 'cat-' + c.cat.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const rule = c.rule ? `<p style="margin-top:2mm;padding-top:2mm;border-top:0.2mm solid rgba(255,255,255,0.1)"><strong>Restrição:</strong> ${c.rule}</p>` : '';
  return cardShell(`
    <div class="card-mandate ${catClass}" style="width:100%;height:100%">
      <div class="secret-banner">Secreto</div>
      <div class="card-header">
        <div class="card-type">Mandato · ${c.cat}</div>
        <div class="card-name">${c.name}</div>
      </div>
      <div class="card-body">
        <strong>Vitória:</strong> ${c.win}
        ${rule}
      </div>
      <div class="card-footer-id">${c.id}</div>
    </div>`);
}

function renderCard(c) {
  switch (c.kind) {
    case 'resource': return renderResource(c);
    case 'market': return renderMarket(c);
    case 'mission': return renderMission(c);
    case 'hero': return renderHero(c);
    case 'event': return renderEvent(c);
    case 'mandate': return renderMandate(c);
    default: return '';
  }
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildSheets(container, cards, sectionTitle) {
  const pages = chunk(cards, 9);
  pages.forEach((page, pi) => {
    const sheet = el('div', 'print-sheet print-only');
    sheet.innerHTML = `<div class="sheet-label">${sectionTitle} — folha ${pi + 1}/${pages.length}</div>`;
    page.forEach((card) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = renderCard(card);
      sheet.appendChild(wrap.firstElementChild);
    });
    // fill empty slots
    for (let i = page.length; i < 9; i++) {
      const empty = el('div', 'card-sheet');
      empty.innerHTML = '<div class="card-face" style="width:63.5mm;height:88.9mm;background:#f5f5f5"></div>';
      sheet.appendChild(empty);
    }
    container.appendChild(sheet);
  });
}

function buildBackSheets(container, count, sectionTitle) {
  const backs = Array.from({ length: count }, (_, i) => i);
  const pages = chunk(backs, 9);
  pages.forEach((page, pi) => {
    const sheet = el('div', 'print-sheet print-only');
    sheet.innerHTML = `<div class="sheet-label">${sectionTitle} — verso — folha ${pi + 1}/${pages.length}</div>`;
    page.forEach(() => {
      const wrap = document.createElement('div');
      wrap.innerHTML = backShell();
      sheet.appendChild(wrap.firstElementChild);
    });
    for (let i = page.length; i < 9; i++) {
      const empty = el('div', 'card-sheet');
      empty.innerHTML = '<div style="width:63.5mm;height:88.9mm"></div>';
      sheet.appendChild(empty);
    }
    container.appendChild(sheet);
  });
}

function buildTokenSheet(container) {
  const sheet = el('div', 'token-sheet print-only');
  sheet.innerHTML = '<h3>Fichas de Influência — recorte circular (32 mm) · imprima 5 cópias desta folha = 25 fichas</h3>';
  const grid = el('div', 'token-grid');
  for (let i = 0; i < 25; i++) {
    grid.appendChild(el('div', 'token influence', 'Inf'));
  }
  sheet.appendChild(grid);
  container.appendChild(sheet);
}

function renderAllCards(targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;

  let total = 0;
  DECK_SECTIONS.forEach((section) => {
    const block = el('div', 'section-block screen-only');
    block.innerHTML = `<h2>${section.title}</h2><p>${section.subtitle} · ${section.cards.length} cartas · ${Math.ceil(section.cards.length / 9)} folha(s)</p>
      <button type="button" onclick="window.print()">Imprimir tudo (use Ctrl+P)</button>`;
    container.appendChild(block);
    buildSheets(container, section.cards, section.title);
    total += section.cards.length;
  });

  const backBlock = el('div', 'section-block screen-only');
  backBlock.innerHTML = `<h2>Verso das cartas</h2><p>${total} versos · arte unificada DemonLord</p>`;
  container.appendChild(backBlock);
  buildBackSheets(container, total, 'Verso');

  const tokBlock = el('div', 'section-block screen-only');
  tokBlock.innerHTML = '<h2>Fichas de Influência</h2><p>25 fichas por folha · corte circular</p>';
  container.appendChild(tokBlock);
  buildTokenSheet(container);
}

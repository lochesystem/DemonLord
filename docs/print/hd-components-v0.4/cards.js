const grid = document.querySelector("#card-grid");

function wrapCard(card, data) {
  const figure = document.createElement("figure");
  figure.className = "card-preview";
  figure.append(card);
  const caption = document.createElement("figcaption");
  caption.innerHTML = `<strong>${data.id} · ${data.name}</strong><span>${data.kind === "race" ? "Raça · " + data.trait : data.type}</span>`;
  figure.append(caption);
  return figure;
}

function setArt(card, data) {
  const art = card.querySelector(".art-layer");
  art.style.backgroundImage = `url("${data.art}")`;
  art.classList.add(data.artClass);
}

function renderRace(data) {
  const card = document.querySelector("#race-template").content.firstElementChild.cloneNode(true);
  card.dataset.cardId = data.id;
  setArt(card, data);
  card.querySelector(".cost strong").textContent = data.cost;
  card.querySelector(".name-plaque").textContent = data.name;
  card.querySelector('[data-stat="pv"]').textContent = data.pv;
  card.querySelector('[data-stat="atk"]').textContent = data.atk;
  card.querySelector('[data-stat="int"]').textContent = data.int;
  const sex = card.querySelector(".sex-symbol");
  sex.textContent = data.sex;
  sex.setAttribute("aria-label", data.sexLabel);
  card.querySelector(".effect-box").innerHTML = data.effect;
  card.querySelector(".trait-bar").textContent = data.trait;
  card.querySelector(".card-id").textContent = data.id;
  return wrapCard(card, data);
}

function renderItem(data) {
  const card = document.querySelector("#item-template").content.firstElementChild.cloneNode(true);
  card.dataset.cardId = data.id;
  setArt(card, data);
  card.querySelector(".type-banner").textContent = data.type;
  card.querySelector(".item-name").textContent = data.name;
  card.querySelector(".item-effect").innerHTML = data.effect;
  card.querySelector(".card-id").textContent = data.id;
  return wrapCard(card, data);
}

function renderDecree(data) {
  const card = document.querySelector("#decree-template").content.firstElementChild.cloneNode(true);
  card.dataset.cardId = data.id;
  setArt(card, data);
  card.querySelector(".type-banner").textContent = data.type;
  card.querySelector(".decree-name").textContent = data.name;
  card.querySelector(".budget strong").textContent = data.budget;
  card.querySelector(".requirements").innerHTML = data.requirements.map(item => `<div>${item}</div>`).join("");
  card.querySelector(".card-id").textContent = data.id;
  return wrapCard(card, data);
}

CARD_DATA.forEach(data => {
  const renderer = data.kind === "race" ? renderRace : data.kind === "item" ? renderItem : renderDecree;
  grid.append(renderer(data));
});

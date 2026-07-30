import {
  createCanvas,
  loadImage,
  GlobalFonts
} from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js";
import { readFile, writeFile } from "node:fs/promises";

GlobalFonts.registerFromPath(
  "/System/Library/Fonts/Supplemental/Arial Narrow Bold.ttf",
  "DemonNarrow"
);

const root = new URL("./", import.meta.url);
const cards = JSON.parse(await readFile(new URL("./cards-data.json", root), "utf8"));
const columns = 4;
const cardW = 420;
const cardH = 600;
const startX = 80;
const startY = 145;
const gapX = 55;
const gapY = 112;
const rows = Math.ceil(cards.length / columns);
const canvasW = startX * 2 + columns * cardW + (columns - 1) * gapX;
const canvasH = startY + rows * (cardH + gapY) + 50;
const canvas = createCanvas(canvasW, canvasH);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#17130f";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#f2d57c";
ctx.font = "54px DemonNarrow";
ctx.fillText("DEMONLORD · FRENTES RASTER v0.6", 80, 80);

for (let index = 0; index < cards.length; index += 1) {
  const card = cards[index];
  const slug = card.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const image = await loadImage(new URL(`./exports/${card.id.toLowerCase()}-${slug}.png`, root));
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = startX + column * (cardW + gapX);
  const y = startY + row * (cardH + gapY);
  ctx.drawImage(image, x, y, cardW, cardH);
  ctx.fillStyle = "#f4e4bd";
  ctx.font = "28px DemonNarrow";
  ctx.textAlign = "center";
  ctx.fillText(`${card.id} · ${card.name}`, x + cardW / 2, y + cardH + 58);
}

await writeFile(
  new URL("./exports/conjunto-frentes-v0.5.png", root),
  canvas.toBuffer("image/png")
);

const raceCards = cards.filter(card => card.kind === "race");
const raceRows = Math.ceil(raceCards.length / columns);
const raceCanvas = createCanvas(
  canvasW,
  startY + raceRows * (cardH + gapY) + 50
);
const raceCtx = raceCanvas.getContext("2d");
raceCtx.fillStyle = "#17130f";
raceCtx.fillRect(0, 0, raceCanvas.width, raceCanvas.height);
raceCtx.fillStyle = "#f2d57c";
raceCtx.font = "54px DemonNarrow";
raceCtx.fillText("DEMONLORD · 19 RAÇAS EM ALTA FIDELIDADE · v0.9", 80, 80);

for (let index = 0; index < raceCards.length; index += 1) {
  const card = raceCards[index];
  const slug = card.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const image = await loadImage(
    new URL(`./exports/${card.id.toLowerCase()}-${slug}.png`, root)
  );
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = startX + column * (cardW + gapX);
  const y = startY + row * (cardH + gapY);
  raceCtx.drawImage(image, x, y, cardW, cardH);
  raceCtx.fillStyle = "#f4e4bd";
  raceCtx.font = "28px DemonNarrow";
  raceCtx.textAlign = "center";
  raceCtx.fillText(`${card.id} · ${card.name}`, x + cardW / 2, y + cardH + 48);
}

await writeFile(
  new URL("./exports/conjunto-racas-frentes-v0.9.png", root),
  raceCanvas.toBuffer("image/png")
);

const decreeCards = cards.filter(card => card.kind === "decree");
const decreeRows = Math.ceil(decreeCards.length / columns);
const decreeCanvas = createCanvas(
  canvasW,
  startY + decreeRows * (cardH + gapY) + 50
);
const decreeCtx = decreeCanvas.getContext("2d");
decreeCtx.fillStyle = "#17130f";
decreeCtx.fillRect(0, 0, decreeCanvas.width, decreeCanvas.height);
decreeCtx.fillStyle = "#f2d57c";
decreeCtx.font = "54px DemonNarrow";
decreeCtx.fillText("DEMONLORD · 8 DECRETOS EM ALTA FIDELIDADE · v0.9", 80, 80);

for (let index = 0; index < decreeCards.length; index += 1) {
  const card = decreeCards[index];
  const slug = card.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const image = await loadImage(
    new URL(`./exports/${card.id.toLowerCase()}-${slug}.png`, root)
  );
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x = startX + column * (cardW + gapX);
  const y = startY + row * (cardH + gapY);
  decreeCtx.drawImage(image, x, y, cardW, cardH);
  decreeCtx.fillStyle = "#f4e4bd";
  decreeCtx.font = "28px DemonNarrow";
  decreeCtx.textAlign = "center";
  decreeCtx.fillText(`${card.id} · ${card.name}`, x + cardW / 2, y + cardH + 48);
}

await writeFile(
  new URL("./exports/conjunto-decretos-frentes-v0.9.png", root),
  decreeCanvas.toBuffer("image/png")
);

const backs = {
  race: {
    label: "VERSO · RAÇAS",
    file: "./exports/backs/verso-race.png"
  },
  item: {
    label: "VERSO · TÁTICAS",
    file: "./exports/backs/verso-tactic.png"
  },
  decree: {
    label: "VERSO · DECRETOS",
    file: "./exports/backs/verso-decree.png"
  }
};

const pairColumns = 2;
const pairCardW = 350;
const pairCardH = 500;
const pairStartX = 70;
const pairStartY = 140;
const pairInnerGap = 40;
const pairGapX = 90;
const pairGapY = 105;
const pairRows = Math.ceil(cards.length / pairColumns);
const pairWidth = pairCardW * 2 + pairInnerGap;
const completeWidth = pairStartX * 2 + pairColumns * pairWidth
  + (pairColumns - 1) * pairGapX;
const completeHeight = pairStartY + pairRows * (pairCardH + pairGapY) + 50;
const completeCanvas = createCanvas(completeWidth, completeHeight);
const completeCtx = completeCanvas.getContext("2d");
completeCtx.fillStyle = "#17130f";
completeCtx.fillRect(0, 0, completeCanvas.width, completeCanvas.height);
completeCtx.fillStyle = "#f2d57c";
completeCtx.font = "54px DemonNarrow";
completeCtx.textAlign = "center";
completeCtx.fillText(
  "DEMONLORD · FRENTES E VERSOS RASTER v0.6",
  completeCanvas.width / 2,
  78
);

for (let index = 0; index < cards.length; index += 1) {
  const card = cards[index];
  const slug = card.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const front = await loadImage(
    new URL(`./exports/${card.id.toLowerCase()}-${slug}.png`, root)
  );
  const backData = backs[card.kind];
  const back = await loadImage(new URL(backData.file, root));

  const pairColumn = index % pairColumns;
  const row = Math.floor(index / pairColumns);
  const frontX = pairStartX + pairColumn * (pairWidth + pairGapX);
  const backX = frontX + pairCardW + pairInnerGap;
  const y = pairStartY + row * (pairCardH + pairGapY);

  completeCtx.drawImage(front, frontX, y, pairCardW, pairCardH);
  completeCtx.drawImage(back, backX, y, pairCardW, pairCardH);

  completeCtx.fillStyle = "#f4e4bd";
  completeCtx.font = "24px DemonNarrow";
  completeCtx.textAlign = "center";
  completeCtx.fillText(
    `${card.id} · ${card.name}`,
    frontX + pairCardW / 2,
    y + pairCardH + 55
  );
  completeCtx.fillText(
    backData.label,
    backX + pairCardW / 2,
    y + pairCardH + 55
  );
}

await writeFile(
  new URL("./exports/conjunto-completo-frentes-e-versos-v0.5.png", root),
  completeCanvas.toBuffer("image/png")
);

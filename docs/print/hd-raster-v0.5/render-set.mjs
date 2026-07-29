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
const canvas = createCanvas(2200, 2250);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#17130f";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "#f2d57c";
ctx.font = "54px DemonNarrow";
ctx.fillText("DEMONLORD · FRENTES RASTER v0.5", 80, 80);

const cardW = 525;
const cardH = 750;
const startX = 155;
const startY = 150;
const gapX = 185;
const gapY = 280;

for (let index = 0; index < cards.length; index += 1) {
  const card = cards[index];
  const slug = card.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const image = await loadImage(new URL(`./exports/${card.id.toLowerCase()}-${slug}.png`, root));
  const column = index % 3;
  const row = Math.floor(index / 3);
  const x = startX + column * (cardW + gapX);
  const y = startY + row * (cardH + gapY);
  ctx.drawImage(image, x, y, cardW, cardH);
  ctx.fillStyle = "#f4e4bd";
  ctx.font = "34px DemonNarrow";
  ctx.textAlign = "center";
  ctx.fillText(`${card.id} · ${card.name}`, x + cardW / 2, y + cardH + 58);
}

await writeFile(
  new URL("./exports/conjunto-frentes-v0.5.png", root),
  canvas.toBuffer("image/png")
);

const backs = {
  race: {
    label: "VERSO · RAÇAS",
    file: "../hd-v0.3/verso-raca.png"
  },
  item: {
    label: "VERSO · TÁTICAS",
    file: "../hd-v0.3/verso-tatica.png"
  },
  decree: {
    label: "VERSO · DECRETOS",
    file: "../hd-v0.3/verso-decreto.png"
  }
};

const completeCanvas = createCanvas(2870, 3200);
const completeCtx = completeCanvas.getContext("2d");
completeCtx.fillStyle = "#17130f";
completeCtx.fillRect(0, 0, completeCanvas.width, completeCanvas.height);
completeCtx.fillStyle = "#f2d57c";
completeCtx.font = "54px DemonNarrow";
completeCtx.textAlign = "center";
completeCtx.fillText(
  "DEMONLORD · FRENTES E VERSOS RASTER v0.5",
  completeCanvas.width / 2,
  78
);

const pairCardW = 525;
const pairCardH = 750;
const pairStartX = 85;
const pairStartY = 145;
const pairGapX = 85;
const pairGapY = 285;

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

  const pairColumn = index % 2;
  const row = Math.floor(index / 2);
  const frontX = pairStartX + pairColumn * (pairCardW * 2 + pairGapX * 3);
  const backX = frontX + pairCardW + pairGapX;
  const y = pairStartY + row * (pairCardH + pairGapY);

  completeCtx.drawImage(front, frontX, y, pairCardW, pairCardH);
  completeCtx.drawImage(back, backX, y, pairCardW, pairCardH);

  completeCtx.fillStyle = "#f4e4bd";
  completeCtx.font = "32px DemonNarrow";
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

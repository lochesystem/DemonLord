import {
  createCanvas,
  loadImage,
  GlobalFonts
} from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js";
import { readFile, writeFile } from "node:fs/promises";

const W = 1050;
const H = 1500;
const root = new URL("./", import.meta.url);

GlobalFonts.registerFromPath(
  "/System/Library/Fonts/Supplemental/Arial Narrow Bold.ttf",
  "DemonNarrow"
);
GlobalFonts.registerFromPath(
  "/System/Library/Fonts/Apple Symbols.ttf",
  "DemonSymbols"
);

const cards = JSON.parse(await readFile(new URL("./cards-data.json", root), "utf8"));

const componentFiles = {
  parchment: "components/pergaminho-base.png",
  frame: "components/normalized/borda-raca.png",
  cost: "components/normalized/medalhao-custo.png",
  stat: "components/normalized/capsula-atributo.png",
  name: "components/normalized/placa-nome.png",
  effect: "components/normalized/caixa-efeito.png",
  trait: "components/normalized/faixa-traco.png",
  id: "components/normalized/tag-id.png",
  itemBanner: "components/normalized/banner-item.png",
  decreeBanner: "components/normalized/banner-decreto.png",
  requirement: "components/normalized/bloco-requisito.png"
};

const components = Object.fromEntries(
  await Promise.all(
    Object.entries(componentFiles).map(async ([key, filename]) => [
      key,
      await loadImage(new URL(filename, root))
    ])
  )
);

function createSurface() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

function drawCover(ctx, image, x, y, width, height, focusX = 0.5, focusY = 0.5) {
  const scale = Math.max(width / image.width, height / image.height);
  const sourceW = width / scale;
  const sourceH = height / scale;
  const sourceX = Math.max(0, Math.min(image.width - sourceW, (image.width - sourceW) * focusX));
  const sourceY = Math.max(0, Math.min(image.height - sourceH, (image.height - sourceH) * focusY));
  ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, x, y, width, height);
}

function fitFont(ctx, text, maxWidth, startSize, minSize = 20, family = "DemonNarrow") {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minSize;
}

function drawCentered(
  ctx,
  text,
  centerX,
  centerY,
  maxWidth,
  startSize,
  fill = "#100d0b",
  stroke = null,
  family = "DemonNarrow"
) {
  const size = fitFont(ctx, text, maxWidth, startSize, 18, family);
  ctx.font = `${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  if (stroke) {
    ctx.lineWidth = Math.max(2, size * 0.07);
    ctx.strokeStyle = stroke;
    ctx.strokeText(text, centerX, centerY);
  }
  ctx.fillStyle = fill;
  ctx.fillText(text, centerX, centerY);
}

function measureLine(ctx, line, size) {
  const parts = line.split("◆");
  ctx.font = `${size}px DemonNarrow`;
  const textWidth = parts.reduce((sum, part) => sum + ctx.measureText(part).width, 0);
  ctx.font = `${size}px DemonSymbols`;
  const diamondWidth = ctx.measureText("◆").width;
  return textWidth + Math.max(0, parts.length - 1) * diamondWidth;
}

function wrapText(ctx, text, maxWidth, startSize, maxLines, minSize = 20) {
  let size = startSize;
  while (size >= minSize) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (measureLine(ctx, candidate, size) <= maxWidth || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    if (lines.length <= maxLines) return { size, lines };
    size -= 2;
  }
  return { size: minSize, lines: [text] };
}

function drawRichLine(ctx, line, centerX, centerY, size, fill = "#17100b") {
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const parts = line.split("◆");
  const widths = parts.map(part => {
    ctx.font = `${size}px DemonNarrow`;
    return ctx.measureText(part).width;
  });
  ctx.font = `${size}px DemonSymbols`;
  const diamondWidth = ctx.measureText("◆").width;
  const totalWidth = widths.reduce((sum, width) => sum + width, 0)
    + Math.max(0, parts.length - 1) * diamondWidth;
  let cursor = centerX - totalWidth / 2;

  parts.forEach((part, index) => {
    ctx.font = `${size}px DemonNarrow`;
    ctx.fillStyle = fill;
    ctx.fillText(part, cursor, centerY);
    cursor += widths[index];
    if (index < parts.length - 1) {
      ctx.font = `${size}px DemonSymbols`;
      ctx.lineWidth = Math.max(2, size * 0.055);
      ctx.strokeStyle = "#513300";
      ctx.strokeText("◆", cursor, centerY);
      ctx.fillStyle = "#efc84a";
      ctx.fillText("◆", cursor, centerY);
      cursor += diamondWidth;
    }
  });
}

function drawMultiline(ctx, text, x, y, width, height, startSize, maxLines, minSize = 20) {
  const { size, lines } = wrapText(ctx, text, width, startSize, maxLines, minSize);
  const lineHeight = size * 1.04;
  const totalHeight = lines.length * lineHeight;
  lines.forEach((line, index) => {
    drawRichLine(
      ctx,
      line,
      x + width / 2,
      y + (height - totalHeight) / 2 + lineHeight * (index + 0.5),
      size
    );
  });
}

function drawBase(ctx, art, focusY, artHeight = 1260) {
  drawCover(ctx, components.parchment, 0, 0, W, H);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(87, 95, 876, artHeight, 28);
  ctx.clip();
  drawCover(ctx, art, 87, 95, 876, artHeight, 0.5, focusY);
  ctx.restore();
  ctx.drawImage(components.frame, 0, 0, W, H);
}

function drawUniversalId(ctx, id) {
  ctx.drawImage(components.id, 425, 1442, 200, 51);
  drawCentered(ctx, id, 525, 1468, 125, 30, "#f5e4b8");
}

function renderRace(ctx, card, art) {
  drawBase(ctx, art, card.artFocusY);
  ctx.drawImage(components.cost, 45, 43, 255, 255);
  ctx.drawImage(components.name, 408, 58, 585, 160);

  const stats = [
    ["PV", card.pv, 405],
    ["ATK", card.atk, 660],
    ["INT", card.int, 915]
  ];
  for (const [label, value, y] of stats) {
    ctx.drawImage(components.stat, 49, y, 198, 255);
    drawCentered(ctx, label, 148, y + 58, 126, 39, "#fff1cf", "#4b160f");
    drawCentered(ctx, String(value), 148, y + 163, 108, 98, "#130f0c");
  }

  ctx.drawImage(components.effect, 275, 1118, 710, 200);
  ctx.drawImage(components.trait, 165, 1333, 720, 112);

  drawCentered(ctx, String(card.cost), 173, 171, 150, 146, "#100c08");
  drawCentered(ctx, card.name, 701, 140, 500, 73, "#100d0b");
  drawMultiline(ctx, card.effect, 315, 1134, 630, 168, 40, 5, 24);
  drawCentered(ctx, card.sex, 148, 1265, 70, 54, "#f5e4b8", "#17100b", "DemonSymbols");
  drawCentered(ctx, card.trait, 525, 1389, 440, 62, "#100d0b");
  drawUniversalId(ctx, card.id);
}

function renderItem(ctx, card, art) {
  drawBase(ctx, art, card.artFocusY);
  ctx.drawImage(components.itemBanner, 270, 35, 510, 92);
  ctx.drawImage(components.name, 155, 112, 740, 190);
  ctx.drawImage(components.effect, 95, 1114, 860, 250);

  drawCentered(ctx, card.type, 525, 81, 390, 34, "#f5e4b8", "#10292b");
  drawMultiline(ctx, card.name, 215, 145, 620, 120, 66, 2, 42);
  drawMultiline(ctx, card.effect, 150, 1150, 750, 178, 43, 4, 28);
  drawUniversalId(ctx, card.id);
}

function renderDecree(ctx, card, art) {
  drawBase(ctx, art, card.artFocusY, 1110);
  ctx.drawImage(components.decreeBanner, 270, 35, 510, 92);
  ctx.drawImage(components.name, 130, 112, 790, 185);
  ctx.drawImage(components.cost, 400, 915, 250, 250);

  const requirementXs = [57, 380, 703];
  card.requirements.forEach((requirement, index) => {
    const x = requirementXs[index];
    ctx.drawImage(components.requirement, x, 1175, 290, 225);
    drawCentered(ctx, requirement.value, x + 145, 1245, 190, 68, "#681e17");
    drawCentered(ctx, requirement.label, x + 145, 1325, 220, 31, "#17100b");
  });

  drawCentered(ctx, card.type, 525, 81, 390, 34, "#f5e4b8", "#4e1511");
  drawMultiline(ctx, card.name, 190, 145, 670, 120, 66, 2, 42);
  drawCentered(ctx, "ORÇAMENTO", 525, 979, 150, 25, "#17100b");
  drawCentered(ctx, String(card.budget), 525, 1053, 150, 92, "#17100b");
  drawUniversalId(ctx, card.id);
}

async function renderCard(card, suffix = "") {
  const { canvas, ctx } = createSurface();
  const art = await loadImage(new URL(card.art, root));
  if (card.kind === "race") renderRace(ctx, card, art);
  if (card.kind === "item") renderItem(ctx, card, art);
  if (card.kind === "decree") renderDecree(ctx, card, art);

  const slug = card.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  await writeFile(
    new URL(`./exports/${card.id.toLowerCase()}-${slug}${suffix ? `-${suffix}` : ""}.png`, root),
    canvas.toBuffer("image/png")
  );
}

for (const card of cards) {
  await renderCard(card);
  for (const variant of card.variants ?? []) {
    await renderCard(
      {
        ...card,
        art: variant.art,
        artFocusY: variant.artFocusY ?? card.artFocusY
      },
      variant.suffix
    );
  }
}

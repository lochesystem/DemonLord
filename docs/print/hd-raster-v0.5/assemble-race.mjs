import {
  createCanvas,
  loadImage,
  GlobalFonts
} from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js";
import { writeFile } from "node:fs/promises";

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

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";

const files = {
  parchment: "components/pergaminho-base.png",
  frame: "components/normalized/borda-raca.png",
  cost: "components/normalized/medalhao-custo.png",
  stat: "components/normalized/capsula-atributo.png",
  name: "components/normalized/placa-nome.png",
  effect: "components/normalized/caixa-efeito.png",
  trait: "components/normalized/faixa-traco.png",
  id: "components/normalized/tag-id.png",
  art: "art/morcego-infernal-r03.png"
};

const assets = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, filename]) => [
      key,
      await loadImage(new URL(filename, root))
    ])
  )
);

function drawCover(image, x, y, width, height, focusX = 0.5, focusY = 0.5) {
  const scale = Math.max(width / image.width, height / image.height);
  const sourceW = width / scale;
  const sourceH = height / scale;
  const sourceX = Math.max(0, Math.min(image.width - sourceW, (image.width - sourceW) * focusX));
  const sourceY = Math.max(0, Math.min(image.height - sourceH, (image.height - sourceH) * focusY));
  ctx.drawImage(image, sourceX, sourceY, sourceW, sourceH, x, y, width, height);
}

function drawLayer(image, x, y, width, height) {
  ctx.drawImage(image, x, y, width, height);
}

function fitFont(text, maxWidth, startSize, minSize = 24) {
  let size = startSize;
  while (size > minSize) {
    ctx.font = `${size}px DemonNarrow`;
    if (ctx.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minSize;
}

function drawCentered(text, centerX, centerY, maxWidth, startSize, fill = "#100d0b", stroke = null, family = "DemonNarrow") {
  const size = fitFont(text, maxWidth, startSize);
  ctx.font = `${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  if (stroke) {
    ctx.lineWidth = Math.max(2, size * 0.06);
    ctx.strokeStyle = stroke;
    ctx.strokeText(text, centerX, centerY);
  }
  ctx.fillStyle = fill;
  ctx.fillText(text, centerX, centerY);
}

function wrapText(text, maxWidth, startSize, maxLines) {
  let size = startSize;
  while (size >= 20) {
    ctx.font = `${size}px DemonNarrow`;
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth || !line) {
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
  return { size: 20, lines: [text] };
}

function drawMultiline(text, x, y, width, height, startSize, maxLines) {
  const { size, lines } = wrapText(text, width, startSize, maxLines);
  const lineHeight = size * 1.05;
  const totalHeight = lines.length * lineHeight;
  ctx.font = `${size}px DemonNarrow`;
  ctx.fillStyle = "#17100b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((line, index) => {
    ctx.fillText(line, x + width / 2, y + (height - totalHeight) / 2 + lineHeight * (index + 0.5));
  });
}

// 1. Fundo e arte
drawCover(assets.parchment, 0, 0, W, H);
ctx.save();
ctx.beginPath();
ctx.roundRect(87, 95, 876, 1260, 28);
ctx.clip();
drawCover(assets.art, 87, 95, 876, 1260, 0.5, 1);
ctx.restore();

// 2. Moldura e placas ilustradas
drawLayer(assets.frame, 0, 0, W, H);
drawLayer(assets.cost, 45, 43, 255, 255);
drawLayer(assets.name, 408, 58, 585, 160);

const statSlots = [
  { label: "PV", value: "2", y: 405 },
  { label: "ATK", value: "2", y: 660 },
  { label: "INT", value: "3", y: 915 }
];
for (const stat of statSlots) {
  drawLayer(assets.stat, 49, stat.y, 198, 255);
  drawCentered(stat.label, 148, stat.y + 58, 126, 39, "#fff1cf", "#4b160f");
  // Correção óptica: a massa visual dos algarismos fica abaixo da baseline geométrica.
  drawCentered(stat.value, 148, stat.y + 163, 108, 98, "#130f0c");
}

drawLayer(assets.effect, 275, 1118, 710, 200);
drawLayer(assets.trait, 165, 1333, 720, 112);
drawLayer(assets.id, 425, 1442, 200, 51);

// 3. Conteúdo variável rasterizado
drawCentered("2", 173, 171, 150, 146, "#100c08");
drawCentered("MORCEGO INFERNAL", 701, 140, 500, 73, "#100d0b");
drawMultiline(
  "AO ENTRAR: OLHE A PRÓXIMA RAÇA; DEVOLVA AO TOPO OU AO FUNDO.",
  315,
  1134,
  630,
  168,
  40,
  4
);
drawCentered("♂", 148, 1265, 70, 54, "#f5e4b8", "#17100b", "DemonSymbols");
drawCentered("VOADOR", 525, 1389, 440, 62, "#100d0b");
drawCentered("R03", 525, 1468, 125, 30, "#f5e4b8");

await writeFile(new URL("./exports/r03-morcego-piloto.png", root), canvas.toBuffer("image/png"));

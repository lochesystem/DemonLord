import {
  createCanvas,
  loadImage,
  GlobalFonts
} from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js";
import { writeFile } from "node:fs/promises";

GlobalFonts.registerFromPath(
  "/System/Library/Fonts/Supplemental/Arial Narrow Bold.ttf",
  "DemonNarrow"
);

const root = new URL("./", import.meta.url);
const canvas = createCanvas(1800, 1200);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#17130f";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const items = [
  ["MOLDURA", "borda-raca.png", 55, 150, 380, 545],
  ["CUSTO", "medalhao-custo.png", 490, 165, 260, 260],
  ["ATRIBUTO ×3", "capsula-atributo.png", 800, 145, 240, 400],
  ["PLACA DE NOME", "placa-nome.png", 1090, 170, 625, 180],
  ["CAIXA DE EFEITO", "caixa-efeito.png", 1035, 455, 690, 230],
  ["FAIXA DE TRAÇO", "faixa-traco.png", 610, 765, 760, 170],
  ["TAG UNIVERSAL", "tag-id.png", 710, 1010, 380, 100]
];

ctx.font = "42px DemonNarrow";
ctx.fillStyle = "#f2d57c";
ctx.textAlign = "left";
ctx.fillText("DEMONLORD · BIBLIOTECA RASTER DE COMPONENTES", 55, 70);

for (const [label, file, x, y, width, height] of items) {
  const image = await loadImage(new URL(`components/normalized/${file}`, root));
  ctx.fillStyle = "#25201a";
  ctx.fillRect(x - 10, y - 10, width + 20, height + 20);
  ctx.drawImage(image, x, y, width, height);
  ctx.font = "30px DemonNarrow";
  ctx.fillStyle = "#eadbb5";
  ctx.textAlign = "center";
  ctx.fillText(label, x + width / 2, y + height + 42);
}

await writeFile(
  new URL("./exports/biblioteca-componentes.png", root),
  canvas.toBuffer("image/png")
);

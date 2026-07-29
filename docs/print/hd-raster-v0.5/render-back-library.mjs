import {
  createCanvas,
  loadImage,
  GlobalFonts
} from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js";
import { writeFile } from "node:fs/promises";

const root = new URL("./", import.meta.url);
const canvas = createCanvas(2200, 1700);
const ctx = canvas.getContext("2d");

GlobalFonts.registerFromPath(
  "/System/Library/Fonts/Supplemental/Arial Narrow Bold.ttf",
  "DemonNarrow"
);

ctx.fillStyle = "#17130f";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#f2d57c";
ctx.font = "54px DemonNarrow";
ctx.textAlign = "left";
ctx.fillText("DEMONLORD · COMPONENTES RASTER DOS VERSOS", 70, 80);

function panel(x, y, width, height, label) {
  ctx.fillStyle = "#25201a";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#554735";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = "#eadbb5";
  ctx.font = "30px DemonNarrow";
  ctx.textAlign = "center";
  ctx.fillText(label, x + width / 2, y + height + 38);
}

const frame = await loadImage(
  new URL("./components/backs/common/frame-universal.png", root)
);
const plaque = await loadImage(
  new URL("./components/backs/common/type-plaque-blank.png", root)
);

const types = [
  ["race", "ARTE · RAÇAS"],
  ["tactic", "ARTE · TÁTICAS"],
  ["decree", "ARTE · DECRETOS"]
];

for (let index = 0; index < types.length; index += 1) {
  const [id, label] = types[index];
  const x = 70 + index * 430;
  const y = 140;
  const artwork = await loadImage(
    new URL(`./components/backs/types/artwork-${id}.png`, root)
  );
  panel(x, y, 350, 500, label);
  ctx.drawImage(artwork, x, y, 350, 500);
}

panel(1360, 140, 350, 500, "MOLDURA UNIVERSAL");
ctx.drawImage(frame, 1360, 140, 350, 500);

panel(650, 850, 900, 278, "PLACA VAZIA + TEXTO DINÂMICO");
ctx.drawImage(plaque, 650, 850, 900, 278);

ctx.fillStyle = "#8f7d66";
ctx.font = "28px DemonNarrow";
ctx.textAlign = "center";
ctx.fillText(
  "Ordem: arte raster do tipo → placa vazia → rótulo → moldura universal",
  canvas.width / 2,
  1460
);

await writeFile(
  new URL("./exports/biblioteca-componentes-versos.png", root),
  canvas.toBuffer("image/png")
);

console.log("Biblioteca visual dos versos exportada.");

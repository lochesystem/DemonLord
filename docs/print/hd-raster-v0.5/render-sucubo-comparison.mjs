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
const previous = await loadImage(
  new URL("./exports/r09-sucubo-versao-anterior.png", root)
);
const current = await loadImage(new URL("./exports/r09-sucubo.png", root));

const canvas = createCanvas(1280, 920);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#17130f";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#f2d57c";
ctx.font = "42px DemonNarrow";
ctx.textAlign = "center";
ctx.fillText("SÚCUBO R09 · COMPARATIVO DE DIREÇÃO DE ARTE", 640, 55);

const cardW = 525;
const cardH = 750;
const y = 110;
ctx.drawImage(previous, 80, y, cardW, cardH);
ctx.drawImage(current, 675, y, cardW, cardH);

ctx.fillStyle = "#f4e4bd";
ctx.font = "34px DemonNarrow";
ctx.fillText("VERSÃO ANTERIOR", 342.5, 900);
ctx.fillText("VERSÃO OFICIAL MAIS CARTUNESCA", 937.5, 900);

await writeFile(
  new URL("./exports/comparativo-sucubo.png", root),
  canvas.toBuffer("image/png")
);

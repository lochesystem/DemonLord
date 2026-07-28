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
const current = await loadImage(new URL("./exports/r09-sucubo.png", root));
const alternative = await loadImage(
  new URL("./exports/r09-sucubo-alternativa-escrachada.png", root)
);

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
ctx.drawImage(current, 80, y, cardW, cardH);
ctx.drawImage(alternative, 675, y, cardW, cardH);

ctx.fillStyle = "#f4e4bd";
ctx.font = "34px DemonNarrow";
ctx.fillText("ATUAL", 342.5, 900);
ctx.fillText("ALTERNATIVA MAIS CARTUNESCA", 937.5, 900);

await writeFile(
  new URL("./exports/comparativo-sucubo.png", root),
  canvas.toBuffer("image/png")
);

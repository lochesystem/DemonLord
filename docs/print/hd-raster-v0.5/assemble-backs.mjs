import {
  createCanvas,
  loadImage
} from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const W = 1050;
const H = 1498;
const root = new URL("./", import.meta.url);
const commonDir = new URL("./components/backs/common/", root);
const typeDir = new URL("./components/backs/types/", root);
const exportDir = new URL("./exports/backs/", root);
const officialDir = new URL("../hd-v0.3/", root);

await mkdir(exportDir, { recursive: true });

const backs = JSON.parse(await readFile(new URL("./back-data.json", root), "utf8"));
const positions = {
  typePlaque: { x: 165, y: 1202, width: 720, height: 222 },
  labelVisualCenter: { x: 525, y: 1297 }
};
const labelVisualCenterWithinImage = {
  race: 37.5,
  tactic: 50,
  decree: 38
};

const common = {
  typePlaque: await loadImage(new URL("./type-plaque-blank.png", commonDir)),
  frame: await loadImage(new URL("./frame-universal.png", commonDir))
};

for (const back of backs) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const artwork = await loadImage(new URL(`./artwork-${back.id}.png`, typeDir));
  const label = await loadImage(
    new URL(`./components/backs/labels/label-${back.id}.png`, root)
  );
  ctx.drawImage(artwork, 0, 0, W, H);

  // Cobre o rótulo incorporado no verso-mestre antes de aplicar a placa vazia.
  // A textura vem do próprio componente para não introduzir um retângulo liso.
  ctx.drawImage(
    common.typePlaque,
    170,
    55,
    380,
    112,
    330,
    1248,
    390,
    126
  );
  ctx.drawImage(
    common.typePlaque,
    positions.typePlaque.x,
    positions.typePlaque.y,
    positions.typePlaque.width,
    positions.typePlaque.height
  );

  ctx.drawImage(
    label,
    Math.round(positions.labelVisualCenter.x - label.width / 2),
    Math.round(
      positions.labelVisualCenter.y - labelVisualCenterWithinImage[back.id]
    )
  );

  ctx.drawImage(common.frame, 0, 0, W, H);

  const buffer = canvas.toBuffer("image/png");
  await writeFile(new URL(`./verso-${back.id}.png`, exportDir), buffer);

  const officialName =
    back.id === "race"
      ? "verso-raca.png"
      : back.id === "tactic"
        ? "verso-tatica.png"
        : "verso-decreto.png";
  await writeFile(new URL(officialName, officialDir), buffer);
}

console.log("Versos raster componentizados exportados.");

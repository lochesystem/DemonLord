import sharp from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";
import { mkdir, readFile } from "node:fs/promises";

const root = new URL("./", import.meta.url);
const spec = JSON.parse(await readFile(new URL("./print-spec.json", root), "utf8"));
const cards = JSON.parse(
  await readFile(new URL("./print-manifest.json", root), "utf8")
);

const outputRoot = new URL("./print-master/", root);
const frontsDir = new URL("./png/fronts/", outputRoot);
const backsDir = new URL("./png/backs/", outputRoot);
const jpgFrontsDir = new URL("./jpg/fronts/", outputRoot);
const jpgBacksDir = new URL("./jpg/backs/", outputRoot);
const proofDir = new URL("./proofs/", outputRoot);

await Promise.all(
  [frontsDir, backsDir, jpgFrontsDir, jpgBacksDir, proofDir].map((directory) =>
    mkdir(directory, { recursive: true })
  )
);

const backSources = {
  race: new URL("./exports/backs/verso-race.png", root),
  tactic: new URL("./exports/backs/verso-tactic.png", root),
  decree: new URL("./exports/backs/verso-decree.png", root)
};

const frameInsetPx = Math.round(
  (spec.frameProtectionMm / 25.4) * spec.dpi
);
const maxContentWidth = spec.trimPx.width - frameInsetPx * 2;
const maxContentHeight = spec.trimPx.height - frameInsetPx * 2;

function fitInside(width, height, maxWidth, maxHeight) {
  const scale = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale)
  };
}

function guideSvg() {
  const { width, height } = spec.canvasPx;
  const trimLeft = spec.bleedPx;
  const trimTop = spec.bleedPx;
  const trimRight = trimLeft + spec.trimPx.width;
  const trimBottom = trimTop + spec.trimPx.height;
  const safeLeft = trimLeft + spec.safePx;
  const safeTop = trimTop + spec.safePx;
  const safeRight = trimRight - spec.safePx;
  const safeBottom = trimBottom - spec.safePx;

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${trimLeft}" y="${trimTop}"
        width="${spec.trimPx.width}" height="${spec.trimPx.height}"
        fill="none" stroke="#ff244f" stroke-width="6" stroke-dasharray="24 14" />
      <rect x="${safeLeft}" y="${safeTop}"
        width="${safeRight - safeLeft}" height="${safeBottom - safeTop}"
        fill="none" stroke="#00e7ff" stroke-width="5" stroke-dasharray="18 12" />
      <g font-family="Arial, sans-serif" font-weight="700" font-size="32">
        <rect x="92" y="88" width="318" height="54" rx="10" fill="#140f0dcc" />
        <text x="112" y="125" fill="#ff4261">CORTE 63,5 × 88,9 mm</text>
        <rect x="92" y="151" width="278" height="54" rx="10" fill="#140f0dcc" />
        <text x="112" y="188" fill="#27eaff">ÁREA SEGURA</text>
      </g>
    </svg>
  `);
}

async function normalize(source, output, pdfImageOutput, proofOutput) {
  const image = sharp(source.pathname, { failOn: "error" });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error(`Não foi possível medir ${source.pathname}`);
  }

  const fitted = fitInside(
    metadata.width,
    metadata.height,
    maxContentWidth,
    maxContentHeight
  );
  const left = Math.floor((spec.canvasPx.width - fitted.width) / 2);
  const right = spec.canvasPx.width - fitted.width - left;
  const top = Math.floor((spec.canvasPx.height - fitted.height) / 2);
  const bottom = spec.canvasPx.height - fitted.height - top;

  const buffer = await image
    .flatten({ background: "#090807" })
    .resize(fitted.width, fitted.height, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3
    })
    .extend({
      left,
      right,
      top,
      bottom,
      background: "#090807"
    })
    .withMetadata({ density: spec.dpi })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  await sharp(buffer).toFile(output.pathname);
  await sharp(buffer)
    .jpeg({
      quality: 96,
      chromaSubsampling: "4:4:4",
      mozjpeg: true
    })
    .withMetadata({ density: spec.dpi })
    .toFile(pdfImageOutput.pathname);
  await sharp(buffer)
    .composite([{ input: guideSvg(), blend: "over" }])
    .png({ compressionLevel: 9 })
    .toFile(proofOutput.pathname);
}

const normalizedBacks = new Map();

for (const card of cards) {
  const frontOutput = new URL(
    `./png/fronts/${card.id.toLowerCase()}-frente.png`,
    outputRoot
  );
  const frontProof = new URL(
    `./proofs/${card.id.toLowerCase()}-frente-guias.png`,
    outputRoot
  );
  const frontPdfImage = new URL(
    `./jpg/fronts/${card.id.toLowerCase()}-frente.jpg`,
    outputRoot
  );
  await normalize(
    new URL(card.front, root),
    frontOutput,
    frontPdfImage,
    frontProof
  );

  if (!normalizedBacks.has(card.kind)) {
    const backOutput = new URL(`./png/backs/verso-${card.kind}.png`, outputRoot);
    const backPdfImage = new URL(
      `./jpg/backs/verso-${card.kind}.jpg`,
      outputRoot
    );
    const backProof = new URL(
      `./proofs/verso-${card.kind}-guias.png`,
      outputRoot
    );
    await normalize(
      backSources[card.kind],
      backOutput,
      backPdfImage,
      backProof
    );
    normalizedBacks.set(card.kind, backOutput);
  }
}

console.log(
  `Mestres normalizados: ${cards.length} frentes e ${normalizedBacks.size} versos.`
);

import sharp from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("./", import.meta.url);
const labelDir = new URL("./components/backs/labels/", root);
await mkdir(labelDir, { recursive: true });

const backs = JSON.parse(await readFile(new URL("./back-data.json", root), "utf8"));
const sources = Object.fromEntries(
  backs.map((back) => [back.id, new URL(back.source, root)])
);

function alphaFromLuminance(red, green, blue) {
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  if (luminance <= 52) return 255;
  if (luminance >= 112) return 0;
  return Math.round(((112 - luminance) / 60) * 255);
}

function removeSmallComponents(buffer, width, height, minimumPixels = 45) {
  const visited = new Uint8Array(width * height);
  const neighbors = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1]
  ];

  for (let start = 0; start < width * height; start += 1) {
    if (visited[start] || buffer[start * 4 + 3] < 20) continue;
    const queue = [start];
    const component = [];
    visited[start] = 1;

    while (queue.length) {
      const pixel = queue.pop();
      component.push(pixel);
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      for (const [dx, dy] of neighbors) {
        const nextX = x + dx;
        const nextY = y + dy;
        if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
        const next = nextY * width + nextX;
        if (visited[next] || buffer[next * 4 + 3] < 20) continue;
        visited[next] = 1;
        queue.push(next);
      }
    }

    if (component.length < minimumPixels) {
      for (const pixel of component) buffer[pixel * 4 + 3] = 0;
    }
  }
}

async function extractInk(source, region) {
  const { data, info } = await sharp(source.pathname)
    .extract(region)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const output = Buffer.alloc(info.width * info.height * 4);

  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const inputOffset = pixel * 3;
    const outputOffset = pixel * 4;
    output[outputOffset] = 16;
    output[outputOffset + 1] = 13;
    output[outputOffset + 2] = 11;
    output[outputOffset + 3] = alphaFromLuminance(
      data[inputOffset],
      data[inputOffset + 1],
      data[inputOffset + 2]
    );
  }

  removeSmallComponents(output, info.width, info.height);

  return sharp(output, {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
    .png()
    .toBuffer();
}

async function saveWord(source, region, filename) {
  const ink = await extractInk(source, region);
  await writeFile(new URL(filename, labelDir), ink);
}

await saveWord(
  sources.race,
  { left: 374, top: 1267, width: 298, height: 90 },
  "./label-race.png"
);
await saveWord(
  sources.decree,
  { left: 342, top: 1270, width: 395, height: 76 },
  "./label-decree.png"
);

const glyphSources = {
  T: {
    source: sources.tactic,
    region: { left: 423, top: 1271, width: 54, height: 74 }
  },
  A: {
    source: sources.race,
    region: { left: 434, top: 1268, width: 66, height: 73 }
  },
  I: {
    source: sources.tactic,
    region: { left: 390, top: 1272, width: 25, height: 73 }
  },
  C: {
    source: sources.decree,
    region: { left: 445, top: 1270, width: 44, height: 74 }
  },
  S: {
    source: sources.race,
    region: { left: 626, top: 1267, width: 46, height: 75 }
  }
};

const glyphs = {};
for (const [letter, data] of Object.entries(glyphSources)) {
  glyphs[letter] = {
    input: await extractInk(data.source, data.region),
    width: data.region.width,
    height: data.region.height
  };
}

const spelling = ["T", "A", "T", "I", "C", "A", "S"];
const tracking = 4;
const tacticWidth =
  spelling.reduce((total, letter) => total + glyphs[letter].width, 0) +
  tracking * (spelling.length - 1);
const tacticHeight = 90;
const baseline = 87;
const composites = [];
let cursor = 0;

for (let index = 0; index < spelling.length; index += 1) {
  const letter = spelling[index];
  const glyph = glyphs[letter];
  composites.push({
    input: glyph.input,
    left: cursor,
    top: baseline - glyph.height
  });

  if (index === 1) {
    const accentX = cursor + Math.round(glyph.width * 0.56);
    composites.push({
      input: Buffer.from(`
        <svg width="24" height="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 14 L13 1 L22 1 L11 14 Z" fill="#100d0b"/>
        </svg>
      `),
      left: accentX,
      top: 0
    });
  }

  cursor += glyph.width + tracking;
}

await sharp({
  create: {
    width: tacticWidth,
    height: tacticHeight,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }
})
  .composite(composites)
  .png()
  .toFile(new URL("./label-tactic.png", labelDir).pathname);

console.log("Rótulos raster dos versos exportados com a tipografia original.");

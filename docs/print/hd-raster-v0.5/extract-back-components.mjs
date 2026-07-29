import sharp from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";
import { mkdir, readFile } from "node:fs/promises";

const root = new URL("./", import.meta.url);
const commonDir = new URL("./components/backs/common/", root);
const typeDir = new URL("./components/backs/types/", root);

await mkdir(commonDir, { recursive: true });
await mkdir(typeDir, { recursive: true });

const backs = JSON.parse(await readFile(new URL("./back-data.json", root), "utf8"));
const raceSource = new URL(backs.find((back) => back.id === "race").source, root);
const { width, height } = await sharp(raceSource.pathname).metadata();

if (width !== 1050 || height !== 1498) {
  throw new Error(`Verso mestre deve medir 1050 × 1498 px; recebido ${width} × ${height}.`);
}

const regions = {
  brand: { left: 74, top: 78, width: 902, height: 438 },
  typePlaque: { left: 165, top: 1202, width: 720, height: 222 }
};

await sharp(raceSource.pathname)
  .png()
  .toFile(new URL("./base-master.png", commonDir).pathname);

await sharp(raceSource.pathname)
  .extract(regions.brand)
  .png()
  .toFile(new URL("./brand-demonlord.png", commonDir).pathname);

await sharp(raceSource.pathname)
  .extract(regions.typePlaque)
  .png()
  .toFile(new URL("./type-plaque-source.png", commonDir).pathname);

const frameInset = 82;
const frameMask = Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 0H${width}V${height}H0Z M${frameInset} ${frameInset}V${height - frameInset}H${width - frameInset}V${frameInset}Z"
      fill="#fff"
      fill-rule="evenodd"
    />
  </svg>
`);

await sharp(raceSource.pathname)
  .ensureAlpha()
  .composite([{ input: frameMask, blend: "dest-in" }])
  .png()
  .toFile(new URL("./frame-universal.png", commonDir).pathname);

for (const back of backs) {
  const source = new URL(back.source, root);
  await sharp(source.pathname)
    .png()
    .toFile(new URL(`./artwork-${back.id}.png`, typeDir).pathname);
}

console.log("Componentes-base dos versos extraídos.");

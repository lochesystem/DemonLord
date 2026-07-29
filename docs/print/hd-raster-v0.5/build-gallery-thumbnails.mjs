import sharp from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";
import { readFile } from "node:fs/promises";

const root = new URL("./", import.meta.url);
const cards = JSON.parse(await readFile(new URL("./cards-data.json", root), "utf8"));
const outputRoot = new URL("../../assets/cards-hd/", root);

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

for (const card of cards) {
  const slug = slugify(card.name);
  const input = new URL(`./exports/${card.id.toLowerCase()}-${slug}.png`, root);
  const output = new URL(`./${card.id.toLowerCase()}-${slug}.jpg`, outputRoot);
  await sharp(input.pathname)
    .resize(630, 900, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(output.pathname);
}

console.log(`${cards.length} miniaturas da galeria atualizadas.`);

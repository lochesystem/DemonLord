import sharp from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";
import { mkdir } from "node:fs/promises";
import { readdir } from "node:fs/promises";

const input = new URL("./components/alpha/", import.meta.url);
const output = new URL("./components/normalized/", import.meta.url);
await mkdir(output, { recursive: true });

for (const filename of await readdir(input)) {
  if (!filename.endsWith(".png")) continue;
  await sharp(new URL(filename, input).pathname)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(new URL(filename, output).pathname);
}

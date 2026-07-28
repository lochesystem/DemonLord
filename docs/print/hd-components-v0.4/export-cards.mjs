import { chromium } from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const output = new URL("./exports/", import.meta.url);
await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
});
const page = await browser.newPage({
  viewport: { width: 760, height: 1060 },
  deviceScaleFactor: 2
});

await page.goto(pathToFileURL(new URL("./index.html", import.meta.url).pathname).href);
await page.waitForFunction(() => document.fonts.status === "loaded");
await page.addStyleTag({
  content: `
    :root { --preview-scale: 1 !important; }
    body { background: transparent !important; }
    .page-head, figcaption { display: none !important; }
    .card-grid { display: block !important; margin: 0 !important; padding: 0 !important; }
    .card-preview { width: 700px !important; height: 1000px !important; display: none; }
    .card-preview.is-exporting { display: block !important; }
    .card-preview > .card { transform: none !important; }
  `
});

const ids = await page.locator(".card").evaluateAll(cards => cards.map(card => card.dataset.cardId));
for (const id of ids) {
  const figure = page.locator(`.card[data-card-id="${id}"]`).locator("..");
  await figure.evaluate(node => node.classList.add("is-exporting"));
  await page.locator(`.card[data-card-id="${id}"]`).screenshot({
    path: new URL(`./exports/${id.toLowerCase()}.png`, import.meta.url).pathname,
    omitBackground: true
  });
  await figure.evaluate(node => node.classList.remove("is-exporting"));
}

await browser.close();

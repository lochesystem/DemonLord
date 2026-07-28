import { chromium } from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { pathToFileURL } from "node:url";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
});
const page = await browser.newPage({
  viewport: { width: 1280, height: 1200 },
  deviceScaleFactor: 1
});

await page.goto(pathToFileURL(new URL("./index.html", import.meta.url).pathname).href);
await page.waitForFunction(() => document.fonts.status === "loaded");
await page.screenshot({
  path: new URL("./preview-componentes-v0.4.png", import.meta.url).pathname,
  fullPage: true
});

await browser.close();

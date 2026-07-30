import {
  createCanvas,
  loadImage,
  GlobalFonts,
} from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas/index.js";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const outputDir = path.join(root, "docs/assets/box/panels");

const W = 1772;
const H = 2362;

GlobalFonts.registerFromPath(
  "/System/Library/Fonts/Supplemental/Arial Narrow Bold.ttf",
  "DemonNarrow",
);
GlobalFonts.registerFromPath(
  "/System/Library/Fonts/Supplemental/Arial.ttf",
  "DemonBody",
);

const files = {
  background: path.join(
    root,
    "docs/assets/box/demonlord-box-back-illustration-v1.png",
  ),
  brandLogo: path.join(
    root,
    "docs/assets/branding/demonlord-logo-integrado-v2.png",
  ),
  parchment: path.join(
    root,
    "docs/print/hd-raster-v0.5/components/normalized/caixa-efeito.png",
  ),
  medallion: path.join(
    root,
    "docs/print/hd-raster-v0.5/components/normalized/medalhao-custo.png",
  ),
};

function drawCover(ctx, image, x, y, width, height, focusX = 0.5, focusY = 0.5) {
  const scale = Math.max(width / image.width, height / image.height);
  const sourceW = width / scale;
  const sourceH = height / scale;
  const sourceX = Math.max(
    0,
    Math.min(image.width - sourceW, (image.width - sourceW) * focusX),
  );
  const sourceY = Math.max(
    0,
    Math.min(image.height - sourceH, (image.height - sourceH) * focusY),
  );
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    x,
    y,
    width,
    height,
  );
}

function drawContain(ctx, image, x, y, width, height) {
  const scale = Math.min(width / image.width, height / image.height);
  const drawW = image.width * scale;
  const drawH = image.height * scale;
  ctx.drawImage(
    image,
    x + (width - drawW) / 2,
    y + (height - drawH) / 2,
    drawW,
    drawH,
  );
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (!line || ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrappedCentered(
  ctx,
  text,
  centerX,
  topY,
  maxWidth,
  lineHeight,
) {
  const lines = wrapLines(ctx, text, maxWidth);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  lines.forEach((line, index) => {
    ctx.fillText(line, centerX, topY + index * lineHeight);
  });
  return lines.length;
}

function drawShadowedText(
  ctx,
  text,
  x,
  y,
  {
    font,
    fill = "#f3d27a",
    stroke = "#130d0c",
    lineWidth = 12,
    align = "center",
  },
) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawMetric(ctx, medallion, x, value, label) {
  const size = 164;
  ctx.drawImage(medallion, x - size / 2, 2075, size, size);
  drawShadowedText(ctx, value, x, 2150, {
    font: "74px DemonNarrow",
    fill: "#17100c",
    stroke: "rgba(255,226,142,0.55)",
    lineWidth: 4,
  });
  drawShadowedText(ctx, label, x, 2265, {
    font: "34px DemonNarrow",
    fill: "#f2ddb0",
    stroke: "#120d0b",
    lineWidth: 9,
  });
}

function drawDarkOverlay(ctx, width, height, alpha = 0.58) {
  ctx.fillStyle = `rgba(6,5,7,${alpha})`;
  ctx.fillRect(0, 0, width, height);
  const glow = ctx.createRadialGradient(
    width / 2,
    height * 0.42,
    width * 0.03,
    width / 2,
    height * 0.42,
    width * 0.7,
  );
  glow.addColorStop(0, "rgba(119,49,28,0.22)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function drawPanelFrame(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "#a66a22";
  ctx.lineWidth = 16;
  ctx.strokeRect(26, 26, width - 52, height - 52);
  ctx.strokeStyle = "#3f223d";
  ctx.lineWidth = 9;
  ctx.strokeRect(48, 48, width - 96, height - 96);
  const diamond = (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#171117";
    ctx.strokeStyle = "#c08a38";
    ctx.lineWidth = 10;
    ctx.fillRect(-34, -34, 68, 68);
    ctx.strokeRect(-34, -34, 68, 68);
    ctx.fillStyle = "#a63b2b";
    ctx.fillRect(-15, -15, 30, 30);
    ctx.restore();
  };
  diamond(54, 54);
  diamond(width - 54, 54);
  diamond(54, height - 54);
  diamond(width - 54, height - 54);
  ctx.restore();
}

function makeCanvas(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

async function buildBackPanel(assets) {
  const { canvas, ctx } = makeCanvas(W, H);

  drawCover(ctx, assets.background, 0, 0, W, H, 0.5, 0.5);

  const topFade = ctx.createLinearGradient(0, 0, 0, 720);
  topFade.addColorStop(0, "rgba(6,5,7,0.88)");
  topFade.addColorStop(0.72, "rgba(6,5,7,0.42)");
  topFade.addColorStop(1, "rgba(6,5,7,0)");
  ctx.fillStyle = topFade;
  ctx.fillRect(0, 0, W, 760);

  drawContain(ctx, assets.brandLogo, 180, 58, 1412, 500);

  drawShadowedText(ctx, "O REI ABRIU O COFRE.", W / 2, 545, {
    font: "72px DemonNarrow",
    fill: "#f1d27c",
    stroke: "#120b09",
    lineWidth: 13,
  });
  drawShadowedText(ctx, "VOCÊ VAI DEVOLVER TROCO?", W / 2, 620, {
    font: "58px DemonNarrow",
    fill: "#f4e4bb",
    stroke: "#120b09",
    lineWidth: 12,
  });

  const parchmentX = 124;
  const parchmentY = 1510;
  const parchmentW = 1524;
  const parchmentH = 530;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.72)";
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 18;
  ctx.drawImage(
    assets.parchment,
    parchmentX,
    parchmentY,
    parchmentW,
    parchmentH,
  );
  ctx.restore();

  ctx.fillStyle = "#24130f";
  ctx.font = "49px DemonBody";
  const pitch =
    "Receba um Decreto secreto, recrute monstros no mercado e monte o exército exigido sem ultrapassar sua Verba. Manipule terrenos, renegocie contratos e sabote os rivais. Ao declarar vitória, sobreviva à última rodada de intrigas e prove que merece o ouro do Rei.";
  drawWrappedCentered(ctx, pitch, W / 2, 1608, 1260, 58);

  ctx.fillStyle = "#6c251c";
  ctx.font = "54px DemonNarrow";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RECRUTE  •  MANIPULE  •  DECLARE", W / 2, 1952);

  drawMetric(ctx, assets.medallion, 465, "3–5", "JOGADORES");
  drawMetric(ctx, assets.medallion, 886, "45–75", "MINUTOS");
  drawMetric(ctx, assets.medallion, 1307, "14+", "IDADE");

  await mkdir(outputDir, { recursive: true });
  const output = path.join(outputDir, "verso-caixa-v1.png");
  await writeFile(output, canvas.toBuffer("image/png"));
  return output;
}

async function buildPrimarySide(assets) {
  const width = 1205;
  const height = 2362;
  const { canvas, ctx } = makeCanvas(width, height);
  drawCover(ctx, assets.background, 0, 0, width, height, 0.74, 0.24);
  drawDarkOverlay(ctx, width, height, 0.7);
  drawPanelFrame(ctx, width, height);

  drawContain(ctx, assets.brandLogo, 90, 170, 1025, 650);

  drawShadowedText(ctx, "UM EXÉRCITO.", width / 2, 1010, {
    font: "82px DemonNarrow",
    fill: "#f1d27c",
    stroke: "#120b09",
    lineWidth: 14,
  });
  drawShadowedText(ctx, "UM DECRETO.", width / 2, 1110, {
    font: "82px DemonNarrow",
    fill: "#f1d27c",
    stroke: "#120b09",
    lineWidth: 14,
  });
  drawShadowedText(ctx, "NENHUMA HONRA.", width / 2, 1210, {
    font: "82px DemonNarrow",
    fill: "#f4e4bb",
    stroke: "#120b09",
    lineWidth: 14,
  });

  ctx.strokeStyle = "#b87a2f";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(210, 1380);
  ctx.lineTo(width - 210, 1380);
  ctx.stroke();

  drawShadowedText(ctx, "3–5 JOGADORES", width / 2, 1550, {
    font: "60px DemonNarrow",
    fill: "#ead8a8",
    stroke: "#120b09",
    lineWidth: 11,
  });
  drawShadowedText(ctx, "45–75 MINUTOS", width / 2, 1650, {
    font: "60px DemonNarrow",
    fill: "#ead8a8",
    stroke: "#120b09",
    lineWidth: 11,
  });
  drawShadowedText(ctx, "14+", width / 2, 1750, {
    font: "60px DemonNarrow",
    fill: "#ead8a8",
    stroke: "#120b09",
    lineWidth: 11,
  });
  drawShadowedText(
    ctx,
    "NEGOCIAÇÃO • BLEFE • SABOTAGEM",
    width / 2,
    2145,
    {
      font: "43px DemonNarrow",
      fill: "#d0a75b",
      stroke: "#120b09",
      lineWidth: 9,
    },
  );

  const output = path.join(outputDir, "lateral-principal-caixa-v1.png");
  await writeFile(output, canvas.toBuffer("image/png"));
  return output;
}

function drawStep(ctx, parchment, number, title, body, y) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 10;
  ctx.drawImage(parchment, 98, y, 1009, 430);
  ctx.restore();

  ctx.fillStyle = "#6c251c";
  ctx.font = "90px DemonNarrow";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(number, 245, y + 205);

  ctx.fillStyle = "#24130f";
  ctx.font = "60px DemonNarrow";
  ctx.textAlign = "left";
  ctx.fillText(title, 350, y + 145);
  ctx.font = "38px DemonBody";
  const lines = wrapLines(ctx, body, 675);
  ctx.textBaseline = "top";
  lines.slice(0, 3).forEach((line, index) => {
    ctx.fillText(line, 350, y + 205 + index * 48);
  });
}

async function buildSecondarySide(assets) {
  const width = 1205;
  const height = 2362;
  const { canvas, ctx } = makeCanvas(width, height);
  drawCover(ctx, assets.background, 0, 0, width, height, 0.2, 0.15);
  drawDarkOverlay(ctx, width, height, 0.76);
  drawPanelFrame(ctx, width, height);

  drawContain(ctx, assets.brandLogo, 170, 75, 865, 420);
  drawShadowedText(ctx, "A ORDEM DO REI É SIMPLES.", width / 2, 510, {
    font: "66px DemonNarrow",
    fill: "#f1d27c",
    stroke: "#120b09",
    lineWidth: 13,
  });

  drawStep(
    ctx,
    assets.parchment,
    "1",
    "RECRUTE",
    "Escolha monstros de um mercado compartilhado.",
    625,
  );
  drawStep(
    ctx,
    assets.parchment,
    "2",
    "MANIPULE",
    "Altere terrenos, atributos e contratos com Táticas.",
    1090,
  );
  drawStep(
    ctx,
    assets.parchment,
    "3",
    "DECLARE",
    "Resista à rodada final de intrigas e revele o Decreto.",
    1555,
  );

  drawShadowedText(ctx, "O TROCO É OPCIONAL. A VITÓRIA, NÃO.", width / 2, 2170, {
    font: "42px DemonNarrow",
    fill: "#e2c27a",
    stroke: "#120b09",
    lineWidth: 9,
  });

  const output = path.join(outputDir, "lateral-secundaria-caixa-v1.png");
  await writeFile(output, canvas.toBuffer("image/png"));
  return output;
}

async function buildTopPanel(assets) {
  const width = 1772;
  const height = 1205;
  const { canvas, ctx } = makeCanvas(width, height);
  drawCover(ctx, assets.background, 0, 0, width, height, 0.5, 0.03);
  drawDarkOverlay(ctx, width, height, 0.68);
  drawPanelFrame(ctx, width, height);
  drawContain(ctx, assets.brandLogo, 170, 100, 1432, 830);
  drawShadowedText(ctx, "CRÉDITO DE GUERRA", width / 2, 980, {
    font: "58px DemonNarrow",
    fill: "#d7aa55",
    stroke: "#120b09",
    lineWidth: 12,
  });
  const output = path.join(outputDir, "tampa-caixa-v1.png");
  await writeFile(output, canvas.toBuffer("image/png"));
  return output;
}

async function buildBottomPanel(assets) {
  const width = 1772;
  const height = 1205;
  const { canvas, ctx } = makeCanvas(width, height);
  drawCover(ctx, assets.background, 0, 0, width, height, 0.5, 0.92);
  drawDarkOverlay(ctx, width, height, 0.8);
  drawPanelFrame(ctx, width, height);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.75)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 12;
  ctx.drawImage(assets.parchment, 105, 105, 1562, 800);
  ctx.restore();

  ctx.fillStyle = "#5f211b";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "72px DemonNarrow";
  ctx.fillText("CONTEÚDO: 76 CARTAS", width / 2, 250);
  ctx.fillStyle = "#251510";
  ctx.font = "52px DemonNarrow";
  ctx.fillText("40 RAÇAS  •  28 TÁTICAS  •  8 DECRETOS", width / 2, 365);
  ctx.font = "41px DemonBody";
  ctx.fillText("DemonLord · microprotótipo v0.2.1 · 2026", width / 2, 500);
  ctx.font = "36px DemonBody";
  ctx.fillText("Créditos editoriais e dados de fabricação: a confirmar", width / 2, 590);

  ctx.fillStyle = "#8d2e25";
  ctx.font = "55px DemonNarrow";
  ctx.fillText("PROTÓTIPO EM DESENVOLVIMENTO", width / 2, 725);
  ctx.font = "48px DemonNarrow";
  ctx.fillText("NÃO DESTINADO À VENDA", width / 2, 800);

  drawShadowedText(
    ctx,
    "SEM EAN OU SELO DE CONFORMIDADE ATÉ A PRODUÇÃO FINAL",
    width / 2,
    1030,
    {
      font: "39px DemonNarrow",
      fill: "#e2c27a",
      stroke: "#120b09",
      lineWidth: 9,
    },
  );

  const output = path.join(outputDir, "base-caixa-v1.png");
  await writeFile(output, canvas.toBuffer("image/png"));
  return output;
}

await mkdir(outputDir, { recursive: true });
const assets = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, filename]) => [
      key,
      await loadImage(filename),
    ]),
  ),
);
const outputs = [
  await buildBackPanel(assets),
  await buildPrimarySide(assets),
  await buildSecondarySide(assets),
  await buildTopPanel(assets),
  await buildBottomPanel(assets),
];
outputs.forEach((output) => console.log(output));

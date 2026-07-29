import sharp from "/Users/aloche/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/lib/index.js";

const root = new URL("./", import.meta.url);
const source = new URL(
  "./components/backs/chroma/type-plaque-blank.png",
  root
);
const target = new URL(
  "./components/backs/common/type-plaque-blank.png",
  root
);

const { data, info } = await sharp(source.pathname)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let offset = 0; offset < data.length; offset += info.channels) {
  const red = data[offset];
  const green = data[offset + 1];
  const blue = data[offset + 2];

  const keyDistance = Math.sqrt(
    red * red
      + (255 - green) * (255 - green)
      + blue * blue
  );

  let alpha;
  if (keyDistance <= 34) {
    alpha = 0;
  } else if (keyDistance >= 155) {
    alpha = 255;
  } else {
    const normalized = (keyDistance - 34) / (155 - 34);
    alpha = Math.round(normalized * normalized * 255);
  }

  if (alpha < 255 && green > Math.max(red, blue)) {
    data[offset + 1] = Math.max(red, blue);
  }
  data[offset + 3] = alpha;
}

await sharp(data, {
  raw: {
    width: info.width,
    height: info.height,
    channels: info.channels
  }
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .resize(720, 222, { fit: "fill" })
  .png()
  .toFile(target.pathname);

console.log("Componente transparente da placa preparado.");

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const previewDirectory = path.resolve(
  "wordpress/wp-content/plugins/koops-core/assets/previews",
);
const manifest = JSON.parse(
  await fs.readFile(path.join(previewDirectory, "manifest.json"), "utf8"),
);

for (const [sectionType, bounds] of Object.entries(manifest)) {
  const source = path.join(previewDirectory, bounds.source);
  const metadata = await sharp(source).metadata();
  const left = Math.max(0, Math.floor(bounds.left));
  const top = Math.max(0, Math.floor(bounds.top));
  const width = Math.max(
    1,
    Math.min(Math.floor(bounds.width), (metadata.width ?? 1) - left),
  );
  const height = Math.max(
    1,
    Math.min(520, Math.floor(bounds.height), (metadata.height ?? 1) - top),
  );

  await sharp(source)
    .extract({ left, top, width, height })
    .jpeg({ quality: 78, progressive: true })
    .toFile(path.join(previewDirectory, `${sectionType}.jpg`));
}

for (const file of new Set(Object.values(manifest).map((item) => item.source))) {
  await fs.unlink(path.join(previewDirectory, file));
}

await fs.unlink(path.join(previewDirectory, "manifest.json"));
console.log(`Paruošta ${Object.keys(manifest).length} sekcijų peržiūra.`);

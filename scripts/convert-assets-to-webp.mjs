import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const assetsDir = path.resolve("src/assets");
const pngFiles = fs.readdirSync(assetsDir).filter((file) => file.toLowerCase().endsWith(".png"));

if (!pngFiles.length) {
  console.log("No PNG files found in src/assets");
  process.exit(0);
}

for (const file of pngFiles) {
  const input = path.join(assetsDir, file);
  const output = path.join(assetsDir, file.replace(/\.png$/i, ".webp"));
  const before = fs.statSync(input).size;

  await sharp(input)
    .webp({ quality: 88, effort: 5 })
    .toFile(output);

  const after = fs.statSync(output).size;
  const saved = (((before - after) / before) * 100).toFixed(1);
  console.log(`${file} -> ${path.basename(output)} (${(before / 1024 / 1024).toFixed(2)}MB -> ${(after / 1024 / 1024).toFixed(2)}MB, -${saved}%)`);

  fs.unlinkSync(input);
}

console.log(`Converted ${pngFiles.length} file(s).`);

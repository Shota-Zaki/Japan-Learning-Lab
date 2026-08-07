#!/usr/bin/env node
import { copyFile, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prototypeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = path.resolve(prototypeRoot, "..", "docs");
const assetsRoot = path.join(docsRoot, "assets");

await mkdir(docsRoot, { recursive: true });

async function optimizePagesAssets() {
  const entries = await readdir(assetsRoot, { withFileTypes: true }).catch(() => []);
  let removedFonts = 0;

  for (const entry of entries) {
    const assetPath = path.join(assetsRoot, entry.name);
    if (entry.isFile() && entry.name.endsWith(".woff2")) {
      await rm(assetPath, { force: true });
      removedFonts += 1;
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".css")) {
      const source = await readFile(assetPath, "utf8");
      const optimized = source
        .replace(/@font-face\{[^{}]*\}/g, "")
        .replaceAll("Noto Sans JP Variable,Yu Gothic,YuGothic,sans-serif", "Yu Gothic,YuGothic,Hiragino Kaku Gothic ProN,Meiryo,sans-serif")
        .replaceAll("font-family:Noto Sans JP Variable", "font-family:Yu Gothic,YuGothic,Hiragino Kaku Gothic ProN,Meiryo,sans-serif");
      await writeFile(assetPath, optimized, "utf8");
    }
  }

  return removedFonts;
}

const removedFonts = await optimizePagesAssets();
await copyFile(path.join(docsRoot, "index.html"), path.join(docsRoot, "404.html"));
await writeFile(path.join(docsRoot, ".nojekyll"), "", "utf8");
await writeFile(path.join(docsRoot, "build-info.json"), `${JSON.stringify({
  application: "Japan Learning Lab",
  entry: "docs/index.html",
  fallback: "docs/404.html",
  sourceRevision: process.env.GITHUB_SHA || "local",
  removedWebFonts: removedFonts,
}, null, 2)}\n`, "utf8");

console.log(`Prepared GitHub Pages output at ${docsRoot} (removed ${removedFonts} web fonts)`);

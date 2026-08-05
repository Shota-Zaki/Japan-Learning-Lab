#!/usr/bin/env node
import { copyFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prototypeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = path.resolve(prototypeRoot, "..", "docs");

await mkdir(docsRoot, { recursive: true });
await copyFile(path.join(docsRoot, "index.html"), path.join(docsRoot, "404.html"));
await writeFile(path.join(docsRoot, ".nojekyll"), "", "utf8");
await writeFile(path.join(docsRoot, "build-info.json"), `${JSON.stringify({
  application: "Japan Learning Lab",
  entry: "docs/index.html",
  fallback: "docs/404.html",
  generatedAt: new Date().toISOString(),
}, null, 2)}\n`, "utf8");

console.log(`Prepared GitHub Pages output at ${docsRoot}`);

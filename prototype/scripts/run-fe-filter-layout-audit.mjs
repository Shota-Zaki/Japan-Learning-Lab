import { readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const evidenceDirectory = resolve("qa/jll-fe-003-browser");
const auditPath = resolve(evidenceDirectory, "audit.json");
const failurePath = resolve(evidenceDirectory, "failure.json");

async function removeChromeProfileFromError(error) {
  const match = String(error).match(/rmdir '([^']+)'/);
  if (!match) return;
  const profileDirectory = match[1].replace(/[/\\]Default$/, "");
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
  await rm(profileDirectory, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 200,
  });
}

try {
  await import("./audit-fe-filter-layouts.mjs");
} catch (error) {
  await removeChromeProfileFromError(error).catch(() => {});

  if (existsSync(failurePath)) {
    const failure = JSON.parse(await readFile(failurePath, "utf8"));
    throw new Error(failure.error || String(error), { cause: error });
  }

  if (!existsSync(auditPath)) throw error;
  console.warn(`Browser audit completed, but Chrome profile cleanup required recovery: ${String(error)}`);
}

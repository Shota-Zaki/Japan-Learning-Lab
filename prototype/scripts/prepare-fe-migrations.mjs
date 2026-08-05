#!/usr/bin/env node
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "dist", ".openai", "drizzle");
mkdirSync(target, { recursive: true });
copyFileSync(
  path.join(root, "db", "migrations", "0001_fe_sessions.sql"),
  path.join(target, "0001_fe_sessions.sql"),
);
console.log("Prepared FE session migration");

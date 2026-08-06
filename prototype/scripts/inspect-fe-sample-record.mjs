#!/usr/bin/env node

const sourceRepository = "Shota-Zaki/Engineer-License-Lab";
const sourceCommit = "1402da68e2e74945bc8fa4add829458220917512";
const sourcePath = "docs/labs/fe/data/question-bank.json";
const sourceUrl = `https://raw.githubusercontent.com/${sourceRepository}/${sourceCommit}/${sourcePath}`;
const targetId = "fe-ipa-2022sample-a-005";

const response = await fetch(sourceUrl, { headers: { accept: "application/json" } });
if (!response.ok) throw new Error(`FE sample source download failed: ${response.status}`);
const sourceBank = await response.json();
const matches = [];

function collect(value, trail = []) {
  if (!value || typeof value !== "object") return;
  if (!Array.isArray(value) && value.id === targetId) matches.push({ trail, value });
  for (const [key, child] of Object.entries(value)) collect(child, [...trail, key]);
}

collect(sourceBank);
console.log(`Found ${matches.length} records for ${targetId}`);
for (const [index, match] of matches.entries()) {
  console.log(`RECORD ${index + 1} AT ${match.trail.join(".")}`);
  console.log(JSON.stringify(match.value, null, 2));
}

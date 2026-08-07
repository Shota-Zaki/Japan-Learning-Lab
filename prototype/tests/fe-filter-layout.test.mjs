import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolveFeFilterLayoutVariant } from "../src/feFilterLayout.js";

const cssPath = new URL("../src/fe-filter-variants.css", import.meta.url);
const mainPath = new URL("../src/main.jsx", import.meta.url);
const setupPath = new URL("../src/FePracticeSetup.jsx", import.meta.url);
const auditPath = new URL("../scripts/audit-fe-filter-layouts.mjs", import.meta.url);

test("filter layout query accepts only the three validation variants", () => {
  assert.equal(resolveFeFilterLayoutVariant(""), "2");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=1"), "1");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=2"), "2");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=3"), "3");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=4"), "2");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=2&filterLayout=3"), "2");
});

test("all filter layouts preserve the subject selector, DOM order, and variable-height cards", async () => {
  const [css, main, setup, audit] = await Promise.all([
    readFile(cssPath, "utf8"),
    readFile(mainPath, "utf8"),
    readFile(setupPath, "utf8"),
    readFile(auditPath, "utf8"),
  ]);

  for (const variant of ["1", "2", "3"]) {
    assert.match(css, new RegExp(`data-fe-filter-layout=\\"${variant}\\"`));
  }

  assert.match(css, /grid-template-columns:\s*repeat\(12,/);
  assert.match(css, /grid-template-columns:\s*repeat\(8,/);
  assert.match(css, /\.fe-filter-variant-grid\s*\{[\s\S]*position:\s*relative/);
  assert.match(css, /data-fe-filter-layout=\"2\"[\s\S]*:nth-child\(4\)\s*\{[\s\S]*margin-top:\s*var\(--fe-filter-layout-2-extra-space/);
  assert.match(css, /data-fe-filter-layout=\"2\"[\s\S]*:nth-child\(3\)\s*\{[\s\S]*position:\s*absolute;[\s\S]*grid-row:\s*1 \/ span 2;/);
  assert.match(css, /\.fe-filter-variant-grid > \* \{[\s\S]*position:\s*static !important;[\s\S]*grid-column:\s*1 \/ -1 !important;[\s\S]*grid-row:\s*auto !important;/);
  assert.doesNotMatch(css, /overflow-y\s*:/);
  assert.doesNotMatch(css, /text-overflow:\s*ellipsis/);
  assert.doesNotMatch(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /:nth-child\(4\) \.fe-check-grid-compact[\s\S]*minmax\(min\(100%, 240px\), 1fr\)/);

  assert.match(main, /document\.documentElement\.dataset\.feFilterLayout/);
  assert.match(main, /ResizeObserver/);
  assert.match(main, /--fe-filter-layout-2-extra-space/);
  assert.match(main, /cards\[0\][\s\S]*cards\[1\][\s\S]*cards\[2\]/);
  assert.ok(setup.indexOf("<SubjectSelector") < setup.indexOf("fe-filter-variant-grid"));
  assert.equal((setup.match(/fe-filter-variant-grid/g) || []).length, 1);

  const expectedGroupMarkers = [
    'key: "domains", title: "1. 分野"',
    'key: "reviewScopes", title: "2. 回答・復習状態"',
    'key: "periodIds", title: "3. 開催回・公開区分"',
    'key: "unitIds", title: "4. 単元"',
  ];
  let previousIndex = -1;
  for (const marker of expectedGroupMarkers) {
    const currentIndex = setup.indexOf(marker);
    assert.ok(currentIndex > previousIndex, `Filter group order is incorrect at ${marker}`);
    previousIndex = currentIndex;
  }

  assert.match(audit, /document\.fonts/);
  assert.match(audit, /stableSamples\s*>=\s*requiredSamples/);
  assert.match(audit, /sourceCount\s*>=\s*expectedMinimums\.sourceCount/);
  assert.match(audit, /optionCounts/);
  assert.match(audit, /layout2LeftGap/);
  assert.match(audit, /keyboardGroupOrder/);
  assert.match(audit, /validateMetrics\(postScreenshotMetrics/);
  assert.match(audit, /Final data changed between metrics and screenshot/);
  assert.match(audit, /maxRetries:\s*10/);
});
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolveFeFilterLayoutVariant } from "../src/feFilterLayout.js";

const cssPath = new URL("../src/fe-filter-variants.css", import.meta.url);
const mainPath = new URL("../src/main.jsx", import.meta.url);
const setupPath = new URL("../src/FePracticeSetup.jsx", import.meta.url);

test("filter layout query accepts only the three validation variants", () => {
  assert.equal(resolveFeFilterLayoutVariant(""), "1");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=1"), "1");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=2"), "2");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=3"), "3");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=4"), "1");
  assert.equal(resolveFeFilterLayoutVariant("?filterLayout=2&filterLayout=3"), "2");
});

test("all filter layouts use the same existing grid and preserve the independent subject selector", async () => {
  const [css, main, setup] = await Promise.all([
    readFile(cssPath, "utf8"),
    readFile(mainPath, "utf8"),
    readFile(setupPath, "utf8"),
  ]);

  for (const variant of ["1", "2", "3"]) {
    assert.match(css, new RegExp(`data-fe-filter-layout=\\"${variant}\\"`));
  }

  assert.match(css, /grid-template-columns:\s*repeat\(12,/);
  assert.match(css, /grid-template-columns:\s*repeat\(8,/);
  assert.match(css, /\.fe-filter-variant-grid > \* \{[\s\S]*grid-column:\s*1 \/ -1 !important;[\s\S]*grid-row:\s*auto !important;/);
  assert.doesNotMatch(css, /overflow-y\s*:/);
  assert.doesNotMatch(css, /text-overflow:\s*ellipsis/);

  assert.match(main, /document\.documentElement\.dataset\.feFilterLayout/);
  assert.ok(setup.indexOf("<SubjectSelector") < setup.indexOf("fe-filter-variant-grid"));
  assert.equal((setup.match(/fe-filter-variant-grid/g) || []).length, 1);
});

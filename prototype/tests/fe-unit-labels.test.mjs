import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  FE_UNIT_LABELS,
  getFeUnitLabel,
  getFeUnitLabelParts,
  resolveFeUnitLabelId,
} from "../src/feUnitLabels.js";

const dataPath = new URL("../public/data/fe-official-past-questions.json", import.meta.url);

test("every distributed FE unit has a complete Japanese label", async () => {
  const data = JSON.parse(await readFile(dataPath, "utf8"));
  const unitIds = [...new Set(data.questions.map((question) => question.unitId).filter(Boolean))].sort();

  assert.equal(unitIds.length, 41);
  for (const unitId of unitIds) {
    const entry = FE_UNIT_LABELS[unitId];
    assert.ok(entry, `Missing Japanese unit label: ${unitId}`);
    assert.equal(getFeUnitLabel(unitId), entry.label);
    assert.equal(getFeUnitLabelParts(unitId).join(""), entry.label);
    assert.doesNotMatch(entry.label, /[A-Za-z]/, `Unit label contains an English identifier: ${unitId}`);
    assert.ok(entry.label.length > 0);
    assert.ok(entry.parts.every((part) => part.length > 0));
  }
});

test("runtime-prefixed unit identifiers resolve to the longest canonical unit ID", () => {
  assert.equal(resolveFeUnitLabelId("technology/basic-theory"), "basic-theory");
  assert.equal(getFeUnitLabel("A:technology/basic-theory"), "基礎理論");
  assert.equal(getFeUnitLabel("A/information-security"), "情報セキュリティ");
  assert.equal(getFeUnitLabel("A/two-dimensional-arrays"), "二次元配列");
  assert.deepEqual(getFeUnitLabelParts("A/software-development-management"), ["ソフトウェア", "開発管理"]);
});

test("unknown unit identifiers never leak into learner-facing text", () => {
  assert.equal(getFeUnitLabel("future-unknown-unit"), "単元名未登録");
  assert.deepEqual(getFeUnitLabelParts("future-unknown-unit"), ["単元名未登録"]);
});

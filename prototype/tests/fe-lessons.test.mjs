import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { feLessons, getFeLessonById, validateFeLessonDefinition } from "../src/data/feLessons.js";

const here = dirname(fileURLToPath(import.meta.url));
const prototypeRoot = resolve(here, "..");

test("FE lesson catalog exposes one complete first lesson", () => {
  assert.equal(feLessons.length, 1);
  const lesson = feLessons[0];
  assert.equal(lesson.number, 1);
  assert.equal(lesson.subject, "B");
  assert.equal(lesson.domain, "プログラムの基本要素");
  assert.deepEqual(validateFeLessonDefinition(lesson), []);
  assert.equal(getFeLessonById(lesson.id), lesson);
});

test("first FE lesson includes ordered objectives, examples, and a valid knowledge check", () => {
  const lesson = feLessons[0];
  assert.ok(lesson.objectives.length >= 3);
  assert.deepEqual(lesson.outline.map((step) => step.id), lesson.sections.map((section) => section.id));
  assert.ok(lesson.sections.some((section) => section.blocks.some((block) => block.type === "code")));
  assert.ok(lesson.sections.some((section) => section.blocks.some((block) => block.type === "table")));
  assert.ok(lesson.sections.some((section) => section.blocks.some((block) => block.type === "list")));
  assert.equal(lesson.check.choices.length, 4);
  assert.ok(lesson.check.choices.some((choice) => choice.id === lesson.check.correctChoiceId));
});

test("FE lesson route is isolated from practice and session rendering", async () => {
  const source = await readFile(resolve(prototypeRoot, "src/AppV5.jsx"), "utf8");
  assert.match(source, /FeLessonApp/u);
  assert.match(source, /route\.tab === "lesson"/u);
  assert.match(source, /FeLearningApp/u);
  assert.match(source, /route\.tab !== "lesson"/u);
});

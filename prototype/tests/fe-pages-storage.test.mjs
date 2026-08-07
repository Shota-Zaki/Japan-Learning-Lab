import assert from "node:assert/strict";
import test from "node:test";
import { feQuestions } from "../src/data/feQuestions.js";
import { createFeSession } from "../src/feSession.js";
import { createFeSessionStore } from "../src/feStorage.js";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("Pages mode keeps FE sessions on-device without calling unavailable APIs", async () => {
  const storage = memoryStorage();
  let requestCount = 0;
  const store = createFeSessionStore({
    storage,
    cloudSync: false,
    fetchImpl: async () => {
      requestCount += 1;
      throw new Error("Pages builds must not call the FE session API");
    },
  });
  const session = createFeSession({
    config: { type: "topic", subjects: ["A"], count: 1 },
    questions: [feQuestions[0]],
    id: "pages-device-session",
    now: "2026-08-06T00:00:00.000Z",
  });

  const saved = store.save(session, []);
  assert.equal(await saved.synced, false);
  assert.equal(requestCount, 0);

  const listed = await store.list(feQuestions);
  assert.equal(listed.source, "device");
  assert.equal(listed.sessions[0].id, session.id);
  assert.equal(requestCount, 0);

  await store.clear();
  assert.deepEqual((await store.list(feQuestions)).sessions, []);
  assert.equal(requestCount, 0);
});

import assert from "node:assert/strict";
import test from "node:test";
import { feQuestions } from "../src/data/feQuestions.js";
import { createFeSession } from "../src/feSession.js";
import { createFeSessionStore } from "../src/feStorage.js";

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

const config = { type: "topic", domain: "technology", periodId: "all", periodLabel: "すべての開催回", scope: "all", count: 10 };

test("recovers safely from corrupt local session JSON", async () => {
  const storage = memoryStorage({ "jll:fe:sessions:v1": "{broken" });
  const store = createFeSessionStore({ storage, fetchImpl: null });
  const result = await store.list(feQuestions);
  assert.deepEqual(result.sessions, []);
  assert.equal(result.recovered, true);
  assert.equal(result.source, "device");
});

test("local cache remains usable when the cloud endpoint fails", async () => {
  const storage = memoryStorage();
  const store = createFeSessionStore({ storage, fetchImpl: async () => new Response("offline", { status: 503 }) });
  const session = createFeSession({ config, questions: [feQuestions[0]], id: "fe-storage-test", now: "2026-08-05T00:00:00.000Z" });
  store.save(session, []);
  const result = await store.list(feQuestions);
  assert.equal(result.sessions[0].id, session.id);
  assert.equal(result.source, "device");
});

test("newer device data wins and is sent to cloud storage", async () => {
  const storage = memoryStorage();
  const requests = [];
  const cloudSession = createFeSession({ config, questions: [feQuestions[0]], id: "fe-merge-test", now: "2026-08-05T00:00:00.000Z" });
  const localSession = { ...cloudSession, updatedAt: "2026-08-05T00:05:00.000Z" };
  storage.setItem("jll:fe:sessions:v1", JSON.stringify([localSession]));
  const store = createFeSessionStore({
    storage,
    fetchImpl: async (url, options = {}) => {
      requests.push({ url, options });
      if (!options.method) return Response.json({ sessions: [cloudSession] });
      return Response.json({ session: JSON.parse(options.body) });
    },
  });
  const result = await store.list(feQuestions);
  assert.equal(result.sessions[0].updatedAt, localSession.updatedAt);
  assert.equal(result.source, "cloud");
  assert.ok(requests.some(({ options }) => options.method === "PUT"));
});

test("failed cloud deletion preserves the recoverable device copy", async () => {
  const storage = memoryStorage();
  const session = createFeSession({ config, questions: [feQuestions[0]], id: "fe-delete-test", now: "2026-08-05T00:00:00.000Z" });
  storage.setItem("jll:fe:sessions:v1", JSON.stringify([session]));
  const store = createFeSessionStore({ storage, fetchImpl: async () => new Response("offline", { status: 503 }) });
  await assert.rejects(store.clear(), /Session reset failed/);
  assert.equal((await store.list(feQuestions)).sessions[0].id, session.id);
});

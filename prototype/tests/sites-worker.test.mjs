import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import worker from "../worker/index.js";

function createD1Mock() {
  const rows = new Map();
  return {
    rows,
    batch: async () => [],
    prepare(sql) {
      return {
        bindings: [],
        bind(...values) { this.bindings = values; return this; },
        async all() {
          if (sql.includes("SELECT payload_json") && sql.includes("WHERE device_id")) {
            return { results: [...rows.values()].filter((row) => row.device_id === this.bindings[0]).sort((left, right) => right.updated_at.localeCompare(left.updated_at)).map(({ payload_json }) => ({ payload_json })) };
          }
          return { results: [] };
        },
        async first() {
          const row = rows.get(this.bindings[0]);
          if (!row) return null;
          if (sql.includes("SELECT device_id")) return { device_id: row.device_id };
          if (sql.includes("SELECT payload_json") && row.device_id === this.bindings[1]) return { payload_json: row.payload_json };
          return null;
        },
        async run() {
          if (sql.includes("INSERT INTO fe_sessions")) {
            const [id, device_id, status, payload_json, started_at, updated_at, completed_at] = this.bindings;
            rows.set(id, { id, device_id, status, payload_json, started_at, updated_at, completed_at });
          }
          if (sql.includes("DELETE FROM fe_sessions")) {
            for (const [id, row] of rows) if (row.device_id === this.bindings[0]) rows.delete(id);
          }
          return { success: true };
        },
      };
    },
  };
}

test("serves existing static assets without a fallback", async () => {
  const calls = [];
  const response = await worker.fetch(new Request("https://example.test/assets/app.js"), {
    ASSETS: {
      fetch: async (request) => {
        calls.push(new URL(request.url).pathname);
        return new Response("asset", { status: 200 });
      },
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/assets/app.js"]);
});

test("falls back to index.html for an unknown app route", async () => {
  const calls = [];
  const response = await worker.fetch(
    new Request("https://example.test/flow/step-two?source=share", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async (request) => {
          const url = new URL(request.url);
          calls.push(url.pathname + url.search);
          return new Response(url.pathname === "/index.html" ? '<meta property="og:image" content="__SITE_ORIGIN__/og.png">' : "missing", {
            status: url.pathname === "/index.html" ? 200 : 404,
            headers: { "content-type": url.pathname === "/index.html" ? "text/html" : "text/plain" },
          });
        },
      },
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["/flow/step-two?source=share", "/index.html"]);
  assert.match(await response.text(), /https:\/\/example\.test\/og\.png/);
});

test("does not turn missing API or write requests into the app shell", async () => {
  for (const request of [
    new Request("https://example.test/api/missing", { headers: { accept: "application/json" } }),
    new Request("https://example.test/flow", { method: "POST", headers: { accept: "text/html" } }),
  ]) {
    let calls = 0;
    const response = await worker.fetch(request, {
      ASSETS: {
        fetch: async () => {
          calls += 1;
          return new Response("missing", { status: 404 });
        },
      },
    });

    assert.equal(response.status, 404);
    assert.equal(calls, 1);
  }
});

test("emits the files required by Sites packaging", async () => {
  await access(new URL("../dist/client/index.html", import.meta.url));
  await access(new URL("../dist/client/og.png", import.meta.url));
  await access(new URL("../dist/server/index.js", import.meta.url));
  await access(new URL("../dist/.openai/hosting.json", import.meta.url));
});

test("FE session API persists, lists, reads, and clears a device session", async () => {
  const DB = createD1Mock();
  const session = {
    schemaVersion: 1,
    id: "fe-api-test-session",
    status: "in_progress",
    config: { type: "topic", domain: "technology", periodId: "all", scope: "all", count: 10 },
    questionIds: ["fe-question-001"],
    answers: {},
    drafts: {},
    reviewQuestionIds: [],
    currentIndex: 0,
    startedAt: "2026-08-05T00:00:00.000Z",
    updatedAt: "2026-08-05T00:00:00.000Z",
    completedAt: null,
  };
  const base = "https://example.test/api/fe/sessions";
  const device = "device-test-1234";

  const saved = await worker.fetch(new Request(`${base}/${session.id}?deviceId=${device}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(session) }), { DB });
  assert.equal(saved.status, 200);

  const listed = await worker.fetch(new Request(`${base}?deviceId=${device}`), { DB });
  assert.deepEqual((await listed.json()).sessions, [session]);

  const read = await worker.fetch(new Request(`${base}/${session.id}?deviceId=${device}`), { DB });
  assert.deepEqual((await read.json()).session, session);

  const cleared = await worker.fetch(new Request(`${base}?deviceId=${device}`, { method: "DELETE" }), { DB });
  assert.equal(cleared.status, 200);
  assert.equal(DB.rows.size, 0);
});

test("FE session API rejects invalid device IDs and malformed writes", async () => {
  const DB = createD1Mock();
  assert.equal((await worker.fetch(new Request("https://example.test/api/fe/sessions?deviceId=x"), { DB })).status, 400);
  assert.equal((await worker.fetch(new Request("https://example.test/api/fe/sessions/fe-invalid-session?deviceId=device-test-1234", { method: "PUT", body: "{}" }), { DB })).status, 400);
});

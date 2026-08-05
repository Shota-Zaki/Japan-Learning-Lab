export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const sessionRoute = resolveSessionRoute(url.pathname);
    if (sessionRoute) return handleLearningSessions(request, env, url, sessionRoute);

    const response = await env.ASSETS.fetch(request);
    const acceptsHtml = request.headers.get("accept")?.includes("text/html");

    if (response.status !== 404 || !acceptsHtml || !["GET", "HEAD"].includes(request.method)) {
      return injectRequestOrigin(response, request);
    }

    const indexUrl = new URL(request.url);
    indexUrl.pathname = "/index.html";
    indexUrl.search = "";
    const fallback = await env.ASSETS.fetch(new Request(indexUrl, request));
    return injectRequestOrigin(fallback, request);
  },
};

const SESSION_STATUSES = new Set(["in_progress", "paused", "completed", "abandoned"]);
const SAFE_ID = /^[a-zA-Z0-9_-]{8,160}$/;
const SESSION_ROUTES = Object.freeze({
  fe: Object.freeze({ prefix: "/api/fe/sessions", table: "fe_sessions", requireLab: false }),
  java: Object.freeze({ prefix: "/api/java/sessions", table: "java_sessions", requireLab: true }),
});

function resolveSessionRoute(pathname) {
  return Object.entries(SESSION_ROUTES).find(([, route]) => pathname === route.prefix || pathname.startsWith(`${route.prefix}/`))?.[0] || null;
}

async function ensureSessionSchema(db, route) {
  const table = SESSION_ROUTES[route].table;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS ${table} (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      status TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      started_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      completed_at TEXT
    )`),
    db.prepare(`CREATE INDEX IF NOT EXISTS idx_${table}_device_updated ON ${table}(device_id, updated_at DESC)`),
  ]);
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function validSessionPayload(session, expectedId, route) {
  const requiresLab = SESSION_ROUTES[route].requireLab;
  return Boolean(
    session
    && typeof session === "object"
    && session.schemaVersion === 1
    && session.id === expectedId
    && (!requiresLab || session.lab === route)
    && SESSION_STATUSES.has(session.status)
    && Array.isArray(session.questionIds)
    && session.questionIds.length > 0
    && session.questionIds.length <= 2000
    && new Set(session.questionIds).size === session.questionIds.length
    && typeof session.startedAt === "string"
    && typeof session.updatedAt === "string"
    && (!session.completedAt || typeof session.completedAt === "string")
  );
}

async function handleLearningSessions(request, env, url, route) {
  if (!env.DB) return jsonResponse({ error: "保存サービスを利用できません。" }, 503);
  const routeConfig = SESSION_ROUTES[route];
  const table = routeConfig.table;
  const deviceId = url.searchParams.get("deviceId") || "";
  if (!SAFE_ID.test(deviceId)) return jsonResponse({ error: "端末識別子が不正です。" }, 400);
  await ensureSessionSchema(env.DB, route);

  const itemPrefix = `${routeConfig.prefix}/`;
  const sessionId = url.pathname.startsWith(itemPrefix) ? decodeURIComponent(url.pathname.slice(itemPrefix.length)) : "";

  if (request.method === "GET" && !sessionId) {
    const result = await env.DB.prepare(
      `SELECT payload_json FROM ${table} WHERE device_id = ? ORDER BY updated_at DESC LIMIT 100`,
    ).bind(deviceId).all();
    const sessions = (result.results || []).flatMap((row) => {
      try { return [JSON.parse(row.payload_json)]; } catch { return []; }
    });
    return jsonResponse({ sessions });
  }

  if (request.method === "GET" && SAFE_ID.test(sessionId)) {
    const row = await env.DB.prepare(
      `SELECT payload_json FROM ${table} WHERE id = ? AND device_id = ? LIMIT 1`,
    ).bind(sessionId, deviceId).first();
    if (!row) return jsonResponse({ error: "セッションが見つかりません。" }, 404);
    try { return jsonResponse({ session: JSON.parse(row.payload_json) }); }
    catch { return jsonResponse({ error: "保存データを読み込めません。" }, 500); }
  }

  if (request.method === "PUT" && SAFE_ID.test(sessionId)) {
    let session;
    try { session = await request.json(); }
    catch { return jsonResponse({ error: "保存内容が不正です。" }, 400); }
    if (!validSessionPayload(session, sessionId, route)) return jsonResponse({ error: "保存内容が不正です。" }, 400);

    const existing = await env.DB.prepare(`SELECT device_id FROM ${table} WHERE id = ? LIMIT 1`).bind(sessionId).first();
    if (existing && existing.device_id !== deviceId) return jsonResponse({ error: "このセッションは更新できません。" }, 409);

    await env.DB.prepare(`INSERT INTO ${table} (
      id, device_id, status, payload_json, started_at, updated_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      status = excluded.status,
      payload_json = excluded.payload_json,
      updated_at = excluded.updated_at,
      completed_at = excluded.completed_at`)
      .bind(
        session.id,
        deviceId,
        session.status,
        JSON.stringify(session),
        session.startedAt,
        session.updatedAt,
        session.completedAt,
      ).run();
    return jsonResponse({ session });
  }

  if (request.method === "DELETE" && !sessionId) {
    await env.DB.prepare(`DELETE FROM ${table} WHERE device_id = ?`).bind(deviceId).run();
    return jsonResponse({ deleted: true });
  }

  return jsonResponse({ error: "操作を処理できません。" }, 405);
}

async function injectRequestOrigin(response, request) {
  if (request.method !== "GET" || !response.headers.get("content-type")?.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  const html = (await response.text()).replaceAll("__SITE_ORIGIN__", new URL(request.url).origin);
  return new Response(html, { status: response.status, statusText: response.statusText, headers });
}

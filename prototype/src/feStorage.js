import { normalizeFeSession } from "./feSession.js";

const DEVICE_KEY = "jll:fe:device:v1";
const SESSION_CACHE_KEY = "jll:fe:sessions:v1";

function createDeviceId() {
  if (globalThis.crypto?.randomUUID) return `device-${globalThis.crypto.randomUUID()}`;
  return `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function safeReadCache(storage, questionBank) {
  try {
    const parsed = JSON.parse(storage.getItem(SESSION_CACHE_KEY) || "[]");
    if (!Array.isArray(parsed)) return { sessions: [], recovered: true };
    const sessions = parsed.map((session) => normalizeFeSession(session, questionBank)).filter(Boolean);
    return { sessions, recovered: sessions.length !== parsed.length };
  } catch {
    return { sessions: [], recovered: true };
  }
}

function writeCache(storage, sessions) {
  storage.setItem(SESSION_CACHE_KEY, JSON.stringify(sessions));
}

function mergeSessions(remoteSessions, localSessions) {
  const merged = new Map();
  for (const session of [...remoteSessions, ...localSessions]) {
    const current = merged.get(session.id);
    if (!current || session.updatedAt > current.updatedAt) merged.set(session.id, session);
  }
  return [...merged.values()].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function createFeSessionStore({
  storage = globalThis.localStorage,
  fetchImpl = globalThis.fetch?.bind(globalThis),
  cloudSync = import.meta.env?.MODE !== "pages",
} = {}) {
  const remoteFetch = cloudSync ? fetchImpl : null;
  let saveQueue = Promise.resolve(false);

  function getDeviceId() {
    let deviceId = storage.getItem(DEVICE_KEY);
    if (!deviceId) {
      deviceId = createDeviceId();
      storage.setItem(DEVICE_KEY, deviceId);
    }
    return deviceId;
  }

  async function list(questionBank) {
    const local = safeReadCache(storage, questionBank);
    if (!remoteFetch) return { sessions: local.sessions, source: "device", recovered: local.recovered };

    try {
      const response = await remoteFetch(`/api/fe/sessions?deviceId=${encodeURIComponent(getDeviceId())}`, {
        headers: { accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Session list failed: ${response.status}`);
      const payload = await response.json();
      const remote = (payload.sessions || []).map((session) => normalizeFeSession(session, questionBank)).filter(Boolean);
      const sessions = mergeSessions(remote, local.sessions);
      writeCache(storage, sessions);

      const unsynced = sessions.filter((session) => !remote.some((remoteSession) => remoteSession.id === session.id && remoteSession.updatedAt >= session.updatedAt));
      await Promise.allSettled(unsynced.map((session) => saveRemote(session)));
      return { sessions, source: "cloud", recovered: local.recovered || remote.length !== (payload.sessions || []).length };
    } catch {
      writeCache(storage, local.sessions);
      return { sessions: local.sessions, source: "device", recovered: local.recovered };
    }
  }

  async function saveRemote(session) {
    if (!remoteFetch) return false;
    const response = await remoteFetch(`/api/fe/sessions/${encodeURIComponent(session.id)}?deviceId=${encodeURIComponent(getDeviceId())}`, {
      method: "PUT",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(session),
    });
    if (!response.ok) throw new Error(`Session save failed: ${response.status}`);
    return true;
  }

  function save(session, currentSessions) {
    const sessions = mergeSessions([session], currentSessions);
    writeCache(storage, sessions);
    saveQueue = saveQueue.then(() => saveRemote(session)).catch(() => false);
    return { sessions, synced: saveQueue };
  }

  async function clear() {
    if (remoteFetch) {
      const response = await remoteFetch(`/api/fe/sessions?deviceId=${encodeURIComponent(getDeviceId())}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Session reset failed: ${response.status}`);
    }
    storage.removeItem(SESSION_CACHE_KEY);
  }

  return { getDeviceId, list, save, clear };
}

import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, isAbsolute, join, resolve, sep } from "node:path";

const prototypeDirectory = resolve(".");
const repositoryDirectory = resolve(prototypeDirectory, "..");
const docsDirectory = join(repositoryDirectory, "docs");
const outputDirectory = join(prototypeDirectory, "qa", "jll-fe-lesson-001-browser");
const sitePrefix = "/Japan-Learning-Lab/";
const viewports = [375, 768, 1280];

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".woff2", "font/woff2"],
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (isAbsolute(candidate) && existsSync(candidate)) return candidate;
    const result = spawnSync("which", [candidate], { encoding: "utf8" });
    if (result.status === 0 && result.stdout.trim()) return result.stdout.trim();
  }
  throw new Error("Chromium or Chrome executable was not found");
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
      if (!requestUrl.pathname.startsWith(sitePrefix)) {
        response.writeHead(404).end("Not found");
        return;
      }

      let relativePath = decodeURIComponent(requestUrl.pathname.slice(sitePrefix.length));
      if (!relativePath || relativePath.endsWith("/")) relativePath = "index.html";
      let filePath = resolve(docsDirectory, relativePath);
      const allowedPrefix = `${docsDirectory}${sep}`;
      if (filePath !== docsDirectory && !filePath.startsWith(allowedPrefix)) {
        response.writeHead(403).end("Forbidden");
        return;
      }
      if (!existsSync(filePath)) filePath = join(docsDirectory, "index.html");

      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": contentTypes.get(extname(filePath)) || "application/octet-stream",
      });
      response.end(await readFile(filePath));
    } catch (error) {
      response.writeHead(500).end(String(error));
    }
  });

  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  assert(address && typeof address === "object", "Static server did not expose an address");
  return { server, origin: `http://127.0.0.1:${address.port}` };
}

async function reservePort() {
  const server = createServer();
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  assert(address && typeof address === "object", "Debug port could not be reserved");
  const port = address.port;
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
  return port;
}

async function waitForJson(url, options = {}, attempts = 80) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { cache: "no-store", ...options });
      if (response.ok) return response.json();
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await delay(250);
  }
  throw lastError || new Error(`Timed out fetching ${url}`);
}

class CdpClient {
  constructor(socket, eventHandler) {
    this.socket = socket;
    this.eventHandler = eventHandler;
    this.nextId = 1;
    this.pending = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id) {
        this.eventHandler?.(message);
        return;
      }
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result || {});
    });
  }

  static async connect(url, eventHandler) {
    const socket = new WebSocket(url);
    await new Promise((resolveOpen, rejectOpen) => {
      socket.addEventListener("open", resolveOpen, { once: true });
      socket.addEventListener("error", rejectOpen, { once: true });
    });
    return new CdpClient(socket, eventHandler);
  }

  send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolveRequest, rejectRequest) => {
      this.pending.set(id, { resolve: resolveRequest, reject: rejectRequest });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression) {
  const response = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text || "Browser evaluation failed");
  }
  return response.result?.value;
}

function overviewStateExpression() {
  return `(() => {
    const root = document.documentElement;
    const start = document.querySelector('.fe-lesson-start');
    const title = document.querySelector('#fe-lesson-heading');
    const objectives = [...document.querySelectorAll('.fe-lesson-objectives li')];
    const steps = [...document.querySelectorAll('.fe-lesson-outline li')];
    const rect = (element) => element ? element.getBoundingClientRect() : null;
    const startRect = rect(start);
    return {
      ready: document.readyState,
      fontsReady: !document.fonts || document.fonts.status === 'loaded',
      title: title?.textContent?.trim() || '',
      startVisible: Boolean(start && startRect && startRect.width > 0 && startRect.height > 0),
      startHeight: startRect?.height || 0,
      objectiveCount: objectives.length,
      stepCount: steps.length,
      modeCount: document.querySelectorAll('.fe-mode-nav button').length,
      horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
      bodyWidth: document.body.getBoundingClientRect().width,
      viewportWidth: window.innerWidth
    };
  })()`;
}

function readerStateExpression() {
  return `(() => {
    const root = document.documentElement;
    const layout = document.querySelector('.fe-lesson-reader-layout');
    const body = document.querySelector('.fe-lesson-reader-body');
    const nav = document.querySelector('.fe-lesson-section-nav');
    const choices = [...document.querySelectorAll('.fe-lesson-check-options button')];
    const code = document.querySelector('.fe-code-block pre');
    const table = document.querySelector('.fe-table-scroll');
    const bodyRect = body?.getBoundingClientRect();
    const navRect = nav?.getBoundingClientRect();
    return {
      title: document.querySelector('#fe-lesson-reader-heading')?.textContent?.trim() || '',
      sectionCount: document.querySelectorAll('.fe-lesson-section').length,
      navLinkCount: document.querySelectorAll('.fe-lesson-section-nav a').length,
      choiceCount: choices.length,
      minimumChoiceHeight: choices.length ? Math.min(...choices.map((choice) => choice.getBoundingClientRect().height)) : 0,
      codePresent: Boolean(code),
      tablePresent: Boolean(table),
      horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
      layoutColumns: layout ? getComputedStyle(layout).gridTemplateColumns : '',
      navBesideBody: Boolean(bodyRect && navRect && navRect.left >= bodyRect.right - 1),
      navBelowBody: Boolean(bodyRect && navRect && navRect.top >= bodyRect.bottom - 1),
      viewportWidth: window.innerWidth
    };
  })()`;
}

async function waitForState(client, expression, predicate, message) {
  let lastState;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    lastState = await evaluate(client, expression);
    if (predicate(lastState)) return lastState;
    await delay(100);
  }
  throw new Error(`${message}: ${JSON.stringify(lastState)}`);
}

async function captureFullPage(client, filePath) {
  const layout = await client.send("Page.getLayoutMetrics");
  const contentSize = layout.cssContentSize || layout.contentSize;
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: true,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(contentSize.width),
      height: Math.ceil(contentSize.height),
      scale: 1,
    },
  });
  await writeFile(filePath, Buffer.from(screenshot.data, "base64"));
}

function validateOverview(state, width) {
  assert(state.title === "最初のレッスン：擬似言語の変数を追う", `Lesson overview title is missing at ${width}px`);
  assert(state.startVisible && state.startHeight >= 44, `Lesson start target is too small at ${width}px`);
  assert(state.objectiveCount === 3, `Lesson objectives are incomplete at ${width}px`);
  assert(state.stepCount === 4, `Lesson sequence is incomplete at ${width}px`);
  assert(state.modeCount === 3, `Lesson mode navigation changed at ${width}px`);
  assert(!state.horizontalOverflow, `Lesson overview overflows horizontally at ${width}px`);
}

function validateReader(state, width) {
  assert(state.title === "代入と繰返しを追跡する", `Lesson reader title is missing at ${width}px`);
  assert(state.sectionCount === 4, `Lesson reader section count changed at ${width}px`);
  assert(state.navLinkCount === 5, `Lesson reader navigation is incomplete at ${width}px`);
  assert(state.choiceCount === 4, `Lesson knowledge check is incomplete at ${width}px`);
  assert(state.minimumChoiceHeight >= 44, `Lesson answer target is too small at ${width}px`);
  assert(state.codePresent && state.tablePresent, `Lesson example content is incomplete at ${width}px`);
  assert(!state.horizontalOverflow, `Lesson reader overflows horizontally at ${width}px`);
  if (width >= 1280) assert(state.navBesideBody, `Lesson navigation is not beside the content at ${width}px`);
  if (width <= 768) assert(state.navBelowBody, `Lesson navigation did not stack below the content at ${width}px`);
}

async function auditViewport(chromePath, origin, width) {
  const debugPort = await reservePort();
  const profileDirectory = await mkdtemp(join(tmpdir(), `jll-fe-lesson-${width}-`));
  const browserEvents = { consoleErrors: [], exceptions: [], failedRequests: [] };
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDirectory}`,
    "about:blank",
  ], { stdio: "ignore" });

  let client;
  try {
    await waitForJson(`http://127.0.0.1:${debugPort}/json/version`);
    const targetUrl = `${origin}${sitePrefix}?screen=fe&mode=lesson`;
    const target = await waitForJson(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(targetUrl)}`, { method: "PUT" });
    client = await CdpClient.connect(target.webSocketDebuggerUrl, (message) => {
      if (message.method === "Log.entryAdded" && message.params?.entry?.level === "error") browserEvents.consoleErrors.push(message.params.entry.text);
      if (message.method === "Runtime.exceptionThrown") browserEvents.exceptions.push(message.params?.exceptionDetails?.text || "Runtime exception");
      if (message.method === "Network.loadingFailed" && !message.params?.canceled) browserEvents.failedRequests.push(message.params?.errorText || "Network failure");
    });

    await Promise.all([
      client.send("Page.enable"),
      client.send("Runtime.enable"),
      client.send("Log.enable"),
      client.send("Network.enable"),
    ]);
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width === 375 ? 812 : width === 768 ? 1024 : 900,
      deviceScaleFactor: 1,
      mobile: width === 375,
    });
    await client.send("Page.navigate", { url: targetUrl });

    const overview = await waitForState(
      client,
      overviewStateExpression(),
      (state) => state.ready === "complete" && state.fontsReady && state.startVisible,
      `Lesson overview did not settle at ${width}px`,
    );
    validateOverview(overview, width);
    await captureFullPage(client, join(outputDirectory, `lesson-overview-${width}.png`));

    await evaluate(client, `document.querySelector('.fe-lesson-start').click(); true`);
    const reader = await waitForState(
      client,
      readerStateExpression(),
      (state) => state.sectionCount === 4 && state.choiceCount === 4,
      `Lesson reader did not settle at ${width}px`,
    );
    validateReader(reader, width);
    await captureFullPage(client, join(outputDirectory, `lesson-reader-${width}.png`));

    assert(browserEvents.consoleErrors.length === 0, `Console errors at ${width}px: ${browserEvents.consoleErrors.join(" | ")}`);
    assert(browserEvents.exceptions.length === 0, `Runtime exceptions at ${width}px: ${browserEvents.exceptions.join(" | ")}`);
    assert(browserEvents.failedRequests.length === 0, `Failed requests at ${width}px: ${browserEvents.failedRequests.join(" | ")}`);

    return { width, overview, reader, browserEvents };
  } finally {
    client?.close();
    chrome.kill("SIGTERM");
    await delay(250);
    await rm(profileDirectory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const chromePath = findChrome();
const { server, origin } = await startStaticServer();
try {
  const scenarios = [];
  for (const width of viewports) scenarios.push(await auditViewport(chromePath, origin, width));
  const evidence = {
    taskId: "JLL-FE-LESSON-001",
    sourceRevision: process.env.GITHUB_SHA || null,
    viewports,
    scenarios,
    result: "passed",
  };
  await writeFile(join(outputDirectory, "audit.json"), `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`FE lesson browser audit passed for ${viewports.join(", ")}px`);
} catch (error) {
  await writeFile(join(outputDirectory, "failure.json"), `${JSON.stringify({ error: String(error), stack: error?.stack || null }, null, 2)}\n`);
  throw error;
} finally {
  await new Promise((resolveClose) => server.close(() => resolveClose()));
}

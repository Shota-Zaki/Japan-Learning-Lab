import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, extname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const prototypeDirectory = resolve(scriptDirectory, "..");
const repositoryDirectory = resolve(prototypeDirectory, "..");
const docsDirectory = join(repositoryDirectory, "docs");
const outputDirectory = join(prototypeDirectory, "qa", "jll-fe-004-browser");
const sitePrefix = "/Japan-Learning-Lab/";
const viewports = [375, 768, 1280];

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

function findChrome() {
  const candidates = [process.env.CHROME_BIN, "google-chrome", "google-chrome-stable", "chromium", "chromium-browser"].filter(Boolean);
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

async function waitForJson(url, attempts = 80) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { cache: "no-store" });
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
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result || {});
    });
  }

  static async connect(url) {
    const socket = new WebSocket(url);
    await new Promise((resolveOpen, rejectOpen) => {
      socket.addEventListener("open", resolveOpen, { once: true });
      socket.addEventListener("error", rejectOpen, { once: true });
    });
    return new CdpClient(socket);
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
  const response = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text || "Browser evaluation failed");
  return response.result?.value;
}

async function waitFor(client, expression, label, attempts = 160) {
  let lastValue;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    lastValue = await evaluate(client, expression);
    if (lastValue) return lastValue;
    await delay(125);
  }
  throw new Error(`Timed out waiting for ${label}; last value: ${JSON.stringify(lastValue)}`);
}

function clickTextExpression(selector, text) {
  return `(() => {
    const target = [...document.querySelectorAll(${JSON.stringify(selector)})].find((element) => element.textContent?.includes(${JSON.stringify(text)}));
    if (!target) return false;
    target.click();
    return true;
  })()`;
}

function metricsExpression() {
  return `(() => {
    const round = (value) => Math.round(value * 100) / 100;
    const rect = (element) => {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { x: round(box.x), y: round(box.y), width: round(box.width), height: round(box.height), right: round(box.right), bottom: round(box.bottom) };
    };
    const intersects = (left, right) => Boolean(left && right && left.x < right.right && left.right > right.x && left.y < right.bottom && left.bottom > right.y);
    const elements = {
      timer: document.querySelector('.fe-mock-timer'),
      status: document.querySelector('.header-session-status'),
      headerInner: document.querySelector('.header-inner'),
      brand: document.querySelector('.brand'),
      nav: document.querySelector('.global-nav'),
      headerActions: document.querySelector('.header-actions'),
      questionHeading: document.querySelector('.fe-question-card > h1'),
      questionContent: document.querySelector('.fe-question-content'),
      answers: document.querySelector('.fe-answer-options'),
      sessionActions: document.querySelector('.session-actions'),
    };
    const boxes = Object.fromEntries(Object.entries(elements).map(([key, element]) => [key, rect(element)]));
    return {
      timerText: elements.timer?.textContent?.trim() || '',
      ...boxes,
      viewport: {
        width: innerWidth,
        height: innerHeight,
        scrollY: round(scrollY),
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      },
      containedByStatus: Boolean(boxes.timer && boxes.status && boxes.timer.x >= boxes.status.x && boxes.timer.right <= boxes.status.right && boxes.timer.y >= boxes.status.y && boxes.timer.bottom <= boxes.status.bottom),
      statusSeparatedFromHeaderInner: Boolean(boxes.status && boxes.headerInner && boxes.status.y >= boxes.headerInner.bottom - 1),
      overlaps: {
        brand: intersects(boxes.timer, boxes.brand),
        nav: intersects(boxes.timer, boxes.nav),
        headerActions: intersects(boxes.timer, boxes.headerActions),
        questionHeading: intersects(boxes.timer, boxes.questionHeading),
        questionContent: intersects(boxes.timer, boxes.questionContent),
        answers: intersects(boxes.timer, boxes.answers),
        sessionActions: intersects(boxes.timer, boxes.sessionActions),
      },
    };
  })()`;
}

function geometrySummary(metrics) {
  return JSON.stringify({
    viewport: metrics.viewport,
    timer: metrics.timer,
    status: metrics.status,
    headerInner: metrics.headerInner,
    brand: metrics.brand,
    nav: metrics.nav,
    headerActions: metrics.headerActions,
    questionHeading: metrics.questionHeading,
    questionContent: metrics.questionContent,
    answers: metrics.answers,
    sessionActions: metrics.sessionActions,
    overlaps: metrics.overlaps,
  });
}

function validateMockMetrics(metrics, width, phase) {
  const geometry = geometrySummary(metrics);
  assert(metrics.timer && metrics.status, `Mock timer/status row missing at ${width}px (${phase}); ${geometry}`);
  assert(/^残り \d{2,3}:\d{2}$/.test(metrics.timerText), `Unexpected timer text at ${width}px: ${metrics.timerText}`);
  assert(metrics.containedByStatus, `Timer escapes its reserved status row at ${width}px (${phase}); ${geometry}`);
  assert(metrics.statusSeparatedFromHeaderInner, `Timer status row is not separated from the primary header row at ${width}px (${phase}); ${geometry}`);
  assert(!metrics.overlaps.brand, `Timer overlaps brand at ${width}px (${phase}); ${geometry}`);
  assert(!metrics.overlaps.nav, `Timer overlaps global navigation at ${width}px (${phase}); ${geometry}`);
  assert(!metrics.overlaps.headerActions, `Timer overlaps header actions at ${width}px (${phase}); ${geometry}`);
  if (phase === "initial") {
    assert(metrics.viewport.scrollY <= 2, `Initial session geometry was not measured near the scroll origin for ${width}px; ${geometry}`);
    assert(!metrics.overlaps.questionHeading, `Timer overlaps problem heading at ${width}px; ${geometry}`);
    assert(!metrics.overlaps.questionContent, `Timer overlaps problem body at ${width}px; ${geometry}`);
    assert(!metrics.overlaps.answers, `Timer overlaps answer controls at ${width}px; ${geometry}`);
    assert(!metrics.overlaps.sessionActions, `Timer overlaps session actions at ${width}px; ${geometry}`);
  }
  assert(metrics.viewport.scrollWidth <= metrics.viewport.clientWidth + 1, `Page overflows horizontally at ${width}px (${phase}); ${geometry}`);
  assert(metrics.timer.y >= -1 && metrics.timer.bottom <= metrics.viewport.height + 1, `Timer is outside the viewport at ${width}px (${phase}); ${geometry}`);
}

async function captureViewport(client, filePath) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await writeFile(filePath, Buffer.from(screenshot.data, "base64"));
}

async function auditScenario(debugOrigin, siteOrigin, width) {
  const targetUrl = `${siteOrigin}${sitePrefix}?screen=fe&tab=practice`;
  const target = await fetch(`${debugOrigin}/json/new?${encodeURIComponent(targetUrl)}`, { method: "PUT" }).then((response) => response.json());
  const client = await CdpClient.connect(target.webSocketDebuggerUrl);
  const consoleMessages = [];
  const failedRequests = [];

  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    client.socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(message.params.type)) consoleMessages.push(message.params.type);
      if (message.method === "Network.loadingFailed" && !message.params.canceled) failedRequests.push(message.params.errorText);
    });
    await client.send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width <= 430 });
    await client.send("Page.navigate", { url: targetUrl });

    await waitFor(client, `document.readyState === 'complete' && Boolean(document.querySelector('.fe-session-type'))`, "practice setup");
    await waitFor(client, `document.querySelector('.source-count') && !document.querySelector('.source-count')?.classList.contains('is-loading')`, "question bank");
    assert(await evaluate(client, clickTextExpression(".fe-session-type button", "模擬試験")), `Could not select mock mode at ${width}px`);
    await waitFor(client, `(() => { const button = document.querySelector('.fe-start-button'); return Boolean(button && !button.disabled && button.textContent.includes('模擬試験を開始')); })()`, "enabled mock start button");
    assert(await evaluate(client, `(() => { const button = document.querySelector('.fe-start-button'); button?.click(); return Boolean(button); })()`), `Could not start mock exam at ${width}px`);
    await waitFor(client, `Boolean(document.querySelector('.fe-exam-session') && document.querySelector('.fe-mock-timer'))`, "mock session with header timer");

    await evaluate(client, `document.documentElement.style.scrollBehavior = 'auto'; document.body.style.scrollBehavior = 'auto'; window.scrollTo({ top: 0, behavior: 'auto' }); true`);
    await waitFor(client, `window.scrollY <= 2`, "mock session scroll origin");
    await delay(150);
    const initial = await evaluate(client, metricsExpression());
    console.log(`mock-timer ${width}px initial ${geometrySummary(initial)}`);
    validateMockMetrics(initial, width, "initial");
    const mockScreenshot = `mock-timer-${width}.png`;
    await captureViewport(client, join(outputDirectory, mockScreenshot));

    await evaluate(client, `window.scrollTo({ top: Math.min(180, Math.max(1, document.documentElement.scrollHeight - innerHeight)), behavior: 'instant' }); true`);
    await waitFor(client, `window.scrollY > 0`, "scrolled mock session");
    await delay(100);
    const scrolled = await evaluate(client, metricsExpression());
    console.log(`mock-timer ${width}px scrolled ${geometrySummary(scrolled)}`);
    validateMockMetrics(scrolled, width, "scrolled");
    assert(Math.abs(scrolled.timer.y - initial.timer.y) <= 1.5, `Timer moved vertically after scroll at ${width}px; initial=${initial.timer.y}, scrolled=${scrolled.timer.y}`);

    assert(await evaluate(client, clickTextExpression(".global-nav button", "演習・模試")), `Could not return to practice setup at ${width}px`);
    await waitFor(client, `Boolean(document.querySelector('.fe-session-type')) && !document.querySelector('.fe-mock-timer')`, "practice setup without timer");
    await waitFor(client, `(() => { const button = document.querySelector('.fe-start-button'); return Boolean(button && !button.disabled && button.textContent.includes('この条件で演習を開始')); })()`, "enabled topic start button");
    await evaluate(client, `document.querySelector('.fe-start-button')?.click(); true`);
    await waitFor(client, `Boolean(document.querySelector('.fe-exam-session'))`, "topic session");
    await delay(150);
    const topicTimerState = await evaluate(client, `({ timerCount: document.querySelectorAll('.fe-mock-timer').length, statusCount: document.querySelectorAll('[data-fe-session-status="mock"]').length, inlineTimerCount: document.querySelectorAll('.session-topbar > span > strong').length, scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth })`);
    assert(topicTimerState.timerCount === 0, `Normal exercise shows the header timer at ${width}px`);
    assert(topicTimerState.statusCount === 0, `Normal exercise reserves a mock status row at ${width}px`);
    assert(topicTimerState.inlineTimerCount === 0, `Normal exercise renders the legacy inline timer at ${width}px`);
    assert(topicTimerState.scrollWidth <= topicTimerState.clientWidth + 1, `Normal exercise overflows horizontally at ${width}px`);
    const topicScreenshot = `topic-no-timer-${width}.png`;
    await captureViewport(client, join(outputDirectory, topicScreenshot));

    assert(consoleMessages.length === 0, `Console warnings or errors occurred at ${width}px`);
    assert(failedRequests.length === 0, `Network request failed at ${width}px: ${failedRequests.join(", ")}`);

    return { width, initial, scrolled, topicTimerState, screenshots: [mockScreenshot, topicScreenshot], consoleMessages, failedRequests };
  } finally {
    client.close();
    await fetch(`${debugOrigin}/json/close/${target.id}`, { method: "PUT" }).catch(() => {});
  }
}

async function waitForProcessExit(process, milliseconds) {
  if (process.exitCode !== null) return true;
  return Promise.race([
    new Promise((resolveExit) => process.once("exit", () => resolveExit(true))),
    delay(milliseconds).then(() => false),
  ]);
}

async function stopChrome(chrome) {
  if (chrome.exitCode !== null) return;
  chrome.kill("SIGTERM");
  if (await waitForProcessExit(chrome, 3000)) return;
  chrome.kill("SIGKILL");
  await waitForProcessExit(chrome, 3000);
}

async function main() {
  assert(existsSync(join(docsDirectory, "index.html")), "Run the Pages build before the browser audit");
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });

  const { server, origin: siteOrigin } = await startStaticServer();
  const debugPort = await reservePort();
  const debugOrigin = `http://127.0.0.1:${debugPort}`;
  const userDataDirectory = await mkdtemp(join(tmpdir(), "jll-fe-mock-timer-"));
  const chromePath = findChrome();
  const chrome = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--no-sandbox",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDirectory}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });
  let chromeError = "";
  chrome.stderr.on("data", (chunk) => { chromeError += String(chunk); });

  try {
    await waitForJson(`${debugOrigin}/json/version`);
    const scenarios = [];
    for (const width of viewports) scenarios.push(await auditScenario(debugOrigin, siteOrigin, width));
    const buildInfo = JSON.parse(await readFile(join(docsDirectory, "build-info.json"), "utf8"));
    const evidence = {
      status: "passed",
      taskId: "JLL-FE-004",
      sourceRevision: process.env.GITHUB_SHA || buildInfo.sourceRevision || null,
      workflowRunId: process.env.GITHUB_RUN_ID ? Number(process.env.GITHUB_RUN_ID) : null,
      workflowRunNumber: process.env.GITHUB_RUN_NUMBER ? Number(process.env.GITHUB_RUN_NUMBER) : null,
      browser: chromePath,
      viewports,
      checks: [
        "initial geometry is measured at the settled scroll origin after route transition",
        "timer is contained by a dedicated header status row",
        "timer does not overlap brand, global navigation, optional header actions, initial problem heading, problem body, answer controls, or session actions",
        "timer remains in the viewport at the same vertical position after scrolling",
        "normal topic exercise does not render the mock timer or status row",
        "page has no horizontal overflow",
      ],
      screenshots: scenarios.flatMap((scenario) => scenario.screenshots),
      scenarios,
    };
    await writeFile(join(outputDirectory, "audit.json"), `${JSON.stringify(evidence, null, 2)}\n`);
    await writeFile(join(outputDirectory, "README.md"), `# JLL-FE-004 Browser Evidence\n\n- Status: passed\n- Source revision: \`${evidence.sourceRevision}\`\n- Viewports: ${viewports.join(", ")}px\n- Screenshots: ${evidence.screenshots.join(", ")}\n- Checks: dedicated header status row containment; no collision with live header or initial session content and controls; sticky visibility after scroll; no mock timer during normal topic exercise; no page horizontal overflow.\n`);
    console.log(`FE mock timer browser audit passed for ${scenarios.length} viewports`);
  } catch (error) {
    await writeFile(join(outputDirectory, "failure.json"), `${JSON.stringify({ status: "failed", error: String(error), chromeError }, null, 2)}\n`);
    throw error;
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
    await stopChrome(chrome);
    await rm(userDataDirectory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 }).catch(() => {});
  }
}

await main();

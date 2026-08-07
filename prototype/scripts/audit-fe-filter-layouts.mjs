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
const outputDirectory = join(prototypeDirectory, "qa", "jll-fe-003-browser");
const sitePrefix = "/Japan-Learning-Lab/";
const viewports = [375, 768, 1280];
const variants = ["1", "2", "3"];
const expectedMinimums = { sourceCount: 1900, optionCounts: [3, 20, 20, 4] };

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
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

function browserStateExpression() {
  return `(() => {
    const round = (value) => Math.round(value * 100) / 100;
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return { x: round(box.x), y: round(box.y), width: round(box.width), height: round(box.height), bottom: round(box.bottom) };
    };
    const root = document.documentElement;
    const subject = document.querySelector('.fe-subject-selector');
    const grid = document.querySelector('.fe-filter-variant-grid');
    const cards = grid ? [...grid.querySelectorAll(':scope > fieldset')] : [];
    const labels = grid ? [...grid.querySelectorAll('.fe-check-grid-compact label strong')] : [];
    const countText = document.querySelector('.source-count')?.textContent || '';
    const gridStyle = grid ? getComputedStyle(grid) : null;
    const cardMetrics = cards.map((card) => ({
      legend: card.querySelector('legend')?.textContent?.trim() || '',
      rect: rect(card),
      optionCount: card.querySelectorAll('input[type="checkbox"]').length,
      clientHeight: card.clientHeight,
      scrollHeight: card.scrollHeight,
      overflowY: getComputedStyle(card).overflowY,
      internalVerticalOverflow: card.scrollHeight > card.clientHeight + 1
    }));
    return {
      ready: document.readyState,
      fontsReady: !document.fonts || document.fonts.status === 'loaded',
      activeVariant: root.dataset.feFilterLayout || null,
      sourceCount: Number.parseInt(countText.replace(/[^0-9]/g, ''), 10) || 0,
      optionCounts: cardMetrics.map((card) => card.optionCount),
      viewport: {
        innerWidth: window.innerWidth,
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        pageHorizontalOverflow: root.scrollWidth > root.clientWidth + 1
      },
      subject: subject ? rect(subject) : null,
      grid: grid ? rect(grid) : null,
      rowGap: gridStyle ? Number.parseFloat(gridStyle.rowGap) || 0 : 0,
      layoutMeasured: grid?.dataset.feLayoutMeasured || '',
      layoutExtraSpace: gridStyle?.getPropertyValue('--fe-filter-layout-2-extra-space').trim() || '0px',
      subjectIndependent: Boolean(subject && grid && subject.getBoundingClientRect().bottom <= grid.getBoundingClientRect().top),
      cardCount: cards.length,
      cards: cardMetrics,
      cardsContainedByGrid: Boolean(grid && cardMetrics.every((card) => card.rect.bottom <= grid.getBoundingClientRect().bottom + 1)),
      layout2LeftGap: cards.length === 4 ? round(cards[3].getBoundingClientRect().top - cards[0].getBoundingClientRect().bottom) : null,
      labels: {
        count: labels.length,
        clipped: labels.filter((label) => {
          const style = getComputedStyle(label);
          return style.textOverflow === 'ellipsis' || style.whiteSpace === 'nowrap' || label.scrollWidth > label.clientWidth + 1;
        }).map((label) => label.textContent?.trim() || '')
      },
      domOrder: cards.map((card) => card.querySelector('legend')?.textContent?.trim() || ''),
      unitLabels: cards[1] ? [...cards[1].querySelectorAll('label strong')].map((label) => label.textContent?.trim() || '') : [],
      unitValues: cards[1] ? [...cards[1].querySelectorAll('label input')].map((input) => input.value || '') : []
    };
  })()`;
}

function hasFinalOptionCounts(state) {
  return expectedMinimums.optionCounts.every((minimum, index) => state.optionCounts[index] >= minimum);
}

function stableSignature(state) {
  return JSON.stringify({
    sourceCount: state.sourceCount,
    optionCounts: state.optionCounts,
    cards: state.cards.map((card) => card.rect),
    grid: state.grid,
    layoutMeasured: state.layoutMeasured,
  });
}

async function waitForStableApplication(client, requiredSamples = 5) {
  await evaluate(client, `(async () => {
    if (document.fonts) await document.fonts.ready;
    return true;
  })()`);

  let lastState = null;
  let previousSignature = "";
  let stableSamples = 0;
  for (let attempt = 0; attempt < 180; attempt += 1) {
    lastState = await evaluate(client, browserStateExpression());
    const ready = lastState.ready === "complete"
      && lastState.fontsReady
      && lastState.cardCount === 4
      && lastState.subject
      && lastState.sourceCount >= expectedMinimums.sourceCount
      && hasFinalOptionCounts(lastState)
      && lastState.layoutMeasured === "true";

    if (ready) {
      const signature = stableSignature(lastState);
      stableSamples = signature === previousSignature ? stableSamples + 1 : 1;
      previousSignature = signature;
      if (stableSamples >= requiredSamples) return lastState;
    } else {
      stableSamples = 0;
      previousSignature = "";
    }
    await delay(150);
  }
  throw new Error(`Application did not reach a stable final render: ${JSON.stringify(lastState)}`);
}

function finalDataStatesMatch(before, after) {
  return before.activeVariant === after.activeVariant
    && before.sourceCount === after.sourceCount
    && JSON.stringify(before.optionCounts) === JSON.stringify(after.optionCounts)
    && JSON.stringify(before.domOrder) === JSON.stringify(after.domOrder)
    && JSON.stringify(before.unitLabels) === JSON.stringify(after.unitLabels)
    && JSON.stringify(before.unitValues) === JSON.stringify(after.unitValues)
    && before.layoutMeasured === "true"
    && after.layoutMeasured === "true";
}

async function keyboardCheck(client) {
  const before = await evaluate(client, `(() => {
    const input = document.querySelector('.fe-filter-variant-grid input[type="checkbox"]');
    input.focus();
    return { checked: input.checked, focused: document.activeElement === input };
  })()`);
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: " ", code: "Space", windowsVirtualKeyCode: 32 });
  const after = await evaluate(client, `(() => {
    const input = document.querySelector('.fe-filter-variant-grid input[type="checkbox"]');
    return { checked: input.checked, focused: document.activeElement === input };
  })()`);
  return { before, after, toggled: before.checked !== after.checked && before.focused && after.focused };
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

function validateMetrics(metrics, variant, width) {
  assert(metrics.activeVariant === variant, `Variant ${variant} did not activate at ${width}px`);
  assert(metrics.cardCount === 4, `Variant ${variant} has ${metrics.cardCount} filter cards at ${width}px`);
  assert(metrics.sourceCount >= expectedMinimums.sourceCount, `Question bank did not finish loading for variant ${variant} at ${width}px`);
  assert(hasFinalOptionCounts(metrics), `Final filter option counts were not loaded for variant ${variant} at ${width}px`);
  assert(metrics.layoutMeasured === "true", `Layout measurement did not settle for variant ${variant} at ${width}px`);
  assert(metrics.subjectIndependent, `Subject selector entered the filter grid at ${width}px`);
  assert(!metrics.viewport.pageHorizontalOverflow, `Page overflowed horizontally for variant ${variant} at ${width}px`);
  assert(metrics.cardsContainedByGrid, `A filter card extends beyond the grid for variant ${variant} at ${width}px`);
  assert(metrics.cards.every((card) => !["auto", "scroll"].includes(card.overflowY)), `A filter card enables vertical scrolling for variant ${variant} at ${width}px`);
  assert(metrics.cards.every((card) => !card.internalVerticalOverflow), `A filter card clips content for variant ${variant} at ${width}px`);
  assert(metrics.labels.count > 0 && metrics.labels.clipped.length === 0, `Filter labels are clipped for variant ${variant} at ${width}px`);
  assert(metrics.unitLabels.length > 0 && metrics.unitLabels.every((label) => label && !/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(label)), `A raw unit identifier is visible for variant ${variant} at ${width}px`);
  assert(JSON.stringify(metrics.domOrder) === JSON.stringify(["1. 分野", "2. 単元", "3. 開催回・公開区分", "4. 回答・復習状態"]), `DOM order changed for variant ${variant}`);
  if (variant === "2" && width > 720) {
    assert(metrics.layout2LeftGap >= metrics.rowGap - 1 && metrics.layout2LeftGap <= metrics.rowGap + 2, `Layout 2 left-card gap is ${metrics.layout2LeftGap}px instead of the ${metrics.rowGap}px grid gap at ${width}px`);
  }
}

async function auditScenario(debugOrigin, siteOrigin, variant, width) {
  const targetUrl = `${siteOrigin}${sitePrefix}?screen=fe&tab=practice&filterLayout=${variant}`;
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

    const metrics = await waitForStableApplication(client);
    validateMetrics(metrics, variant, width);
    const screenshot = `layout-${variant}-${width}.png`;
    await captureFullPage(client, join(outputDirectory, screenshot));
    const postScreenshotMetrics = await waitForStableApplication(client, 3);
    validateMetrics(postScreenshotMetrics, variant, width);
    const keyboard = await keyboardCheck(client);

    assert(finalDataStatesMatch(metrics, postScreenshotMetrics), `Final data changed between metrics and screenshot for variant ${variant} at ${width}px`);
    assert(keyboard.toggled, `Keyboard checkbox operation failed for variant ${variant} at ${width}px`);
    assert(consoleMessages.length === 0, `Console warnings or errors occurred for variant ${variant} at ${width}px`);
    assert(failedRequests.length === 0, `Network request failed for variant ${variant} at ${width}px`);

    return { variant, width, screenshot, metrics, postScreenshotMetrics, keyboard, consoleMessages, failedRequests };
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
  const userDataDirectory = await mkdtemp(join(tmpdir(), "jll-fe-filter-"));
  const chrome = spawn(findChrome(), [
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
    for (const variant of variants) {
      for (const width of viewports) scenarios.push(await auditScenario(debugOrigin, siteOrigin, variant, width));
    }

    for (const width of [768, 1280]) {
      const signatures = scenarios
        .filter((scenario) => scenario.width === width)
        .map((scenario) => scenario.metrics.cards.map((card) => `${card.rect.x}:${card.rect.y}:${card.rect.width}`).join("|"));
      assert(new Set(signatures).size === variants.length, `The three layouts are not visually distinct at ${width}px`);
    }

    const buildInfo = JSON.parse(await readFile(join(docsDirectory, "build-info.json"), "utf8"));
    const evidence = {
      status: "passed",
      taskId: "JLL-FE-003",
      sourceRevision: process.env.GITHUB_SHA || buildInfo.sourceRevision || null,
      workflowRunId: process.env.GITHUB_RUN_ID ? Number(process.env.GITHUB_RUN_ID) : null,
      workflowRunNumber: process.env.GITHUB_RUN_NUMBER ? Number(process.env.GITHUB_RUN_NUMBER) : null,
      browser: findChrome(),
      variants,
      viewports,
      expectedMinimums,
      screenshots: scenarios.map((scenario) => scenario.screenshot),
      scenarios,
    };
    await writeFile(join(outputDirectory, "audit.json"), `${JSON.stringify(evidence, null, 2)}\n`);
    await writeFile(join(outputDirectory, "README.md"), `# JLL-FE-003 Browser Evidence\n\n- Status: passed\n- Source revision: \`${evidence.sourceRevision}\`\n- Variants: ${variants.join(", ")}\n- Viewports: ${viewports.join(", ")}px\n- Screenshots: ${evidence.screenshots.join(", ")}\n- Checks: final question-bank and option counts, font readiness, final-data consistency across screenshot capture, independent subject selector, four unchanged filter groups, layout 2 left-card gap, no page overflow, no card scrollbars, full labels, stable DOM order, keyboard checkbox operation, distinct layouts at 768px and 1280px.\n`);
    console.log(`FE filter browser audit passed for ${scenarios.length} scenarios`);
  } catch (error) {
    await writeFile(join(outputDirectory, "failure.json"), `${JSON.stringify({ status: "failed", error: String(error), chromeError }, null, 2)}\n`);
    throw error;
  } finally {
    await new Promise((resolveClose) => server.close(resolveClose));
    await stopChrome(chrome);
    await rm(userDataDirectory, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}

await main();

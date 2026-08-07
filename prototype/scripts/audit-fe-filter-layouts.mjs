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
const expectedMinimums = {
  sourceCount: 1900,
  optionCounts: [3, 20, 20, 4],
};

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

      const body = await readFile(filePath);
      response.writeHead(200, {
        "Cache-Control": "no-store",
        "Content-Type": contentTypes.get(extname(filePath)) || "application/octet-stream",
      });
      response.end(body);
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
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
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
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Browser evaluation failed");
  }
  return result.result?.value;
}

function renderStateExpression() {
  return `(() => {
    const round = (value) => Math.round(value * 10) / 10;
    const cards = [...document.querySelectorAll('.fe-filter-variant-grid > fieldset')];
    const countText = document.querySelector('.source-count')?.textContent || '';
    return {
      ready: document.readyState,
      cards: cards.length,
      subject: Boolean(document.querySelector('.fe-subject-selector')),
      sourceCountText: countText,
      sourceCount: Number.parseInt(countText.replace(/[^0-9]/g, ''), 10) || 0,
      optionCounts: cards.map((card) => card.querySelectorAll('input[type="checkbox"]').length),
      cardRects: cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return [round(rect.x), round(rect.y), round(rect.width), round(rect.height)];
      }),
      layoutMeasured: document.querySelector('.fe-filter-variant-grid')?.dataset.feLayoutMeasured || ''
    };
  })()`;
}

function stateSignature(state) {
  return JSON.stringify({
    sourceCount: state.sourceCount,
    optionCounts: state.optionCounts,
    cardRects: state.cardRects,
    layoutMeasured: state.layoutMeasured,
  });
}

function hasFinalOptionCounts(state) {
  return expectedMinimums.optionCounts.every((minimum, index) => state.optionCounts[index] >= minimum);
}

async function waitForApplication(client) {
  let lastState = null;
  let previousSignature = "";
  let stableSamples = 0;
  let fontsReady = false;

  for (let attempt = 0; attempt < 180; attempt += 1) {
    lastState = await evaluate(client, renderStateExpression());
    const applicationReady = lastState.ready === "complete"
      && lastState.cards === 4
      && lastState.subject
      && lastState.sourceCount >= expectedMinimums.sourceCount
      && hasFinalOptionCounts(lastState)
      && lastState.layoutMeasured === "true";

    if (applicationReady && !fontsReady) {
      await evaluate(client, `(async () => {
        if (document.fonts) await document.fonts.ready;
        return true;
      })()`);
      fontsReady = true;
      previousSignature = "";
      stableSamples = 0;
    }

    if (applicationReady && fontsReady) {
      const signature = stateSignature(lastState);
      stableSamples = signature === previousSignature ? stableSamples + 1 : 1;
      previousSignature = signature;
      if (stableSamples >= 5) return lastState;
    } else {
      previousSignature = "";
      stableSamples = 0;
    }

    await new Promise((resolveDelay) => setTimeout(resolveDelay, 150));
  }
  throw new Error(`Application did not reach a stable final render: ${JSON.stringify(lastState)}`);
}

function metricExpression() {
  return `(() => {
    const round = (value) => Math.round(value * 100) / 100;
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return { x: round(box.x), y: round(box.y), width: round(box.width), height: round(box.height), bottom: round(box.bottom) };
    };
    const root = document.documentElement;
    const subject = document.querySelector('.fe-subject-selector');
    const grid = document.querySelector('.fe-filter-variant-grid');
    const cards = [...grid.querySelectorAll(':scope > fieldset')];
    const labels = [...grid.querySelectorAll('.fe-check-grid-compact label strong')];
    const countText = document.querySelector('.source-count')?.textContent || '';
    const gridStyle = getComputedStyle(grid);
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
      activeVariant: root.dataset.feFilterLayout || null,
      sourceCount: Number.parseInt(countText.replace(/[^0-9]/g, ''), 10) || 0,
      optionCounts: cardMetrics.map((card) => card.optionCount),
      viewport: {
        innerWidth: window.innerWidth,
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        pageHorizontalOverflow: root.scrollWidth > root.clientWidth + 1
      },
      subject: rect(subject),
      grid: rect(grid),
      rowGap: Number.parseFloat(gridStyle.rowGap) || 0,
      layoutMeasured: grid.dataset.feLayoutMeasured || '',
      layoutExtraSpace: gridStyle.getPropertyValue('--fe-filter-layout-2-extra-space').trim() || '0px',
      subjectIndependent: subject.getBoundingClientRect().bottom <= grid.getBoundingClientRect().top,
      cardCount: cards.length,
      cards: cardMetrics,
      cardsContainedByGrid: cardMetrics.every((card) => card.rect.bottom <= grid.getBoundingClientRect().bottom + 1),
      layout2LeftGap: cards.length === 4 ? round(cards[3].getBoundingClientRect().top - cards[0].getBoundingClientRect().bottom) : null,
      labels: {
        count: labels.length,
        clipped: labels.filter((label) => {
          const style = getComputedStyle(label);
          return style.textOverflow === 'ellipsis' || style.whiteSpace === 'nowrap' || label.scrollWidth > label.clientWidth + 1;
        }).map((label) => label.textContent?.trim() || '')
      },
      domOrder: cards.map((card) => card.querySelector('legend')?.textContent?.trim() || ''),
      unitLabels: [...cards[1].querySelectorAll('label strong')].map((label) => label.textContent?.trim() || ''),
      unitValues: [...cards[1].querySelectorAll('label input')].map((input) => input.value || '')
    };
  })()`;
}

function metricsRenderSignature(metrics) {
  return JSON.stringify({
    sourceCount: metrics.sourceCount,
    optionCounts: metrics.optionCounts,
    cards: metrics.cards.map((card) => card.rect),
    grid: metrics.grid,
    layoutExtraSpace: metrics.layoutExtraSpace,
  });
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
      if (message.method === "Runtime.consoleAPICalled" && ["error", "warning"].includes(message.params.type)) {
        consoleMessages.push(message.params.type);
      }
      if (message.method === "Network.loadingFailed" && !message.params.canceled) {
        failedRequests.push(message.params.errorText);
      }
    });
    await client.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 900,
      deviceScaleFactor: 1,
      mobile: width <= 430,
    });
    await client.send("Page.navigate", { url: targetUrl });
    const stableState = await waitForApplication(client);
    const metrics = await evaluate(client, metricExpression());

    const screenshot = `layout-${variant}-${width}.png`;
    await captureFullPage(client, join(outputDirectory, screenshot));
    const postScreenshotMetrics = await evaluate(client, metricExpression());
    const keyboard = await keyboardCheck(client);

    assert(metricsRenderSignature(metrics) === metricsRenderSignature(postScreenshotMetrics), `Render changed between metrics and screenshot for variant ${variant} at ${width}px`);
    assert(metrics.activeVariant === variant, `Variant ${variant} did not activate at ${width}px`);
    assert(metrics.cardCount === 4, `Variant ${variant} has ${metrics.cardCount} filter cards at ${width}px`);
    assert(metrics.sourceCount >= expectedMinimums.sourceCount, `Question bank did not finish loading for variant ${variant} at ${width}px`);
    assert(hasFinalOptionCounts({ optionCounts: metrics.optionCounts }), `Final filter option counts were not loaded for variant ${variant} at ${width}px`);
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
    assert(keyboard.toggled, `Keyboard checkbox operation failed for variant ${variant} at ${width}px`);
    assert(consoleMessages.length === 0, `Console warnings or errors occurred for variant ${variant} at ${width}px`);
    assert(failedRequests.length === 0, `Network request failed for variant ${variant} at ${width}px`);

    return { variant, width, screenshot, stableState, metrics, postScreenshotMetrics, keyboard, consoleMessages, failedRequests };
  } finally {
    client.close();
    await fetch(`${debugOrigin}/json/close/${target.id}`, { method: "PUT" }).catch(() => {});
  }
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
      for (const width of viewports) {
        scenarios.push(await auditScenario(debugOrigin, siteOrigin, variant, width));
      }
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
    await writeFile(join(outputDirectory, "README.md"), `# JLL-FE-003 Browser Evidence\n\n- Status: passed\n- Source revision: \`${evidence.sourceRevision}\`\n- Variants: ${variants.join(", ")}\n- Viewports: ${viewports.join(", ")}px\n- Screenshots: ${evidence.screenshots.join(", ")}\n- Checks: final question-bank and option counts, font readiness, identical metric/screenshot render state, independent subject selector, four unchanged filter groups, layout 2 left-card gap, no page overflow, no card scrollbars, full labels, stable DOM order, keyboard checkbox operation, distinct layouts at 768px and 1280px.\n`);
    console.log(`FE filter browser audit passed for ${scenarios.length} scenarios`);
  } catch (error) {
    await writeFile(join(outputDirectory, "failure.json"), `${JSON.stringify({ status: "failed", error: String(error), chromeError }, null, 2)}\n`);
    throw error;
  } finally {
    chrome.kill("SIGTERM");
    await new Promise((resolveClose) => server.close(resolveClose));
    await rm(userDataDirectory, { recursive: true, force: true });
  }
}

await main();

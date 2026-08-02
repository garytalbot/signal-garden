#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const repoRoot = new URL('..', import.meta.url);
const chromeBin = process.env.CHROME_BIN || 'google-chrome-stable';
const smokeAttempts = Number(process.env.RESIDUE_SMOKE_ATTEMPTS || 3);
const smokeRetryDelayMs = Number(process.env.RESIDUE_SMOKE_RETRY_DELAY_MS || 500);

function encodeBase64Url(text) {
  return Buffer.from(String(text), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function pickPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close((closeError) => {
        if (closeError) reject(closeError);
        else resolve(port);
      });
    });
  });
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else {
        const error = new Error(`${command} exited with code ${code}\n${stderr || stdout}`);
        error.code = code;
        reject(error);
      }
    });
  });
}

async function waitForHttp(url, timeoutMs = 10_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return response;
    } catch {
      // Keep polling until the server is ready.
    }
    await delay(200);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function waitForProcessClose(child, timeoutMs = 10_000) {
  return new Promise((resolve, reject) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve();
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error('Timed out waiting for child process to exit'));
    }, timeoutMs);

    child.once('close', () => {
      clearTimeout(timer);
      resolve();
    });
    child.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

const required = [
  'shared residue',
  'copy residue link',
  'share residue card',
];

async function startServer() {
  const port = await pickPort();
  const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
    cwd: repoRoot.pathname,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const serverError = [];
  let serverFailure = null;
  server.stderr.on('data', (chunk) => {
    serverError.push(chunk.toString());
  });
  server.once('error', (error) => {
    serverFailure = error;
  });

  let serverReady = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (serverFailure) {
      server.kill('SIGTERM');
      throw serverFailure;
    }
    try {
      const probe = await run('curl', ['-fsS', `http://127.0.0.1:${port}/pollen-atlas/`]);
      if (probe.stdout.length >= 0) {
        serverReady = true;
        break;
      }
    } catch {
      await delay(200);
    }
  }

  if (!serverReady) {
    server.kill('SIGTERM');
    throw new Error(`local server never became ready on port ${port}: ${serverError.join('')}`);
  }

  return { port, server };
}

async function runSmokeOnce(attempt) {
  const { port, server } = await startServer();
  const chromePort = await pickPort();
  const userDataDir = await mkdtemp(path.join(os.tmpdir(), 'signal-garden-residue-smoke-'));
  const downloadDir = await mkdtemp(path.join(os.tmpdir(), 'signal-garden-residue-downloads-'));
  const chrome = spawn(chromeBin, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--remote-debugging-address=127.0.0.1',
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    await waitForHttp(`http://127.0.0.1:${chromePort}/json/version`, 15_000);
    const versionResponse = await fetch(`http://127.0.0.1:${chromePort}/json/version`, { cache: 'no-store' });
    const version = await versionResponse.json();

    const pages = await fetch(`http://127.0.0.1:${chromePort}/json/list`, { cache: 'no-store' }).then((response) => response.json());
    const pageTarget = pages.find((entry) => entry.type === 'page');
    if (!pageTarget) {
      throw new Error('Chrome did not expose a page target');
    }

    const page = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      page.addEventListener('open', resolve, { once: true });
      page.addEventListener('error', reject, { once: true });
    });

    let messageId = 0;
    const pending = new Map();
    const eventWaiters = new Map();
    page.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (Object.prototype.hasOwnProperty.call(message, 'id')) {
        const entry = pending.get(message.id);
        if (!entry) return;
        pending.delete(message.id);
        if (message.error) entry.reject(new Error(message.error.message || 'CDP command failed'));
        else entry.resolve(message.result || {});
        return;
      }

      const listeners = eventWaiters.get(message.method);
      if (listeners && listeners.length) {
        eventWaiters.set(message.method, listeners.filter((resolve) => {
          resolve(message.params || {});
          return false;
        }));
      }
    });

    page.addEventListener('close', () => {
      const error = new Error('Chrome page socket closed unexpectedly');
      for (const entry of pending.values()) entry.reject(error);
      pending.clear();
      eventWaiters.clear();
    });

    async function send(method, params = {}) {
      const id = ++messageId;
      page.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    }

    function once(method, timeoutMs = 10_000) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          const listeners = eventWaiters.get(method) || [];
          eventWaiters.set(method, listeners.filter((listener) => listener !== onEvent));
          reject(new Error(`Timed out waiting for CDP event ${method}`));
        }, timeoutMs);

        function onEvent(params) {
          clearTimeout(timer);
          resolve(params);
        }

        const listeners = eventWaiters.get(method) || [];
        listeners.push(onEvent);
        eventWaiters.set(method, listeners);
      });
    }

    async function evalExpression(expression) {
      const result = await send('Runtime.evaluate', {
        expression,
        returnByValue: true,
        awaitPromise: true,
        userGesture: true,
      });
      if (result.exceptionDetails) {
        throw new Error(`CDP evaluation failed: ${result.exceptionDetails.text || 'unknown error'}`);
      }
      return result.result?.value;
    }

    async function waitForDownloadedSvg(prefix, timeoutMs = 10_000) {
      const startedAt = Date.now();
      let lastSeenFile = null;

      while (Date.now() - startedAt < timeoutMs) {
        const entries = await readdir(downloadDir, { withFileTypes: true });
        const candidates = entries
          .filter((entry) => entry.isFile() && entry.name.startsWith(prefix) && entry.name.endsWith('.svg'))
          .map((entry) => entry.name)
          .sort();

        if (candidates.length > 0) {
          const fileName = candidates[candidates.length - 1];
          const filePath = path.join(downloadDir, fileName);
          const fileStat = await stat(filePath);
          if (fileStat.size > 0 && fileName === lastSeenFile) {
            const contents = await readFile(filePath, 'utf8');
            return { fileName, filePath, contents };
          }
          lastSeenFile = fileName;
        }

        await delay(200);
      }

      throw new Error(`Timed out waiting for a downloaded SVG with prefix ${prefix}`);
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');
    await send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: downloadDir });
    const initialLoad = once('Page.loadEventFired');
    await send('Page.navigate', { url: `http://127.0.0.1:${port}/afterimage/` });
    await initialLoad;

    const initialButtonState = await evalExpression(`(() => {
      const button = document.getElementById('openAtlasBtn');
      const exportButton = document.getElementById('exportBtn');
      const shareButton = document.getElementById('shareBtn');
      const copyResidueLinkButton = document.getElementById('copyResidueLinkBtn');
      return {
        text: button?.textContent || '',
        disabled: Boolean(button?.disabled),
        exportDisabled: Boolean(exportButton?.disabled),
        shareDisabled: Boolean(shareButton?.disabled),
        copyResidueLinkDisabled: Boolean(copyResidueLinkButton?.disabled),
      };
    })()`);
    const paletteName = await evalExpression(`document.getElementById('paletteLabel')?.textContent || ''`);

    if (initialButtonState.text !== 'open atlas' || initialButtonState.disabled !== true || initialButtonState.exportDisabled !== true || initialButtonState.shareDisabled !== true || initialButtonState.copyResidueLinkDisabled !== true) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; initial afterimage handoff state was ${JSON.stringify(initialButtonState)}`);
    }

    await evalExpression(`(() => {
      document.getElementById('captureBtn')?.click();
    })()`);

    const handoffState = await evalExpression(`(() => {
      const button = document.getElementById('openAtlasBtn');
      const exportButton = document.getElementById('exportBtn');
      const shareButton = document.getElementById('shareBtn');
      const copyResidueLinkButton = document.getElementById('copyResidueLinkBtn');
      const status = document.getElementById('shareStatus');
      return {
        text: button?.textContent || '',
        disabled: Boolean(button?.disabled),
        exportDisabled: Boolean(exportButton?.disabled),
        shareDisabled: Boolean(shareButton?.disabled),
        copyResidueLinkDisabled: Boolean(copyResidueLinkButton?.disabled),
        status: status?.textContent || '',
      };
    })()`);

    const expectedResidueName = `${paletteName} residue`;

    if (handoffState.text !== `open ${expectedResidueName}` || handoffState.disabled !== false || handoffState.exportDisabled !== false || handoffState.shareDisabled !== false || handoffState.copyResidueLinkDisabled !== false) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; afterimage handoff state was ${JSON.stringify(handoffState)}`);
    }

    await evalExpression(`(() => {
      document.getElementById('exportBtn')?.click();
    })()`);

    const expectedDownloadPrefix = `signal-garden-afterimage-${paletteName}-`;
    const downloadedPostcard = await waitForDownloadedSvg(expectedDownloadPrefix);
    const exportState = await evalExpression(`(() => {
      const status = document.getElementById('shareStatus');
      const exportButton = document.getElementById('exportBtn');
      return {
        status: status?.textContent || '',
        exportText: exportButton?.textContent || '',
        exportDisabled: Boolean(exportButton?.disabled),
      };
    })()`);

    if (exportState.exportText !== 'export postcard' || exportState.exportDisabled !== false) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; export button state was ${JSON.stringify(exportState)}`);
    }

    if (!exportState.status.includes('Residue postcard exported as an SVG.')) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; export state was ${JSON.stringify(exportState)}`);
    }

    if (!downloadedPostcard.contents.includes('<title id="title">Signal Garden afterimage postcard</title>')) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; downloaded postcard contents were missing the postcard title: ${downloadedPostcard.fileName}`);
    }

    if (!downloadedPostcard.contents.includes(expectedResidueName)) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; downloaded postcard contents were missing ${expectedResidueName}: ${downloadedPostcard.fileName}`);
    }

    await evalExpression(`(() => {
      window.__sharePayload = null;
      window.__shareCalls = 0;
      Object.defineProperty(navigator, 'canShare', {
        configurable: true,
        value: () => true,
      });
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: async (payload) => {
          window.__shareCalls += 1;
          window.__sharePayload = {
            title: payload.title,
            text: payload.text,
            url: payload.url,
            files: Array.isArray(payload.files)
              ? payload.files.map((file) => ({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                }))
              : [],
          };
        },
      });
    })()`);

    await evalExpression(`(() => {
      document.getElementById('shareBtn')?.click();
    })()`);

    let shareState = null;
    for (let shareAttempt = 0; shareAttempt < 30; shareAttempt += 1) {
      shareState = await evalExpression(`(() => ({
        status: document.getElementById('shareStatus')?.textContent || '',
        shareText: document.getElementById('shareBtn')?.textContent || '',
        payload: window.__sharePayload,
        calls: window.__shareCalls || 0,
      }))()`);
      if (shareState?.payload) break;
      await delay(100);
    }

    if (!shareState?.payload) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share postcard never invoked native share: ${JSON.stringify(shareState)}`);
    }

    const { payload: sharePayload } = shareState;
    if (shareState.calls !== 1) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share postcard invoked native share ${shareState.calls} times`);
    }

    if (sharePayload.title !== 'Signal Garden afterimage postcard') {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share postcard title was ${JSON.stringify(sharePayload.title)}`);
    }

    if (!sharePayload.text.includes(`Pressed ${expectedResidueName} into a Signal Garden residue postcard.`)) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share postcard text was ${JSON.stringify(sharePayload.text)}`);
    }

    if (!sharePayload.url.includes('/pollen-atlas/#residue=')) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share postcard url was ${JSON.stringify(sharePayload.url)}`);
    }

    if (!Array.isArray(sharePayload.files) || sharePayload.files.length !== 1) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share postcard files were ${JSON.stringify(sharePayload.files)}`);
    }

    if (sharePayload.files[0].type !== 'image/svg+xml') {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share postcard file type was ${JSON.stringify(sharePayload.files[0].type)}`);
    }

    if (!sharePayload.files[0].name.startsWith(`signal-garden-afterimage-${paletteName}-`) || !sharePayload.files[0].name.endsWith('.svg')) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share postcard file name was ${JSON.stringify(sharePayload.files[0].name)}`);
    }

    if (!shareState.status.includes('Residue postcard shared.')) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; share status was ${JSON.stringify(shareState.status)}`);
    }

    const residueLoad = once('Page.loadEventFired');
    await evalExpression(`(() => {
      document.getElementById('openAtlasBtn')?.click();
    })()`);
    await residueLoad;

    const atlasState = await evalExpression(`(() => {
      const text = document.body.textContent || '';
      return {
        text,
        residueCount: document.getElementById('residueCount')?.textContent || '',
      };
    })()`);

    if (Number(atlasState.residueCount) < 1) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; expected residueCount to be at least 1 but saw ${JSON.stringify(atlasState.residueCount)}`);
    }

    const atlasRequired = [
      `Opened a residue link for ${expectedResidueName}. The card is now pinned in the tray.`,
      ...required,
    ];
    const missing = atlasRequired.filter((needle) => !atlasState.text.includes(needle));
    if (missing.length) {
      throw new Error(`residue smoke test failed on attempt ${attempt}; missing markers: ${missing.join(', ')}`);
    }
  } finally {
    server.kill('SIGTERM');
    chrome.kill('SIGTERM');
    await waitForProcessClose(chrome, 10_000).catch(() => chrome.kill('SIGKILL'));
    await waitForProcessClose(chrome, 10_000).catch(() => {});
    await rm(userDataDir, { recursive: true, force: true });
    await rm(downloadDir, { recursive: true, force: true });
  }
}

let lastError = null;
let passed = false;
for (let attempt = 1; attempt <= smokeAttempts; attempt += 1) {
  try {
    await runSmokeOnce(attempt);
    passed = true;
    break;
  } catch (error) {
    lastError = error;
    if (attempt < smokeAttempts) {
      await delay(smokeRetryDelayMs);
      continue;
    }
  }
}

if (passed) {
  process.stdout.write('residue smoke test passed\n');
} else {
  throw lastError;
}

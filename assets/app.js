const stage = document.getElementById('stage');
const signalOverlay = document.getElementById('signal-overlay');
const template = document.getElementById('bloom-template');
const countEl = document.getElementById('count');
const moodEl = document.getElementById('mood');
const lastNameEl = document.getElementById('lastName');
const sourceLabelEl = document.getElementById('sourceLabel');
const randomizeBtn = document.getElementById('randomize');
const dailySignalBtn = document.getElementById('dailySignal');
const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clear');
const hintEl = document.getElementById('hint');
const previewEl = document.getElementById('preview');
const fieldLogEl = document.getElementById('fieldLog');
const logStatusEl = document.getElementById('logStatus');
const archiveGridEl = document.getElementById('archiveGrid');
const archiveStatusEl = document.getElementById('archiveStatus');
const copyLinkBtn = document.getElementById('copyLink');
const replayBtn = document.getElementById('replay');
const exportPngBtn = document.getElementById('exportPng');

const adjectives = ['velvet', 'neon', 'hollow', 'lunar', 'midnight', 'feral', 'opal', 'echo', 'solar', 'ghost'];
const nouns = ['orchid', 'signal', 'lantern', 'murmur', 'crown', 'spire', 'feather', 'petal', 'relic', 'flare'];
const moods = ['violet hush', 'teal static', 'rose voltage', 'amber drift', 'ion mist', 'midnight bloom'];
const accents = ['#9d7bff', '#55e6ff', '#ff6ec7', '#7cff8f', '#ffd166', '#7ee7ff'];
const transmissions = {
  first: [
    'The field wakes up. {name} hums like a vending machine seeing god.',
    '{name} arrives first and immediately acts like it owns the zip code.',
    'First contact logged: {name}. Extremely polite for something this radiant.',
  ],
  regular: [
    '{name} plants cleanly. The air now tastes faintly of static peaches.',
    '{name} joins the garden and the horizon develops opinions.',
    '{name} settles in. Nearby darkness becomes lightly ceremonial.',
    '{name} blooms without paperwork. Strong showing.',
  ],
  linked: [
    '{name} answers the last signal. A thin line of gossip passes through the field.',
    '{name} links up and the garden briefly behaves like a conspiracy board.',
    '{name} catches the previous bloom whispering and decides to stay.',
  ],
  crowded: [
    'Density rising. {name} squeezes in and the garden starts looking like a tiny nightclub for moths.',
    '{name} lands in a crowded patch. Absolute banquet energy.',
    '{name} joins the cluster and the field becomes suspiciously glamorous.',
  ],
  milestone: [
    'Milestone reached: {count} blooms. The garden now has enough signals to start a minor religion.',
    '{count} blooms on record. This is no longer landscaping. This is weather.',
    'Field note {count}: the garden has crossed into full midnight pageant territory.',
  ],
  cluster: [
    'Cluster planted near ({x}, {y}). Somebody gave the cosmos a sticker pack.',
    'Dense burst recorded around ({x}, {y}). The soil is absolutely freelancing now.',
    'Cluster event logged at ({x}, {y}). Very strong “parking lot carnival in space” energy.',
  ],
  undo: [
    '{name} was gently recalled. The field pretends this was mutual.',
    'Undo logged. {name} has left the chat but not the legend.',
    '{name} fades out. The remaining blooms refuse to comment.',
  ],
  clear: [
    'Field reset complete. Nothing remains except potential and a suspicious breeze.',
    'All signals cleared. The garden is empty again, like a mall fountain at dawn.',
    'Reset logged. The night has been folded neatly and put back on the shelf.',
  ],
  share: [
    'Garden link copied. The field has been folded into a postcard for the internet.',
    'Share link secured. Tiny glowing propaganda is now portable.',
    'Permalink copied. The night fits in a pocket now.',
  ],
  loaded: [
    'Shared garden received. The field just reopened somebody else\'s weird little constellation.',
    'Garden restored from link. Extremely strong haunted sticker book energy.',
    'Replay code accepted. The blooms have returned with zero humility.',
  ],
  daily: [
    'Daily signal tuned for {date}. Everybody gets the same weird weather until UTC rolls over.',
    'Broadcast locked to {date}. Shared hallucination, very tidy.',
    'Public signal received for {date}. The field is on community radio now.',
  ],
  replay: [
    'Replay started. The field is re-performing its favorite rumors.',
    'Garden replaying now. Like fireworks with emotional baggage.',
    'Replay engaged. The blooms are doing the encore nobody asked for but everybody needed.',
  ],
};

const MAX_BLOOMS = 60;
const CANONICAL_STAGE_WIDTH = 1000;
const CANONICAL_STAGE_HEIGHT = 680;
const ARCHIVE_DAYS = 12;
const ARCHIVE_PREVIEW_WIDTH = 320;
const ARCHIVE_PREVIEW_HEIGHT = 240;
const BROADCAST_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

let bloomCount = 0;
let previousBloomPoint = null;
let previewVisible = false;
let bloomHistory = [];
let replayTimers = [];
let shareToastTimer = null;
let exportToastTimer = null;
let suppressHashSync = false;
let hashMode = 'garden';
let fieldSourceMode = 'open';
let currentBroadcastKey = null;

function rand(min, max, randomFn = Math.random) {
  return randomFn() * (max - min) + min;
}

function pick(items, randomFn = Math.random) {
  return items[Math.floor(randomFn() * items.length)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shiftUtcDate(date, offsetDays) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + offsetDays);
  return shifted;
}

function formatBroadcastDate(key) {
  const date = new Date(`${key}T00:00:00Z`);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function getRecentBroadcastKeys(total = ARCHIVE_DAYS, fromDate = new Date()) {
  return Array.from({ length: total }, (_, index) => getUtcDateKey(shiftUtcDate(fromDate, -index)));
}

function clearReplayTimers() {
  replayTimers.forEach((timer) => window.clearTimeout(timer));
  replayTimers = [];
}

function makeNameFromIndexes(adjectiveIndex, nounIndex) {
  return `${adjectives[adjectiveIndex]} ${nouns[nounIndex]}`;
}

function makeName() {
  return makeNameFromIndexes(
    Math.floor(rand(0, adjectives.length)),
    Math.floor(rand(0, nouns.length))
  );
}

function chooseMoodFromSpec(spec) {
  return moods[(spec.adjectiveIndex * 3 + spec.nounIndex + spec.accentIndex) % moods.length];
}

function setMood(nextMood = pick(moods)) {
  moodEl.textContent = nextMood;
}

function stampTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function logField(message, status = 'recording strange botany') {
  const item = document.createElement('li');
  const time = document.createElement('span');
  const copy = document.createElement('span');

  time.className = 'log-time';
  time.textContent = stampTime();
  copy.className = 'log-copy';
  copy.textContent = message;

  item.append(time, copy);
  fieldLogEl.prepend(item);

  while (fieldLogEl.children.length > 6) {
    fieldLogEl.lastElementChild?.remove();
  }

  logStatusEl.textContent = status;
}

function choosePlantTransmission(name, hadLink, x, y) {
  const crowding = Array.from(stage.querySelectorAll('.bloom')).filter((bloom) => {
    const bloomX = parseFloat(bloom.style.left);
    const bloomY = parseFloat(bloom.style.top);
    return Math.hypot(bloomX - x, bloomY - y) < 120;
  }).length;

  if (bloomCount === 0) {
    return pick(transmissions.first).replace('{name}', name);
  }

  if ((bloomCount + 1) % 5 === 0) {
    return pick(transmissions.milestone).replace('{count}', String(bloomCount + 1));
  }

  if (crowding >= 3) {
    return pick(transmissions.crowded).replace('{name}', name);
  }

  if (hadLink) {
    return pick(transmissions.linked).replace('{name}', name);
  }

  return pick(transmissions.regular).replace('{name}', name);
}

function updateFieldSourceLabel() {
  if (fieldSourceMode === 'broadcast' && currentBroadcastKey) {
    sourceLabelEl.textContent = `daily signal • ${currentBroadcastKey}`;
    return;
  }

  if (fieldSourceMode === 'shared') {
    sourceLabelEl.textContent = 'shared permalink';
    return;
  }

  sourceLabelEl.textContent = 'open field';
}

function setFieldSource(mode = 'open', broadcastKey = null) {
  fieldSourceMode = mode;
  currentBroadcastKey = mode === 'broadcast' ? broadcastKey : null;
  updateFieldSourceLabel();
  syncArchiveSelection();
  syncArchiveStatus();
}

function syncControls() {
  const disabled = bloomCount === 0;
  undoBtn.disabled = disabled;
  clearBtn.disabled = disabled;
  replayBtn.disabled = disabled;
  copyLinkBtn.disabled = disabled;
  exportPngBtn.disabled = disabled;

  if (disabled) stage.setAttribute('data-empty', 'true');
  else stage.removeAttribute('data-empty');

  hintEl.textContent = disabled
    ? 'Move your cursor to aim a bloom. Click to plant. Press U to undo.'
    : 'Click to plant. Press U to undo the last bloom. Copy link to share this exact garden.';
}

function updatePreview(x, y) {
  previewEl.style.left = `${x}px`;
  previewEl.style.top = `${y}px`;
}

function showPreview() {
  previewVisible = true;
  stage.classList.add('show-preview');
}

function hidePreview() {
  previewVisible = false;
  stage.classList.remove('show-preview');
}

function drawSignalLink(from, to, accent) {
  if (!from || !to) return;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', from.x.toFixed(1));
  line.setAttribute('y1', from.y.toFixed(1));
  line.setAttribute('x2', to.x.toFixed(1));
  line.setAttribute('y2', to.y.toFixed(1));
  line.classList.add('signal-line');
  line.style.setProperty('--accent', accent);
  signalOverlay.appendChild(line);
  window.setTimeout(() => line.remove(), 2400);
}

function round1(value) {
  return Number(value.toFixed(1));
}

function makeBloomSpec(x, y, randomFn = Math.random) {
  const adjectiveIndex = Math.floor(rand(0, adjectives.length, randomFn));
  const nounIndex = Math.floor(rand(0, nouns.length, randomFn));
  const accentIndex = Math.floor(rand(0, accents.length, randomFn));

  return {
    x: round1(x),
    y: round1(y),
    adjectiveIndex,
    nounIndex,
    accentIndex,
    stemHeight: Math.round(rand(48, 110, randomFn)),
    ringA: Math.round(rand(44, 90, randomFn)),
    ringB: Math.round(rand(80, 128, randomFn)),
    tilt: round1(rand(-40, 40, randomFn)),
  };
}

function renderBloom(spec, options = {}) {
  const { logPlant = true, syncUrl = true, animateLink = true } = options;
  const node = template.content.firstElementChild.cloneNode(true);
  const name = makeNameFromIndexes(spec.adjectiveIndex, spec.nounIndex);
  const accent = accents[spec.accentIndex] ?? accents[0];
  const hadLink = Boolean(previousBloomPoint);

  node.style.left = `${spec.x}px`;
  node.style.top = `${spec.y}px`;
  node.style.setProperty('--accent', accent);
  node.style.setProperty('--stem-height', `${spec.stemHeight}px`);
  node.style.setProperty('--ring-a', `${spec.ringA}px`);
  node.style.setProperty('--ring-b', `${spec.ringB}px`);
  node.style.setProperty('--tilt', `${spec.tilt}deg`);
  node.querySelector('.label').textContent = name;

  if (animateLink) {
    drawSignalLink(previousBloomPoint, { x: spec.x, y: spec.y }, accent);
  }
  previousBloomPoint = { x: spec.x, y: spec.y };

  stage.appendChild(node);
  bloomHistory.push(spec);
  bloomCount += 1;
  countEl.textContent = String(bloomCount);
  lastNameEl.textContent = name;
  setMood(chooseMoodFromSpec(spec));

  if (logPlant) {
    logField(choosePlantTransmission(name, hadLink, spec.x, spec.y), `tracking ${bloomCount} bloom${bloomCount === 1 ? '' : 's'}`);
  }

  if (bloomCount > MAX_BLOOMS) {
    stage.querySelector('.bloom')?.remove();
    bloomHistory.shift();
    bloomCount -= 1;
    countEl.textContent = String(bloomCount);
    previousBloomPoint = bloomHistory.length
      ? { x: bloomHistory[bloomHistory.length - 1].x, y: bloomHistory[bloomHistory.length - 1].y }
      : null;
    logField('Archive limit reached. The oldest signal was quietly retired to keep the field breathable.', 'rolling archive active');
  }

  syncControls();
  syncArchiveStatus();
  if (syncUrl) syncShareState();
}

function plant(x, y, options = {}) {
  renderBloom(makeBloomSpec(x, y), options);
}

function encodeBloom(spec) {
  return [
    Math.round(spec.x * 10).toString(36),
    Math.round(spec.y * 10).toString(36),
    spec.adjectiveIndex.toString(36),
    spec.nounIndex.toString(36),
    spec.accentIndex.toString(36),
    spec.stemHeight.toString(36),
    spec.ringA.toString(36),
    spec.ringB.toString(36),
    Math.round((spec.tilt + 40) * 10).toString(36),
  ].join('.');
}

function decodeBloom(chunk) {
  const parts = chunk.split('.');
  if (parts.length !== 9) return null;

  const [x, y, adjectiveIndex, nounIndex, accentIndex, stemHeight, ringA, ringB, tilt] = parts.map((part) => parseInt(part, 36));
  if ([x, y, adjectiveIndex, nounIndex, accentIndex, stemHeight, ringA, ringB, tilt].some(Number.isNaN)) return null;
  if (adjectiveIndex < 0 || adjectiveIndex >= adjectives.length) return null;
  if (nounIndex < 0 || nounIndex >= nouns.length) return null;
  if (accentIndex < 0 || accentIndex >= accents.length) return null;

  return {
    x: x / 10,
    y: y / 10,
    adjectiveIndex,
    nounIndex,
    accentIndex,
    stemHeight,
    ringA,
    ringB,
    tilt: tilt / 10 - 40,
  };
}

function getBaseUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function getBroadcastUrl(key) {
  return `${getBaseUrl()}#broadcast=${key}`;
}

function makeShareUrl() {
  const base = getBaseUrl();
  if (hashMode === 'broadcast' && currentBroadcastKey) {
    return getBroadcastUrl(currentBroadcastKey);
  }
  if (!bloomHistory.length) return base;
  return `${base}#garden=${bloomHistory.map(encodeBloom).join('~')}`;
}

function syncShareState() {
  if (suppressHashSync) return;

  let nextHash = '';
  if (hashMode === 'broadcast' && currentBroadcastKey) {
    nextHash = `broadcast=${currentBroadcastKey}`;
  } else if (bloomHistory.length) {
    nextHash = `garden=${bloomHistory.map(encodeBloom).join('~')}`;
  }

  const nextUrl = nextHash ? `${window.location.pathname}#${nextHash}` : window.location.pathname;
  history.replaceState(null, '', nextUrl);
}

function resetField({ logMessage = null, status = 'awaiting first contact', keepLogs = false, syncUrl = true, mood = true } = {}) {
  clearReplayTimers();
  stage.querySelectorAll('.bloom').forEach((bloom) => bloom.remove());
  signalOverlay.innerHTML = '';
  previousBloomPoint = null;
  bloomCount = 0;
  bloomHistory = [];
  countEl.textContent = '0';
  lastNameEl.textContent = 'none yet';
  if (!keepLogs) fieldLogEl.innerHTML = '';
  if (logMessage) logField(logMessage, status);
  if (mood) setMood();
  syncControls();
  syncArchiveStatus();
  if (syncUrl) syncShareState();
}

function setOpenFieldMode() {
  hashMode = 'garden';
  setFieldSource('open');
}

function prepareEditableField() {
  suppressHashSync = false;
  clearReplayTimers();
  if (fieldSourceMode !== 'open' || hashMode !== 'garden' || currentBroadcastKey) {
    setOpenFieldMode();
  }
}

function undoLastBloom() {
  const blooms = stage.querySelectorAll('.bloom');
  const latestBloom = blooms[blooms.length - 1];
  if (!latestBloom) return;

  const removedName = latestBloom.querySelector('.label')?.textContent ?? 'that bloom';
  latestBloom.remove();
  bloomHistory.pop();
  bloomCount = Math.max(0, bloomCount - 1);
  countEl.textContent = String(bloomCount);

  const remainingBlooms = stage.querySelectorAll('.bloom');
  const nextLastBloom = remainingBlooms[remainingBlooms.length - 1];
  lastNameEl.textContent = nextLastBloom?.querySelector('.label')?.textContent ?? 'none yet';

  if (bloomHistory.length) {
    const lastSpec = bloomHistory[bloomHistory.length - 1];
    previousBloomPoint = { x: lastSpec.x, y: lastSpec.y };
    setMood(chooseMoodFromSpec(lastSpec));
  } else {
    previousBloomPoint = null;
    signalOverlay.innerHTML = '';
    setMood();
  }

  logField(pick(transmissions.undo).replace('{name}', removedName), bloomCount === 0 ? 'field standing by' : `tracking ${bloomCount} bloom${bloomCount === 1 ? '' : 's'}`);
  syncControls();
  syncArchiveStatus();
  syncShareState();
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function buildExportSvg() {
  const rect = stage.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width));
  const height = Math.max(1, Math.round(rect.height));
  const mood = escapeXml(moodEl.textContent || 'violet hush');

  const links = bloomHistory.slice(1).map((spec, index) => {
    const previous = bloomHistory[index];
    const accent = accents[spec.accentIndex] ?? accents[0];
    return `<line x1="${previous.x}" y1="${previous.y}" x2="${spec.x}" y2="${spec.y}" stroke="${accent}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="6 10" opacity="0.5"/>`;
  }).join('');

  const blooms = bloomHistory.map((spec) => {
    const accent = accents[spec.accentIndex] ?? accents[0];
    const name = escapeXml(makeNameFromIndexes(spec.adjectiveIndex, spec.nounIndex));
    const centerY = spec.y - spec.stemHeight;
    const ringAWidth = spec.ringA;
    const ringAHeight = Math.round(spec.ringA * 0.72);
    const ringBWidth = spec.ringB;
    const ringBHeight = Math.round(spec.ringB * 0.5);
    const sparkAX = spec.x + spec.ringA * 0.45;
    const sparkAY = centerY - 8;
    const sparkBX = spec.x - spec.ringA * 0.4;
    const sparkBY = centerY + 10;

    return `
      <g>
        <line x1="${spec.x}" y1="${spec.y - 12}" x2="${spec.x}" y2="${centerY}" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.9"/>
        <ellipse cx="${spec.x}" cy="${centerY}" rx="${ringAWidth / 2}" ry="${ringAHeight / 2}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.72" transform="rotate(${spec.tilt} ${spec.x} ${centerY})"/>
        <ellipse cx="${spec.x}" cy="${centerY}" rx="${ringBWidth / 2}" ry="${ringBHeight / 2}" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="5 6" opacity="0.52" transform="rotate(${spec.tilt * -1.4} ${spec.x} ${centerY})"/>
        <circle cx="${spec.x}" cy="${centerY}" r="11" fill="url(#coreGlow-${spec.accentIndex})"/>
        <circle cx="${sparkAX}" cy="${sparkAY}" r="5" fill="${accent}" opacity="0.9"/>
        <circle cx="${sparkBX}" cy="${sparkBY}" r="5" fill="${accent}" opacity="0.82"/>
        <text x="${spec.x}" y="${spec.y + 8}" text-anchor="middle" fill="#ebf5ff" font-size="12" font-family="Inter, system-ui, sans-serif">${name}</text>
      </g>
    `;
  }).join('');

  const moodLabel = bloomHistory.length
    ? `<text x="24" y="36" fill="#bcefff" font-size="14" font-family="Inter, system-ui, sans-serif" letter-spacing="2">${mood.toUpperCase()}</text>`
    : '<text x="24" y="36" fill="#ebf5ff" fill-opacity="0.6" font-size="14" font-family="Inter, system-ui, sans-serif">Your garden is empty. Plant the first signal.</text>';

  return {
    width,
    height,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#091420"/>
            <stop offset="100%" stop-color="#020910"/>
          </linearGradient>
          <radialGradient id="groundGlow" cx="50%" cy="110%" r="40%">
            <stop offset="0%" stop-color="#00ffaa" stop-opacity="0.22"/>
            <stop offset="100%" stop-color="#00ffaa" stop-opacity="0"/>
          </radialGradient>
          <pattern id="fieldDots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1" fill="#ffffff" fill-opacity="0.22"/>
          </pattern>
          ${accents.map((accent, index) => `
            <radialGradient id="coreGlow-${index}" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="30%" stop-color="#ffffff"/>
              <stop offset="65%" stop-color="${accent}"/>
              <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
            </radialGradient>
          `).join('')}
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgGradient)" rx="18" ry="18"/>
        <rect width="${width}" height="${height}" fill="url(#groundGlow)" rx="18" ry="18"/>
        <rect width="${width}" height="${height}" fill="url(#fieldDots)" opacity="0.08" rx="18" ry="18"/>
        ${moodLabel}
        ${links}
        ${blooms}
      </svg>
    `,
  };
}

async function exportGardenPng() {
  if (!bloomHistory.length) return;

  exportPngBtn.disabled = true;
  exportPngBtn.dataset.state = 'working';
  exportPngBtn.textContent = 'rendering...';

  let blobUrl = null;

  try {
    const { width, height, svg } = buildExportSvg();
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    blobUrl = URL.createObjectURL(blob);
    const image = new Image();

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('image-render-failed'));
      image.src = blobUrl;
    });

    const canvas = document.createElement('canvas');
    const scale = window.devicePixelRatio > 1 ? 2 : 1;
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('canvas-unavailable');
    context.scale(scale, scale);
    context.drawImage(image, 0, 0, width, height);

    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.href = pngUrl;
    link.download = `signal-garden-${timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    exportPngBtn.dataset.state = 'done';
    exportPngBtn.textContent = 'PNG exported';
    logField('Garden export complete. The field has been pressed into a glowing postcard.', 'png ready');
    window.clearTimeout(exportToastTimer);
    exportToastTimer = window.setTimeout(() => {
      exportPngBtn.dataset.state = 'idle';
      exportPngBtn.textContent = 'export PNG';
      syncControls();
    }, 2200);
  } catch (error) {
    console.error(error);
    exportPngBtn.dataset.state = 'idle';
    exportPngBtn.textContent = 'export PNG';
    syncControls();
    logField('PNG export hit a weird patch of weather on this browser. Reload and try again.', 'export needs retry');
  } finally {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
  }
}

async function copyTextToClipboard(text, fallbackLabel = 'Copy your Signal Garden link:') {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    window.prompt(fallbackLabel, text);
    return false;
  }
}

function flashButtonCopyState(button, nextLabel = 'link copied', resetLabel = null) {
  const originalLabel = resetLabel ?? button.textContent;
  window.clearTimeout(button.copyStateTimer);
  button.dataset.state = 'copied';
  button.textContent = nextLabel;
  button.copyStateTimer = window.setTimeout(() => {
    button.dataset.state = 'idle';
    button.textContent = originalLabel;
  }, 1800);
}

async function copyShareLink() {
  const url = makeShareUrl();
  const copied = await copyTextToClipboard(url);

  if (copied) {
    window.clearTimeout(shareToastTimer);
    copyLinkBtn.dataset.state = 'copied';
    copyLinkBtn.textContent = 'link copied';
    logField(pick(transmissions.share), hashMode === 'broadcast' ? 'daily link copied' : 'share link copied');
    shareToastTimer = window.setTimeout(() => {
      copyLinkBtn.dataset.state = 'idle';
      copyLinkBtn.textContent = 'copy share link';
    }, 1800);
    return;
  }

  logField('Clipboard got stage fright, so the share link opened the old-fashioned way instead.', 'manual copy required');
}

function getUtcDateKey(date = new Date()) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function isBroadcastKey(value) {
  return BROADCAST_KEY_RE.test(value);
}

function makeSeededRandom(seedText) {
  let seed = 2166136261;
  for (const char of seedText) {
    seed ^= char.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }

  return () => {
    seed += 0x6D2B79F5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDailyGarden(key, options = {}) {
  const { width: requestedWidth, height: requestedHeight } = options;
  const rect = stage.getBoundingClientRect();
  const width = Math.max(320, requestedWidth || rect.width || stage.clientWidth || CANONICAL_STAGE_WIDTH);
  const height = Math.max(220, requestedHeight || rect.height || stage.clientHeight || CANONICAL_STAGE_HEIGHT);
  const scaleX = width / CANONICAL_STAGE_WIDTH;
  const scaleY = height / CANONICAL_STAGE_HEIGHT;
  const rng = makeSeededRandom(`signal-garden:${key}`);
  const total = 8 + Math.floor(rand(0, 5, rng));
  const centerX = rand(CANONICAL_STAGE_WIDTH * 0.3, CANONICAL_STAGE_WIDTH * 0.7, rng);
  const centerY = rand(CANONICAL_STAGE_HEIGHT * 0.34, CANONICAL_STAGE_HEIGHT * 0.68, rng);
  const baseAngle = rand(0, Math.PI * 2, rng);
  const verticalDrift = rand(-32, 32, rng);
  const sequence = [];

  for (let i = 0; i < total; i += 1) {
    const angle = baseAngle + i * 2.399963229728653 + rand(-0.5, 0.5, rng);
    const orbit = 42 + i * rand(22, 38, rng);
    const rawX = centerX + Math.cos(angle) * orbit + rand(-36, 36, rng);
    const rawY = centerY + Math.sin(angle) * orbit * 0.68 + verticalDrift + rand(-28, 28, rng);
    const x = clamp(rawX, 72, CANONICAL_STAGE_WIDTH - 72) * scaleX;
    const y = clamp(rawY, 118, CANONICAL_STAGE_HEIGHT - 28) * scaleY;
    sequence.push(makeBloomSpec(x, y, rng));
  }

  return sequence;
}

function getSequenceMood(sequence) {
  const referenceSpec = sequence[sequence.length - 1] ?? sequence[0];
  return referenceSpec ? chooseMoodFromSpec(referenceSpec) : moods[0];
}

function describeDailyBroadcast(key) {
  const blooms = buildDailyGarden(key, {
    width: ARCHIVE_PREVIEW_WIDTH,
    height: ARCHIVE_PREVIEW_HEIGHT,
  });
  const featuredSpec = blooms[Math.floor(blooms.length / 2)] ?? blooms[0];
  const mood = getSequenceMood(blooms);

  return {
    key,
    blooms,
    count: blooms.length,
    mood,
    dateLabel: formatBroadcastDate(key),
    title: featuredSpec
      ? `${makeNameFromIndexes(featuredSpec.adjectiveIndex, featuredSpec.nounIndex)} archive`
      : 'quiet archive',
  };
}

function buildArchivePreviewSvg(sequence) {
  const mood = escapeXml(getSequenceMood(sequence));
  const links = sequence.slice(1).map((spec, index) => {
    const previous = sequence[index];
    const accent = accents[spec.accentIndex] ?? accents[0];
    return `<line x1="${previous.x}" y1="${previous.y}" x2="${spec.x}" y2="${spec.y}" stroke="${accent}" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="5 8" opacity="0.45"/>`;
  }).join('');

  const blooms = sequence.map((spec) => {
    const accent = accents[spec.accentIndex] ?? accents[0];
    const centerY = spec.y - spec.stemHeight;
    return `
      <g>
        <line x1="${spec.x}" y1="${spec.y - 10}" x2="${spec.x}" y2="${centerY}" stroke="${accent}" stroke-width="3.2" stroke-linecap="round" opacity="0.72"/>
        <ellipse cx="${spec.x}" cy="${centerY}" rx="${spec.ringA / 2}" ry="${Math.round(spec.ringA * 0.34)}" fill="none" stroke="${accent}" stroke-width="1.4" opacity="0.62" transform="rotate(${spec.tilt} ${spec.x} ${centerY})"/>
        <ellipse cx="${spec.x}" cy="${centerY}" rx="${spec.ringB / 2.4}" ry="${Math.round(spec.ringB * 0.16)}" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="4 6" opacity="0.4" transform="rotate(${spec.tilt * -1.4} ${spec.x} ${centerY})"/>
        <circle cx="${spec.x}" cy="${centerY}" r="7" fill="${accent}" opacity="0.92"/>
      </g>
    `;
  }).join('');

  return `
    <svg viewBox="0 0 ${ARCHIVE_PREVIEW_WIDTH} ${ARCHIVE_PREVIEW_HEIGHT}" role="img" aria-label="Archive preview for ${mood}">
      <rect width="${ARCHIVE_PREVIEW_WIDTH}" height="${ARCHIVE_PREVIEW_HEIGHT}" rx="18" ry="18" fill="#050d16"/>
      <circle cx="70" cy="40" r="90" fill="rgba(157, 123, 255, 0.16)"/>
      <circle cx="270" cy="34" r="84" fill="rgba(85, 230, 255, 0.12)"/>
      <ellipse cx="160" cy="250" rx="180" ry="84" fill="rgba(0, 255, 170, 0.12)"/>
      ${links}
      ${blooms}
      <text x="18" y="28" fill="#bcefff" font-size="11" font-family="Inter, system-ui, sans-serif" letter-spacing="1.8">${mood.toUpperCase()}</text>
    </svg>
  `;
}

function syncArchiveSelection() {
  if (!archiveGridEl) return;

  archiveGridEl.querySelectorAll('.archive-card').forEach((card) => {
    const isActive = fieldSourceMode === 'broadcast' && card.dataset.broadcastKey === currentBroadcastKey;
    card.dataset.active = String(isActive);
  });
}

function syncArchiveStatus() {
  if (!archiveStatusEl) return;

  if (fieldSourceMode === 'broadcast' && currentBroadcastKey) {
    archiveStatusEl.textContent = `Viewing ${formatBroadcastDate(currentBroadcastKey)} • ${bloomCount} blooms • ${moodEl.textContent}`;
    return;
  }

  if (fieldSourceMode === 'shared') {
    archiveStatusEl.textContent = 'Shared permalink loaded. Plant once and it turns back into your own field.';
    return;
  }

  archiveStatusEl.textContent = `Showing the last ${ARCHIVE_DAYS} UTC broadcasts. Today's archive slice is waiting.`;
}

function renderArchive() {
  if (!archiveGridEl) return;

  const cards = getRecentBroadcastKeys().map((key, index) => {
    const entry = describeDailyBroadcast(key);
    const card = document.createElement('article');
    const recency = index === 0 ? 'today' : index === 1 ? 'yesterday' : `${index} days back`;

    card.className = 'archive-card';
    card.dataset.broadcastKey = key;
    card.dataset.active = 'false';
    card.innerHTML = `
      <div class="archive-preview" aria-hidden="true">${buildArchivePreviewSvg(entry.blooms)}</div>
      <div class="archive-meta">
        <div class="archive-date">
          <strong>${escapeXml(entry.dateLabel)}</strong>
          <span>${key}</span>
        </div>
        <p class="archive-title">${escapeXml(entry.title)}</p>
        <p class="archive-summary">${entry.count} blooms • ${escapeXml(entry.mood)} • ${recency}</p>
      </div>
      <div class="archive-actions">
        <button type="button" data-action="load" data-key="${key}">load signal</button>
        <button type="button" data-action="copy" data-key="${key}">copy link</button>
      </div>
    `;

    return card;
  });

  archiveGridEl.replaceChildren(...cards);
  syncArchiveSelection();
  syncArchiveStatus();
}

async function copyBroadcastLink(key, button) {
  const copied = await copyTextToClipboard(getBroadcastUrl(key), 'Copy this daily signal link:');

  if (copied) {
    if (button) flashButtonCopyState(button, 'copied', 'copy link');
    logField(`Archive link copied for ${key}. The gallery is now traveling pocket-sized.`, 'daily link copied');
    return;
  }

  logField(`Archive link opened manually for ${key}. Clipboard politics remain bleak.`, 'manual copy required');
}

function replayGarden(sequence = bloomHistory, options = {}) {
  const { restoreFromHash = false, shareMode = hashMode, sourceMode = fieldSourceMode, broadcastKey = currentBroadcastKey } = options;
  const blooms = sequence.map((spec) => ({ ...spec }));
  if (!blooms.length) return;

  clearReplayTimers();
  hashMode = shareMode;
  setFieldSource(sourceMode, sourceMode === 'broadcast' ? broadcastKey : null);
  resetField({ keepLogs: false, syncUrl: false, mood: false });
  logField(pick(transmissions.replay), `replaying ${blooms.length} blooms`);

  blooms.forEach((spec, index) => {
    const timer = window.setTimeout(() => {
      renderBloom(spec, {
        logPlant: false,
        syncUrl: false,
        animateLink: index !== 0,
      });

      if (index === blooms.length - 1) {
        if (restoreFromHash) suppressHashSync = false;
        syncShareState();
      }
    }, index * 140);

    replayTimers.push(timer);
  });
}

function loadDailyBroadcast(key = getUtcDateKey(), { replay = false } = {}) {
  if (!isBroadcastKey(key)) return false;

  const blooms = buildDailyGarden(key);
  if (!blooms.length) return false;

  suppressHashSync = true;
  hashMode = 'broadcast';
  setFieldSource('broadcast', key);

  if (replay) {
    replayGarden(blooms, {
      restoreFromHash: true,
      shareMode: 'broadcast',
      sourceMode: 'broadcast',
      broadcastKey: key,
    });
    return true;
  }

  resetField({ keepLogs: false, syncUrl: false, mood: false });
  blooms.forEach((spec, index) => {
    renderBloom(spec, {
      logPlant: false,
      syncUrl: false,
      animateLink: index !== 0,
    });
  });
  logField(pick(transmissions.daily).replace('{date}', key), `daily signal tuned: ${blooms.length} blooms`);
  suppressHashSync = false;
  syncShareState();
  return true;
}

function loadGardenFromHash({ replay = false } = {}) {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return false;

  if (hash.startsWith('broadcast=')) {
    const key = hash.slice('broadcast='.length).trim();
    return loadDailyBroadcast(key, { replay });
  }

  if (!hash.startsWith('garden=')) return false;

  const encoded = hash.slice('garden='.length).trim();
  if (!encoded) return false;

  const blooms = encoded.split('~').map(decodeBloom).filter(Boolean).slice(0, MAX_BLOOMS);
  if (!blooms.length) return false;

  suppressHashSync = true;
  hashMode = 'garden';
  setFieldSource('shared');

  if (replay) {
    replayGarden(blooms, {
      restoreFromHash: true,
      shareMode: 'garden',
      sourceMode: 'shared',
    });
    return true;
  }

  resetField({ keepLogs: false, syncUrl: false, mood: false });
  blooms.forEach((spec, index) => {
    renderBloom(spec, {
      logPlant: false,
      syncUrl: false,
      animateLink: index !== 0,
    });
  });
  logField(pick(transmissions.loaded), `shared garden loaded: ${blooms.length} blooms`);
  suppressHashSync = false;
  syncShareState();
  return true;
}

stage.addEventListener('pointermove', (event) => {
  const rect = stage.getBoundingClientRect();
  updatePreview(event.clientX - rect.left, event.clientY - rect.top);
  if (!previewVisible) showPreview();
});

stage.addEventListener('pointerenter', showPreview);
stage.addEventListener('pointerleave', hidePreview);

stage.addEventListener('click', (event) => {
  prepareEditableField();
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  plant(x, y);
  updatePreview(x, y);
});

randomizeBtn.addEventListener('click', () => {
  prepareEditableField();
  const rect = stage.getBoundingClientRect();
  const centerX = rand(rect.width * 0.2, rect.width * 0.8);
  const centerY = rand(rect.height * 0.35, rect.height * 0.82);
  const total = Math.floor(rand(5, 10));

  for (let i = 0; i < total; i += 1) {
    plant(centerX + rand(-90, 90), centerY + rand(-50, 50), { logPlant: false, syncUrl: false });
  }

  syncShareState();
  logField(
    pick(transmissions.cluster)
      .replace('{x}', Math.round(centerX).toString())
      .replace('{y}', Math.round(centerY).toString()),
    `cluster dropped: ${total} signals`
  );
  updatePreview(centerX, centerY);
});

dailySignalBtn.addEventListener('click', () => {
  loadDailyBroadcast(getUtcDateKey(), { replay: false });
});

archiveGridEl?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action][data-key]');
  if (!(button instanceof HTMLButtonElement)) return;

  const { action, key } = button.dataset;
  if (!key) return;

  if (action === 'load') {
    loadDailyBroadcast(key, { replay: false });
    return;
  }

  if (action === 'copy') {
    copyBroadcastLink(key, button);
  }
});

clearBtn.addEventListener('click', () => {
  suppressHashSync = false;
  setOpenFieldMode();
  resetField({ logMessage: pick(transmissions.clear), status: 'awaiting first contact' });
});

undoBtn.addEventListener('click', () => {
  prepareEditableField();
  undoLastBloom();
});
copyLinkBtn.addEventListener('click', copyShareLink);
exportPngBtn.addEventListener('click', exportGardenPng);
replayBtn.addEventListener('click', () => replayGarden());

document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (event.key.toLowerCase() === 'u' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    prepareEditableField();
    undoLastBloom();
  }
  if (event.key.toLowerCase() === 'r' && !event.metaKey && !event.ctrlKey && !event.altKey && bloomHistory.length) {
    event.preventDefault();
    replayGarden();
  }
  if (event.key.toLowerCase() === 'd' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    loadDailyBroadcast(getUtcDateKey(), { replay: false });
  }
});

window.exportGardenPng = exportGardenPng;

window.addEventListener('hashchange', () => {
  if (!suppressHashSync) {
    loadGardenFromHash();
  }
});

window.addEventListener('load', () => {
  setFieldSource('open');
  setMood();
  syncControls();
  renderArchive();
  logField('Signal Garden online. The soil is listening.', 'awaiting first contact');
  if (!loadGardenFromHash()) {
    copyLinkBtn.textContent = 'copy share link';
  }
  syncArchiveStatus();
});

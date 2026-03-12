const stage = document.getElementById('stage');
const signalOverlay = document.getElementById('signal-overlay');
const template = document.getElementById('bloom-template');
const countEl = document.getElementById('count');
const moodEl = document.getElementById('mood');
const lastNameEl = document.getElementById('lastName');
const randomizeBtn = document.getElementById('randomize');
const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clear');
const hintEl = document.getElementById('hint');
const previewEl = document.getElementById('preview');
const fieldLogEl = document.getElementById('fieldLog');
const logStatusEl = document.getElementById('logStatus');
const copyLinkBtn = document.getElementById('copyLink');
const replayBtn = document.getElementById('replay');

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
  replay: [
    'Replay started. The field is re-performing its favorite rumors.',
    'Garden replaying now. Like fireworks with emotional baggage.',
    'Replay engaged. The blooms are doing the encore nobody asked for but everybody needed.',
  ],
};

let bloomCount = 0;
let previousBloomPoint = null;
let previewVisible = false;
let bloomHistory = [];
let replayTimer = null;
let shareToastTimer = null;
let suppressHashSync = false;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
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

function syncControls() {
  const disabled = bloomCount === 0;
  undoBtn.disabled = disabled;
  clearBtn.disabled = disabled;
  replayBtn.disabled = disabled;
  copyLinkBtn.disabled = disabled;

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

function makeBloomSpec(x, y) {
  const adjectiveIndex = Math.floor(rand(0, adjectives.length));
  const nounIndex = Math.floor(rand(0, nouns.length));
  const accentIndex = Math.floor(rand(0, accents.length));

  return {
    x: round1(x),
    y: round1(y),
    adjectiveIndex,
    nounIndex,
    accentIndex,
    stemHeight: Math.round(rand(48, 110)),
    ringA: Math.round(rand(44, 90)),
    ringB: Math.round(rand(80, 128)),
    tilt: round1(rand(-40, 40)),
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
  setMood();

  if (logPlant) {
    logField(choosePlantTransmission(name, hadLink, spec.x, spec.y), `tracking ${bloomCount} bloom${bloomCount === 1 ? '' : 's'}`);
  }

  if (bloomCount > 60) {
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

function makeShareUrl() {
  const base = `${window.location.origin}${window.location.pathname}`;
  if (!bloomHistory.length) return base;
  return `${base}#garden=${bloomHistory.map(encodeBloom).join('~')}`;
}

function syncShareState() {
  if (suppressHashSync) return;
  const nextHash = bloomHistory.length ? `garden=${bloomHistory.map(encodeBloom).join('~')}` : '';
  const nextUrl = nextHash ? `${window.location.pathname}#${nextHash}` : window.location.pathname;
  history.replaceState(null, '', nextUrl);
}

function resetField({ logMessage = null, status = 'awaiting first contact', keepLogs = false, syncUrl = true, mood = true } = {}) {
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
  if (syncUrl) syncShareState();
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
  } else {
    previousBloomPoint = null;
    signalOverlay.innerHTML = '';
  }

  logField(pick(transmissions.undo).replace('{name}', removedName), bloomCount === 0 ? 'field standing by' : `tracking ${bloomCount} bloom${bloomCount === 1 ? '' : 's'}`);
  setMood();
  syncControls();
  syncShareState();
}

async function copyShareLink() {
  const url = makeShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    copyLinkBtn.dataset.state = 'copied';
    copyLinkBtn.textContent = 'link copied';
    logField(pick(transmissions.share), 'share link copied');
    window.clearTimeout(shareToastTimer);
    shareToastTimer = window.setTimeout(() => {
      copyLinkBtn.dataset.state = 'idle';
      copyLinkBtn.textContent = 'copy share link';
    }, 1800);
  } catch {
    window.prompt('Copy your Signal Garden link:', url);
    logField('Clipboard got stage fright, so the share link opened the old-fashioned way instead.', 'manual copy required');
  }
}

function loadGardenFromHash({ replay = false } = {}) {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash.startsWith('garden=')) return false;

  const encoded = hash.slice('garden='.length).trim();
  if (!encoded) return false;

  const blooms = encoded.split('~').map(decodeBloom).filter(Boolean).slice(0, 60);
  if (!blooms.length) return false;

  suppressHashSync = true;
  resetField({ keepLogs: false, syncUrl: false, mood: false });
  if (replay) {
    replayGarden(blooms, { restoreFromHash: true });
  } else {
    blooms.forEach((spec, index) => renderBloom(spec, { logPlant: index === blooms.length - 1, syncUrl: false, animateLink: index !== 0 }));
    logField(pick(transmissions.loaded), `shared garden loaded: ${blooms.length} blooms`);
  }
  suppressHashSync = false;
  syncShareState();
  return true;
}

function replayGarden(sequence = bloomHistory, options = {}) {
  const { restoreFromHash = false } = options;
  const blooms = sequence.map((spec) => ({ ...spec }));
  if (!blooms.length) return;

  window.clearTimeout(replayTimer);
  resetField({ keepLogs: false, syncUrl: !restoreFromHash, mood: false });
  logField(pick(transmissions.replay), `replaying ${blooms.length} blooms`);

  blooms.forEach((spec, index) => {
    replayTimer = window.setTimeout(() => {
      renderBloom(spec, {
        logPlant: index === blooms.length - 1,
        syncUrl: !restoreFromHash && index === blooms.length - 1,
        animateLink: index !== 0,
      });
      if (restoreFromHash && index === blooms.length - 1) {
        suppressHashSync = false;
        syncShareState();
      }
    }, index * 140);
  });
}

stage.addEventListener('pointermove', (event) => {
  const rect = stage.getBoundingClientRect();
  updatePreview(event.clientX - rect.left, event.clientY - rect.top);
  if (!previewVisible) showPreview();
});

stage.addEventListener('pointerenter', showPreview);
stage.addEventListener('pointerleave', hidePreview);

stage.addEventListener('click', (event) => {
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  plant(x, y);
  updatePreview(x, y);
});

randomizeBtn.addEventListener('click', () => {
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

clearBtn.addEventListener('click', () => {
  resetField({ logMessage: pick(transmissions.clear), status: 'awaiting first contact' });
});

undoBtn.addEventListener('click', undoLastBloom);
copyLinkBtn.addEventListener('click', copyShareLink);
replayBtn.addEventListener('click', () => replayGarden());

document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (event.key.toLowerCase() === 'u' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    undoLastBloom();
  }
  if (event.key.toLowerCase() === 'r' && !event.metaKey && !event.ctrlKey && !event.altKey && bloomHistory.length) {
    event.preventDefault();
    replayGarden();
  }
});

window.addEventListener('hashchange', () => {
  if (!suppressHashSync) loadGardenFromHash();
});

window.addEventListener('load', () => {
  setMood();
  syncControls();
  logField('Signal Garden online. The soil is listening.', 'awaiting first contact');
  if (!loadGardenFromHash()) {
    copyLinkBtn.textContent = 'copy share link';
  }
});

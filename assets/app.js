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

const adjectives = ['velvet', 'neon', 'hollow', 'lunar', 'midnight', 'feral', 'opal', 'echo', 'solar', 'ghost'];
const nouns = ['orchid', 'signal', 'lantern', 'murmur', 'crown', 'spire', 'feather', 'petal', 'relic', 'flare'];
const moods = ['violet hush', 'teal static', 'rose voltage', 'amber drift', 'ion mist', 'midnight bloom'];
const accents = ['#9d7bff', '#55e6ff', '#ff6ec7', '#7cff8f', '#ffd166', '#7ee7ff'];

let bloomCount = 0;
let previousBloomPoint = null;
let previewVisible = false;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function makeName() {
  return `${pick(adjectives)} ${pick(nouns)}`;
}

function setMood() {
  moodEl.textContent = pick(moods);
}

function syncControls() {
  const disabled = bloomCount === 0;
  undoBtn.disabled = disabled;
  clearBtn.disabled = disabled;

  if (disabled) stage.setAttribute('data-empty', 'true');
  else stage.removeAttribute('data-empty');

  hintEl.textContent = disabled
    ? 'Move your cursor to aim a bloom. Click to plant. Press U to undo.'
    : 'Click to plant. Press U to undo the last bloom.';
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

function plant(x, y) {
  const node = template.content.firstElementChild.cloneNode(true);
  const name = makeName();
  const accent = pick(accents);

  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.setProperty('--accent', accent);
  node.style.setProperty('--stem-height', `${rand(48, 110).toFixed(0)}px`);
  node.style.setProperty('--ring-a', `${rand(44, 90).toFixed(0)}px`);
  node.style.setProperty('--ring-b', `${rand(80, 128).toFixed(0)}px`);
  node.style.setProperty('--tilt', `${rand(-40, 40).toFixed(1)}deg`);
  node.querySelector('.label').textContent = name;

  drawSignalLink(previousBloomPoint, { x, y }, accent);
  previousBloomPoint = { x, y };

  stage.appendChild(node);
  bloomCount += 1;
  countEl.textContent = String(bloomCount);
  lastNameEl.textContent = name;
  setMood();

  if (bloomCount > 60) {
    stage.querySelector('.bloom')?.remove();
    bloomCount -= 1;
    countEl.textContent = String(bloomCount);
  }

  syncControls();
}

function undoLastBloom() {
  const blooms = stage.querySelectorAll('.bloom');
  const latestBloom = blooms[blooms.length - 1];
  if (!latestBloom) return;

  latestBloom.remove();
  bloomCount = Math.max(0, bloomCount - 1);
  countEl.textContent = String(bloomCount);

  const remainingBlooms = stage.querySelectorAll('.bloom');
  const nextLastBloom = remainingBlooms[remainingBlooms.length - 1];
  lastNameEl.textContent = nextLastBloom?.querySelector('.label')?.textContent ?? 'none yet';

  if (nextLastBloom) {
    previousBloomPoint = {
      x: parseFloat(nextLastBloom.style.left),
      y: parseFloat(nextLastBloom.style.top),
    };
  } else {
    previousBloomPoint = null;
    signalOverlay.innerHTML = '';
  }

  setMood();
  syncControls();
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
    plant(centerX + rand(-90, 90), centerY + rand(-50, 50));
  }

  updatePreview(centerX, centerY);
});

clearBtn.addEventListener('click', () => {
  stage.querySelectorAll('.bloom').forEach((bloom) => bloom.remove());
  signalOverlay.innerHTML = '';
  previousBloomPoint = null;
  bloomCount = 0;
  countEl.textContent = '0';
  lastNameEl.textContent = 'none yet';
  setMood();
  syncControls();
});

undoBtn.addEventListener('click', undoLastBloom);

document.addEventListener('keydown', (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (event.key.toLowerCase() === 'u' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    undoLastBloom();
  }
});

window.addEventListener('load', () => {
  setMood();
  syncControls();
});

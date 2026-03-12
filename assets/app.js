const stage = document.getElementById('stage');
const signalOverlay = document.getElementById('signal-overlay');
const template = document.getElementById('bloom-template');
const countEl = document.getElementById('count');
const moodEl = document.getElementById('mood');
const lastNameEl = document.getElementById('lastName');
const randomizeBtn = document.getElementById('randomize');
const clearBtn = document.getElementById('clear');

const adjectives = ['velvet', 'neon', 'hollow', 'lunar', 'midnight', 'feral', 'opal', 'echo', 'solar', 'ghost'];
const nouns = ['orchid', 'signal', 'lantern', 'murmur', 'crown', 'spire', 'feather', 'petal', 'relic', 'flare'];
const moods = ['violet hush', 'teal static', 'rose voltage', 'amber drift', 'ion mist', 'midnight bloom'];
const accents = ['#9d7bff', '#55e6ff', '#ff6ec7', '#7cff8f', '#ffd166', '#7ee7ff'];
const maxBlooms = 60;

let bloomCount = 0;
let bloomId = 0;
const plantedBlooms = [];

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

function syncOverlay() {
  const { width, height } = stage.getBoundingClientRect();
  signalOverlay.setAttribute('viewBox', `0 0 ${width} ${height}`);
}

function drawSignalLink(fromBloom, toBloom, accent) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', fromBloom.x.toFixed(1));
  line.setAttribute('y1', fromBloom.y.toFixed(1));
  line.setAttribute('x2', toBloom.x.toFixed(1));
  line.setAttribute('y2', toBloom.y.toFixed(1));
  line.style.setProperty('--accent', accent);
  line.setAttribute('class', 'signal-line');
  signalOverlay.appendChild(line);

  window.setTimeout(() => {
    line.remove();
  }, 2300);
}

function connectBloom(newBloom) {
  const nearby = plantedBlooms
    .filter((bloom) => bloom.id !== newBloom.id)
    .map((bloom) => ({
      bloom,
      distance: Math.hypot(bloom.x - newBloom.x, bloom.y - newBloom.y),
    }))
    .filter(({ distance }) => distance < 220)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 2);

  nearby.forEach(({ bloom }) => drawSignalLink(newBloom, bloom, newBloom.accent));
}

function removeOldestBloom() {
  const oldestBloom = plantedBlooms.shift();
  oldestBloom?.node.remove();
  bloomCount = plantedBlooms.length;
  countEl.textContent = String(bloomCount);
}

function plant(x, y) {
  const node = template.content.firstElementChild.cloneNode(true);
  const name = makeName();
  const accent = pick(accents);
  const bloom = {
    id: ++bloomId,
    x,
    y,
    accent,
    node,
  };

  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.style.setProperty('--accent', accent);
  node.style.setProperty('--stem-height', `${rand(48, 110).toFixed(0)}px`);
  node.style.setProperty('--ring-a', `${rand(44, 90).toFixed(0)}px`);
  node.style.setProperty('--ring-b', `${rand(80, 128).toFixed(0)}px`);
  node.style.setProperty('--tilt', `${rand(-40, 40).toFixed(1)}deg`);
  node.querySelector('.label').textContent = name;

  stage.appendChild(node);
  plantedBlooms.push(bloom);
  bloomCount = plantedBlooms.length;
  countEl.textContent = String(bloomCount);
  lastNameEl.textContent = name;
  setMood();
  connectBloom(bloom);

  if (plantedBlooms.length > maxBlooms) {
    removeOldestBloom();
  }
}

stage.addEventListener('click', (event) => {
  const rect = stage.getBoundingClientRect();
  plant(event.clientX - rect.left, event.clientY - rect.top);
});

randomizeBtn.addEventListener('click', () => {
  const rect = stage.getBoundingClientRect();
  const centerX = rand(rect.width * 0.2, rect.width * 0.8);
  const centerY = rand(rect.height * 0.35, rect.height * 0.82);
  const total = Math.floor(rand(5, 10));

  for (let i = 0; i < total; i += 1) {
    plant(centerX + rand(-90, 90), centerY + rand(-50, 50));
  }
});

clearBtn.addEventListener('click', () => {
  plantedBlooms.splice(0).forEach(({ node }) => node.remove());
  signalOverlay.replaceChildren();
  bloomCount = 0;
  countEl.textContent = '0';
  lastNameEl.textContent = 'none yet';
  setMood();
});

function seedGarden() {
  const rect = stage.getBoundingClientRect();
  const initial = 8;
  for (let i = 0; i < initial; i += 1) {
    plant(rand(80, rect.width - 80), rand(rect.height * 0.45, rect.height - 20));
  }
}

window.addEventListener('load', () => {
  syncOverlay();
  setMood();
  seedGarden();
});

window.addEventListener('resize', syncOverlay);

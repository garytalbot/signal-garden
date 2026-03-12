const stage = document.getElementById('stage');
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

let bloomCount = 0;

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

  stage.appendChild(node);
  bloomCount += 1;
  countEl.textContent = String(bloomCount);
  lastNameEl.textContent = name;
  setMood();

  if (bloomCount > 60) {
    stage.firstElementChild?.remove();
    bloomCount -= 1;
    countEl.textContent = String(bloomCount);
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
  stage.innerHTML = '';
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
  setMood();
  seedGarden();
});

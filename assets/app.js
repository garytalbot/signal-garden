const stage = document.getElementById('stage');
const constellationOverlay = document.getElementById('constellation-overlay');
const meteorOverlay = document.getElementById('meteor-overlay');
const harmonyOverlay = document.getElementById('harmony-overlay');
const signalOverlay = document.getElementById('signal-overlay');
const template = document.getElementById('bloom-template');
const countEl = document.getElementById('count');
const moodEl = document.getElementById('mood');
const weatherModeEl = document.getElementById('weatherMode');
const weaveModeEl = document.getElementById('weaveMode');
const meteorModeEl = document.getElementById('meteorMode');
const afterimageModeEl = document.getElementById('afterimageMode');
const harmonyModeEl = document.getElementById('harmonyMode');
const lastNameEl = document.getElementById('lastName');
const sourceLabelEl = document.getElementById('sourceLabel');
const residentNameEl = document.getElementById('residentName');
const residentMoodEl = document.getElementById('residentMood');
const gardenCritterEl = document.getElementById('gardenCritter');
const randomizeBtn = document.getElementById('randomize');
const dailySignalBtn = document.getElementById('dailySignal');
const cycleWeatherBtn = document.getElementById('cycleWeather');
const toggleWeaveBtn = document.getElementById('toggleWeave');
const toggleMeteorBtn = document.getElementById('toggleMeteor');
const toggleAfterimageBtn = document.getElementById('toggleAfterimage');
const toggleHarmonyBtn = document.getElementById('toggleHarmony');
const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clear');
const hintEl = document.getElementById('hint');
const previewEl = document.getElementById('preview');
const fieldLogEl = document.getElementById('fieldLog');
const logStatusEl = document.getElementById('logStatus');
const archiveGridEl = document.getElementById('archiveGrid');
const archiveStatusEl = document.getElementById('archiveStatus');
const highlightsGridEl = document.getElementById('highlightsGrid');
const highlightsStatusEl = document.getElementById('highlightsStatus');
const copyLinkBtn = document.getElementById('copyLink');
const sharePostcardBtn = document.getElementById('sharePostcard');
const replayBtn = document.getElementById('replay');
const exportPngBtn = document.getElementById('exportPng');
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const adjectives = ['velvet', 'neon', 'hollow', 'lunar', 'midnight', 'feral', 'opal', 'echo', 'solar', 'ghost'];
const nouns = ['orchid', 'signal', 'lantern', 'murmur', 'crown', 'spire', 'feather', 'petal', 'relic', 'flare'];
const critterTitles = ['moth', 'slug', 'oracle', 'goblin', 'herald', 'pigeon', 'ghost', 'gremlin', 'beast', 'saint'];
const critterMoods = [
  'collecting rumors from the ferns',
  'pretending to supervise the weather',
  'glowing for no documented reason',
  'acting like the moon owes it money',
  'guarding the weird little pageant',
  'eating static like kettle corn',
  'loitering with ceremonial intent',
  'being suspiciously adorable about it',
];
const WEATHER_PRESETS = [
  {
    id: 'violet-hush',
    label: 'violet hush',
    idleMood: 'violet hush',
    themeColor: '#07111a',
    moods: ['violet hush', 'teal static', 'rose voltage', 'amber drift', 'ion mist', 'midnight bloom'],
    accents: ['#9d7bff', '#55e6ff', '#ff6ec7', '#7cff8f', '#ffd166', '#7ee7ff'],
    preview: {
      base: '#050d16',
      skyA: 'rgba(157, 123, 255, 0.16)',
      skyB: 'rgba(85, 230, 255, 0.12)',
      floor: 'rgba(0, 255, 170, 0.12)',
      text: '#bcefff',
    },
    export: {
      bgStart: '#091420',
      bgEnd: '#020910',
      haloA: 'rgba(157, 123, 255, 0.18)',
      haloB: 'rgba(85, 230, 255, 0.14)',
      floor: 'rgba(0, 255, 170, 0.18)',
      badgeFill: 'rgba(3, 10, 18, 0.74)',
      badgeStroke: 'rgba(141, 220, 255, 0.28)',
      text: '#bcefff',
      muted: 'rgba(235, 245, 255, 0.82)',
      brand: '#8ddcff',
    },
  },
  {
    id: 'aurora-tide',
    label: 'aurora tide',
    idleMood: 'aurora tide',
    themeColor: '#031114',
    moods: ['aurora tide', 'kelp static', 'glacier murmur', 'ion surf', 'blue moss', 'polar shimmer'],
    accents: ['#6fffe9', '#b7ff5e', '#7dd4ff', '#7cffc4', '#d8fff2', '#53f2ff'],
    preview: {
      base: '#031114',
      skyA: 'rgba(73, 255, 198, 0.16)',
      skyB: 'rgba(120, 230, 255, 0.14)',
      floor: 'rgba(193, 255, 99, 0.12)',
      text: '#93fff1',
    },
    export: {
      bgStart: '#062228',
      bgEnd: '#01090d',
      haloA: 'rgba(73, 255, 198, 0.18)',
      haloB: 'rgba(120, 230, 255, 0.16)',
      floor: 'rgba(193, 255, 99, 0.18)',
      badgeFill: 'rgba(2, 16, 18, 0.76)',
      badgeStroke: 'rgba(112, 255, 220, 0.28)',
      text: '#93fff1',
      muted: 'rgba(225, 255, 249, 0.84)',
      brand: '#7ffff1',
    },
  },
  {
    id: 'ember-rain',
    label: 'ember rain',
    idleMood: 'ember rain',
    themeColor: '#140903',
    moods: ['ember rain', 'sodium dusk', 'lantern weather', 'brick shimmer', 'copper drift', 'heat halo'],
    accents: ['#ff8a5b', '#ffd166', '#ff6b8a', '#ffb347', '#ffc857', '#ff9f6e'],
    preview: {
      base: '#140904',
      skyA: 'rgba(255, 111, 97, 0.18)',
      skyB: 'rgba(255, 205, 110, 0.14)',
      floor: 'rgba(255, 150, 64, 0.12)',
      text: '#ffbe8b',
    },
    export: {
      bgStart: '#261006',
      bgEnd: '#100401',
      haloA: 'rgba(255, 111, 97, 0.2)',
      haloB: 'rgba(255, 205, 110, 0.16)',
      floor: 'rgba(255, 150, 64, 0.18)',
      badgeFill: 'rgba(28, 10, 6, 0.78)',
      badgeStroke: 'rgba(255, 176, 113, 0.3)',
      text: '#ffbe8b',
      muted: 'rgba(255, 237, 217, 0.84)',
      brand: '#ffbe8b',
    },
  },
  {
    id: 'storm-glass',
    label: 'storm glass',
    idleMood: 'storm glass',
    themeColor: '#071018',
    moods: ['storm glass', 'slate voltage', 'mint thunder', 'rain circuit', 'quiet squall', 'cold ballast'],
    accents: ['#90b7ff', '#6bf2d3', '#b6c8ff', '#86ffd5', '#d4f2ff', '#7bd7ff'],
    preview: {
      base: '#071016',
      skyA: 'rgba(110, 130, 164, 0.18)',
      skyB: 'rgba(80, 255, 222, 0.12)',
      floor: 'rgba(102, 201, 179, 0.12)',
      text: '#a6d7ff',
    },
    export: {
      bgStart: '#0b1822',
      bgEnd: '#02060b',
      haloA: 'rgba(110, 130, 164, 0.2)',
      haloB: 'rgba(80, 255, 222, 0.14)',
      floor: 'rgba(102, 201, 179, 0.18)',
      badgeFill: 'rgba(6, 14, 22, 0.78)',
      badgeStroke: 'rgba(156, 198, 230, 0.28)',
      text: '#a6d7ff',
      muted: 'rgba(229, 244, 255, 0.84)',
      brand: '#a6d7ff',
    },
  },
];
const WEATHER_PRESET_BY_ID = Object.fromEntries(WEATHER_PRESETS.map((preset) => [preset.id, preset]));
const DEFAULT_WEATHER_ID = WEATHER_PRESETS[0].id;
const ACCENT_SLOT_COUNT = WEATHER_PRESETS[0].accents.length;
const SIGNAL_OVERLAY_STYLE_ID = 'signal-chorus-inline-styles';
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
  weather: [
    'Weather switched to {weather}. The horizon now looks professionally unserious.',
    '{weather} rolls in. The garden immediately starts dressing like a gas station prophecy.',
    'Sky retuned to {weather}. Somebody definitely tampered with the moon.',
  ],
};

const MAX_BLOOMS = 60;
const CANONICAL_STAGE_WIDTH = 1000;
const CANONICAL_STAGE_HEIGHT = 680;
const ARCHIVE_DAYS = 12;
const ARCHIVE_PREVIEW_WIDTH = 320;
const ARCHIVE_PREVIEW_HEIGHT = 240;
const BROADCAST_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const GALLERY_HIGHLIGHTS = [
  {
    id: 'midnight-promenade',
    title: 'midnight promenade',
    tag: 'slow parade',
    weatherId: 'violet-hush',
    description: 'A balanced walking-path field with enough empty space to feel expensive.',
    encodedGarden: 'qe.24e.2.2.5.2e.1q.30.78~1e0.1jk.3.0.0.22.1m.34.g4~1xg.2cq.0.8.4.2k.1u.3e.4g~2p8.1b8.6.4.2.1y.1i.38.eg~3bg.24e.9.9.1.2c.1o.3a.8c~47e.1mc.8.2.3.24.1k.32.go~4s8.2bc.7.7.5.2o.1w.3g.64~5aa.1e0.5.5.0.20.1g.30.dc',
  },
  {
    id: 'greenroom-static',
    title: 'greenroom static',
    tag: 'aurora pocket',
    weatherId: 'aurora-tide',
    description: 'Cooler air, wider drift, and a suspicious amount of northern-lights confidence.',
    encodedGarden: '10a.1tw.2.2.0.2e.1q.2s.9s~1ro.198.4.7.3.1y.18.32.bi~2hc.22g.1.5.1.2a.1u.36.5w~368.1hy.6.1.4.24.1k.34.ic~3zs.270.0.8.2.2m.20.3i.ek~4o0.1o8.5.9.5.22.1g.30.90~5d4.2ak.3.4.1.2g.1w.38.cg',
  },
  {
    id: 'lantern-laundry',
    title: 'lantern laundry',
    tag: 'ember parade',
    weatherId: 'ember-rain',
    description: 'Warm sodium-rain nonsense. Looks like a small town art fair got struck by meteorology.',
    encodedGarden: 's0.23c.1.0.0.28.1s.36.jo~1kg.1e0.7.4.3.22.1i.34.ao~2b4.260.2.8.1.2c.20.3a.b4~32w.1ls.8.1.5.24.1g.2w.i8~3ua.27g.0.9.4.2k.1u.3g.d4~4ni.1cq.6.3.2.20.1m.32.6o~5b8.24o.3.5.1.2e.1q.38.fs',
  },
  {
    id: 'storm-ballet',
    title: 'storm ballet',
    tag: 'glass thunder',
    weatherId: 'storm-glass',
    description: 'A cleaner colder field for people who think weather should arrive in tailored pants.',
    encodedGarden: 'uu.1yo.4.1.0.24.1o.34.as~1mk.2d8.1.8.3.2g.1u.3c.d0~2f0.1f4.7.5.2.20.1k.30.7k~34q.274.2.2.4.2m.20.3i.b8~3xs.1m8.8.7.5.22.1g.2u.gw~4s0.24o.0.0.1.2e.1w.36.5o~5l4.1be.5.9.4.24.1m.32.f4',
  },
];

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
let currentWeatherPreset = WEATHER_PRESETS[0];
let currentCritterSpec = null;
let constellationWeaveEnabled = false;
let meteorShowerEnabled = false;
let afterimageEnabled = false;
let afterimageCursorTrail = [];
let afterimageCursorStampAt = 0;
let signalChorusEnabled = false;
let signalOverlayFlashGroup = null;
let signalOverlayChorusGroup = null;
let signalCursorPoint = null;
let signalChorusFrame = null;
const AFTERIMAGE_GHOST_LIMIT = 24;
const AFTERIMAGE_CURSOR_LIMIT = 18;

function rand(min, max, randomFn = Math.random) {
  return randomFn() * (max - min) + min;
}

function pick(items, randomFn = Math.random) {
  return items[Math.floor(randomFn() * items.length)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getWeatherPresetById(id) {
  return WEATHER_PRESET_BY_ID[id] ?? WEATHER_PRESET_BY_ID[DEFAULT_WEATHER_ID];
}

function getBroadcastWeatherPreset(key = getUtcDateKey()) {
  const rng = makeSeededRandom(`signal-garden:weather:${key}`);
  return WEATHER_PRESETS[Math.floor(rng() * WEATHER_PRESETS.length)] ?? WEATHER_PRESETS[0];
}

function getAccentColor(index, preset = currentWeatherPreset) {
  return preset.accents[index] ?? preset.accents[0] ?? '#8ddcff';
}

function getAccentToken(index) {
  const safeIndex = clamp(index, 0, ACCENT_SLOT_COUNT - 1);
  return `var(--weather-accent-${safeIndex})`;
}

function ensureSignalChorusStyles() {
  if (document.getElementById(SIGNAL_OVERLAY_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = SIGNAL_OVERLAY_STYLE_ID;
  style.textContent = `
    .stage[data-chorus="true"] .signal-overlay {
      opacity: 1;
    }

    .signal-chorus-group {
      mix-blend-mode: screen;
      filter: drop-shadow(0 0 14px color-mix(in srgb, var(--accent-soft) 26%, transparent));
    }

    .signal-chorus-thread {
      fill: none;
      stroke-linecap: round;
      stroke-dasharray: 8 14;
      animation: signal-chorus-thread 4.8s ease-in-out infinite;
    }

    .signal-chorus-node {
      transform-origin: center;
      animation: signal-chorus-node 3.9s ease-in-out infinite;
    }

    .signal-chorus-halo {
      fill: none;
      transform-origin: center;
      animation: signal-chorus-halo 5.8s ease-in-out infinite;
    }

    .signal-chorus-flare {
      animation: signal-chorus-flare 4.4s ease-in-out infinite;
      transform-origin: center;
    }

    @keyframes signal-chorus-thread {
      0% { opacity: 0.16; stroke-dashoffset: 0; }
      22% { opacity: 0.58; }
      50% { opacity: 0.34; stroke-dashoffset: -28; }
      78% { opacity: 0.72; }
      100% { opacity: 0.18; stroke-dashoffset: -56; }
    }

    @keyframes signal-chorus-node {
      0%, 100% { opacity: 0.42; transform: scale(0.86); }
      35% { opacity: 0.78; transform: scale(1.1); }
      62% { opacity: 1; transform: scale(1.22); }
    }

    @keyframes signal-chorus-halo {
      0%, 100% { opacity: 0.14; transform: scale(0.92); }
      38% { opacity: 0.34; transform: scale(1.02); }
      68% { opacity: 0.2; transform: scale(1.14); }
    }

    @keyframes signal-chorus-flare {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      48% { opacity: 0.7; transform: scale(1.08); }
      72% { opacity: 0.96; transform: scale(1.2); }
    }
  `;
  document.head.appendChild(style);
}

function syncSignalOverlayFrame({ width = stage?.clientWidth ?? CANONICAL_STAGE_WIDTH, height = stage?.clientHeight ?? CANONICAL_STAGE_HEIGHT } = {}) {
  if (!signalOverlay) return;

  signalOverlay.setAttribute('viewBox', `0 0 ${Math.max(1, Math.round(width))} ${Math.max(1, Math.round(height))}`);
  signalOverlay.setAttribute('preserveAspectRatio', 'none');
}

function ensureSignalOverlayLayers() {
  if (!signalOverlay) return null;

  ensureSignalChorusStyles();
  syncSignalOverlayFrame();

  const svgNS = 'http://www.w3.org/2000/svg';
  const needsReset = !signalOverlayChorusGroup?.isConnected || !signalOverlayFlashGroup?.isConnected;
  if (needsReset) {
    signalOverlay.innerHTML = '';
    signalOverlayChorusGroup = document.createElementNS(svgNS, 'g');
    signalOverlayChorusGroup.setAttribute('class', 'signal-chorus-group signal-overlay-chorus');
    signalOverlayFlashGroup = document.createElementNS(svgNS, 'g');
    signalOverlayFlashGroup.setAttribute('class', 'signal-overlay-flash');
    signalOverlay.append(signalOverlayChorusGroup, signalOverlayFlashGroup);
  }

  return {
    chorusGroup: signalOverlayChorusGroup,
    flashGroup: signalOverlayFlashGroup,
  };
}

function getSignalChorusAnchor(width, height, phase, blooms, cursorPoint = signalCursorPoint) {
  if (!blooms.length) {
    const center = {
      x: width * 0.5 + Math.sin(phase * 0.9) * 20,
      y: height * 0.56 + Math.cos(phase * 0.7) * 14,
    };

    if (!cursorPoint) return center;

    return {
      x: center.x * 0.6 + cursorPoint.x * 0.4,
      y: center.y * 0.6 + cursorPoint.y * 0.4,
    };
  }

  const anchorSamples = blooms.slice(-Math.min(5, blooms.length));
  const totalWeight = anchorSamples.reduce((sum, _, index) => sum + index + 1, 0);
  const weighted = anchorSamples.reduce((acc, spec, index) => {
    const weight = index + 1;
    acc.x += spec.x * weight;
    acc.y += spec.y * weight;
    return acc;
  }, { x: 0, y: 0 });

  const base = {
    x: weighted.x / totalWeight,
    y: weighted.y / totalWeight,
  };
  const orbit = {
    x: base.x + Math.sin(phase * 0.75) * 18 + Math.cos(phase * 0.31) * 8,
    y: base.y + Math.cos(phase * 0.68) * 14 + Math.sin(phase * 0.29) * 6,
  };

  if (!cursorPoint) return orbit;

  return {
    x: orbit.x * 0.64 + cursorPoint.x * 0.36,
    y: orbit.y * 0.64 + cursorPoint.y * 0.36,
  };
}

function buildSignalChorusLayout({ width = stage?.clientWidth ?? CANONICAL_STAGE_WIDTH, height = stage?.clientHeight ?? CANONICAL_STAGE_HEIGHT, phase = 0, cursorPoint = signalCursorPoint } = {}) {
  const blooms = bloomHistory.slice(-12);
  const anchor = getSignalChorusAnchor(width, height, phase, blooms, cursorPoint);
  const threads = [];
  const nodes = [];
  const halos = [];
  const flares = [];

  halos.push(
    {
      x: anchor.x,
      y: anchor.y,
      radius: Math.max(32, 40 + blooms.length * 4),
      accentIndex: blooms[0]?.accentIndex ?? 1,
      opacity: 0.18,
      delay: 0.1,
      duration: 5.4,
    },
    {
      x: anchor.x,
      y: anchor.y,
      radius: Math.max(54, 72 + blooms.length * 3),
      accentIndex: blooms[1]?.accentIndex ?? blooms[0]?.accentIndex ?? 3,
      opacity: 0.1,
      delay: 0.48,
      duration: 6.4,
    },
  );

  blooms.forEach((spec, index) => {
    const spread = 14 + index * 2.2;
    const curveX = (spec.x + anchor.x) / 2 + Math.sin(phase * 1.4 + index * 0.84) * spread;
    const curveY = (spec.y + anchor.y) / 2 + Math.cos(phase * 1.2 + index * 0.71) * (spread * 0.72);
    const accentIndex = spec.accentIndex;
    const distance = Math.hypot(spec.x - anchor.x, spec.y - anchor.y);
    const threadOpacity = clamp(0.22 + (1 - index / Math.max(1, blooms.length)) * 0.42, 0.16, 0.72);

    threads.push({
      x1: spec.x,
      y1: spec.y,
      cx: curveX,
      cy: curveY,
      x2: anchor.x,
      y2: anchor.y,
      accentIndex,
      width: clamp(1.2 + (1 - index / Math.max(1, blooms.length)) * 1.4, 1.1, 3.4),
      opacity: threadOpacity,
      delay: index * 0.14,
      duration: 3.8 + index * 0.08,
      dashA: Math.max(7, Math.round(distance / 18)),
      dashB: Math.max(10, Math.round(distance / 11)),
    });

    nodes.push({
      x: spec.x,
      y: spec.y,
      accentIndex,
      radius: clamp(2.4 + index * 0.14, 2.4, 4.8),
      opacity: clamp(0.48 + (1 - index / Math.max(1, blooms.length)) * 0.38, 0.46, 0.96),
      delay: index * 0.07,
      duration: 3.2 + index * 0.05,
    });

    if (index % 3 === 0) {
      const flareX = spec.x + Math.sin(phase * 1.7 + index) * 16;
      const flareY = spec.y - spec.stemHeight * 0.48 + Math.cos(phase * 1.2 + index * 0.5) * 10;
      flares.push({
        x: clamp(flareX, 0, width),
        y: clamp(flareY, 0, height),
        accentIndex,
        radius: 5 + (index % 4),
        opacity: 0.28 + (index % 5) * 0.06,
        delay: index * 0.1,
        duration: 4.4 + index * 0.12,
      });
    }
  });

  if (cursorPoint) {
    const pointerDistance = Math.hypot(cursorPoint.x - anchor.x, cursorPoint.y - anchor.y);
    threads.push({
      x1: anchor.x,
      y1: anchor.y,
      cx: (anchor.x + cursorPoint.x) / 2 + Math.sin(phase * 2.1) * 18,
      cy: (anchor.y + cursorPoint.y) / 2 + Math.cos(phase * 1.6) * 12,
      x2: cursorPoint.x,
      y2: cursorPoint.y,
      accentIndex: blooms[blooms.length - 1]?.accentIndex ?? 4,
      width: clamp(1.1 + pointerDistance / 220, 1.1, 3.1),
      opacity: 0.58,
      delay: 0,
      duration: 2.8,
      dashA: Math.max(10, Math.round(pointerDistance / 14)),
      dashB: Math.max(12, Math.round(pointerDistance / 10)),
    });

    flares.push({
      x: cursorPoint.x,
      y: cursorPoint.y,
      accentIndex: blooms[blooms.length - 1]?.accentIndex ?? 2,
      radius: clamp(5.8 + blooms.length * 0.16, 5.8, 8.8),
      opacity: 0.42,
      delay: 0.08,
      duration: 3.6,
    });
  } else if (!blooms.length) {
    for (let index = 0; index < 3; index += 1) {
      const angle = phase * 1.2 + index * 2.09439510239;
      flares.push({
        x: anchor.x + Math.cos(angle) * (20 + index * 6),
        y: anchor.y + Math.sin(angle) * (12 + index * 4),
        accentIndex: index + 2,
        radius: 4.8 + index,
        opacity: 0.28 + index * 0.08,
        delay: index * 0.12,
        duration: 4.2 + index * 0.18,
      });
    }
  }

  return {
    anchor,
    blooms,
    threads,
    nodes,
    halos,
    flares,
  };
}

function startSignalChorusLoop() {
  if (signalChorusFrame !== null) return;

  const tick = () => {
    if (!signalChorusEnabled) {
      signalChorusFrame = null;
      return;
    }

    renderSignalOverlay(performance.now());
    signalChorusFrame = window.requestAnimationFrame(tick);
  };

  signalChorusFrame = window.requestAnimationFrame(tick);
}

function stopSignalChorusLoop() {
  if (signalChorusFrame !== null) {
    window.cancelAnimationFrame(signalChorusFrame);
    signalChorusFrame = null;
  }
}

function getIdleMood(preset = currentWeatherPreset) {
  return preset.idleMood ?? preset.moods[0] ?? 'violet hush';
}

function syncWeatherUi() {
  if (weatherModeEl) weatherModeEl.textContent = currentWeatherPreset.label;
  if (!cycleWeatherBtn) return;

  cycleWeatherBtn.textContent = `weather: ${currentWeatherPreset.label}`;
  cycleWeatherBtn.title = fieldSourceMode === 'broadcast'
    ? 'Daily signal weather is locked to that UTC broadcast.'
    : 'Cycle the current garden through alternate weather palettes.';
  cycleWeatherBtn.disabled = fieldSourceMode === 'broadcast';
}

function syncWeaveUi() {
  if (stage) {
    stage.dataset.weave = String(constellationWeaveEnabled);
  }

  if (weaveModeEl) {
    weaveModeEl.textContent = constellationWeaveEnabled ? 'on' : 'off';
  }

  if (toggleWeaveBtn) {
    toggleWeaveBtn.textContent = constellationWeaveEnabled ? 'constellations: on' : 'constellations: off';
    toggleWeaveBtn.setAttribute('aria-pressed', String(constellationWeaveEnabled));
    toggleWeaveBtn.title = constellationWeaveEnabled
      ? 'Hide the ambient links between blooms.'
      : 'Reveal the ambient links between blooms.';
  }
}

function syncMeteorUi() {
  if (stage) {
    stage.dataset.meteor = String(meteorShowerEnabled);
  }

  if (meteorModeEl) {
    meteorModeEl.textContent = meteorShowerEnabled ? 'on' : 'off';
  }

  if (toggleMeteorBtn) {
    toggleMeteorBtn.textContent = meteorShowerEnabled ? 'meteor shower: on' : 'meteor shower: off';
    toggleMeteorBtn.setAttribute('aria-pressed', String(meteorShowerEnabled));
    toggleMeteorBtn.title = meteorShowerEnabled
      ? 'Dim the falling meteor streaks.'
      : 'Turn on a falling meteor shower over the garden.';
  }
}

function syncAfterimageUi() {
  if (afterimageModeEl) {
    afterimageModeEl.textContent = afterimageEnabled ? 'on' : 'off';
  }

  if (toggleAfterimageBtn) {
    toggleAfterimageBtn.textContent = afterimageEnabled ? 'afterimages: on' : 'afterimages: off';
    toggleAfterimageBtn.setAttribute('aria-pressed', String(afterimageEnabled));
    toggleAfterimageBtn.title = afterimageEnabled
      ? 'Quiet the ghost bloom afterimages.'
      : 'Wake the phosphor afterimages that trail recent blooms.';
  }

  if (toggleHarmonyBtn) {
    toggleHarmonyBtn.hidden = true;
  }

  if (harmonyModeEl) {
    const legacyHudTile = harmonyModeEl.closest('.hud-tile');
    if (legacyHudTile) legacyHudTile.hidden = true;
  }

  renderAfterimageState();
}

function syncHarmonyUi() {
  if (stage) {
    stage.dataset.chorus = String(signalChorusEnabled);
  }

  if (harmonyModeEl) {
    harmonyModeEl.textContent = signalChorusEnabled ? 'on' : 'off';
  }

  if (toggleHarmonyBtn) {
    toggleHarmonyBtn.textContent = signalChorusEnabled ? 'afterimages: on' : 'afterimages: off';
    toggleHarmonyBtn.setAttribute('aria-pressed', String(signalChorusEnabled));
    toggleHarmonyBtn.title = signalChorusEnabled
      ? 'Quiet the living afterimages.'
      : 'Wake the hidden afterimage trail into motion.';
  }
}

function setAfterimageEnabled(nextEnabled, { syncUrl = true, logMessage = null } = {}) {
  afterimageEnabled = Boolean(nextEnabled);
  syncAfterimageUi();

  if (!afterimageEnabled) {
    afterimageCursorTrail = [];
    afterimageCursorStampAt = 0;
    stage?.querySelectorAll('.afterimage-copy').forEach((node) => node.remove());
  }

  if (logMessage) {
    logField(logMessage, afterimageEnabled ? 'afterimages on' : 'afterimages off');
  }

  if (syncUrl) syncShareState();
}

function renderAfterimageState() {
  if (!stage) return;
  stage.dataset.afterimage = String(afterimageEnabled);
  stage.dataset.afterimages = String(afterimageEnabled);
}

function setWeatherPreset(weatherId, options = {}) {
  const { syncUrl = true, logMessage = null, status = 'weather shifted' } = options;
  currentWeatherPreset = getWeatherPresetById(weatherId);
  document.body.dataset.weather = currentWeatherPreset.id;
  themeColorMeta?.setAttribute('content', currentWeatherPreset.themeColor);
  updateCritterUi();

  if (bloomHistory.length) {
    const lastSpec = bloomHistory[bloomHistory.length - 1];
    setMood(chooseMoodFromSpec(lastSpec, currentWeatherPreset));
  } else {
    setMood(getIdleMood(currentWeatherPreset));
  }

  syncWeatherUi();
  syncArchiveStatus();
  renderConstellationOverlay();
  renderMeteorOverlay();
  renderSignalOverlay();

  if (logMessage) {
    logField(logMessage, status);
  }

  if (syncUrl) syncShareState();
}

function cycleWeatherMode() {
  if (fieldSourceMode === 'broadcast') return;

  const currentIndex = WEATHER_PRESETS.findIndex((preset) => preset.id === currentWeatherPreset.id);
  const nextPreset = WEATHER_PRESETS[(currentIndex + 1) % WEATHER_PRESETS.length] ?? WEATHER_PRESETS[0];

  setWeatherPreset(nextPreset.id, {
    logMessage: pick(transmissions.weather).replace('{weather}', nextPreset.label),
    status: `weather tuned: ${nextPreset.label}`,
  });
}

function shiftUtcDate(date, offsetDays) {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + offsetDays);
  return shifted;
}

function getCritterSeed() {
  const lastSpec = bloomHistory[bloomHistory.length - 1];
  const anchor = lastSpec
    ? `${lastSpec.adjectiveIndex}:${lastSpec.nounIndex}:${lastSpec.accentIndex}:${bloomHistory.length}`
    : `${fieldSourceMode}:${currentBroadcastKey ?? 'open'}:${currentWeatherPreset.id}`;
  return `signal-garden:critter:${anchor}`;
}

function buildCritterSpec() {
  const rng = makeSeededRandom(getCritterSeed());
  const adjectiveIndex = Math.floor(rand(0, adjectives.length, rng));
  const titleIndex = Math.floor(rand(0, critterTitles.length, rng));
  const accentIndex = Math.floor(rand(0, ACCENT_SLOT_COUNT, rng));
  const laneX = Math.round(rand(14, 84, rng));
  const laneY = Math.round(rand(18, 72, rng));
  const scale = rand(0.84, 1.24, rng);
  const drift = rand(7, 16, rng);
  const duration = rand(8.5, 16.5, rng);
  const tilt = rand(-7, 7, rng);
  const bodyHue = getAccentColor(accentIndex, currentWeatherPreset);
  const ringHue = getAccentColor((accentIndex + 2) % ACCENT_SLOT_COUNT, currentWeatherPreset);
  const blink = rand(2.8, 5.6, rng);
  const mood = critterMoods[Math.floor(rand(0, critterMoods.length, rng))];
  const title = `${adjectives[adjectiveIndex]} ${critterTitles[titleIndex]}`;

  return {
    title,
    mood,
    laneX,
    laneY,
    scale: Number(scale.toFixed(2)),
    drift: Number(drift.toFixed(1)),
    duration: Number(duration.toFixed(2)),
    tilt: Number(tilt.toFixed(1)),
    bodyHue,
    ringHue,
    blink: Number(blink.toFixed(2)),
  };
}

function updateCritterUi() {
  currentCritterSpec = buildCritterSpec();
  const hasBlooms = bloomHistory.length > 0;
  const critterName = hasBlooms ? currentCritterSpec.title : 'vacant terrarium';
  const critterMood = hasBlooms ? currentCritterSpec.mood : 'waiting for a reason to exist';

  if (residentNameEl) residentNameEl.textContent = critterName;
  if (residentMoodEl) residentMoodEl.textContent = critterMood;
  if (!gardenCritterEl) return;

  gardenCritterEl.hidden = !hasBlooms;
  gardenCritterEl.disabled = !hasBlooms;
  gardenCritterEl.setAttribute('aria-label', hasBlooms ? `${critterName}, ${critterMood}` : 'Garden resident is waiting');
  gardenCritterEl.dataset.visible = String(hasBlooms);
  gardenCritterEl.style.setProperty('--critter-x', `${currentCritterSpec.laneX}%`);
  gardenCritterEl.style.setProperty('--critter-y', `${currentCritterSpec.laneY}%`);
  gardenCritterEl.style.setProperty('--critter-scale', String(currentCritterSpec.scale));
  gardenCritterEl.style.setProperty('--critter-drift', `${currentCritterSpec.drift}px`);
  gardenCritterEl.style.setProperty('--critter-duration', `${currentCritterSpec.duration}s`);
  gardenCritterEl.style.setProperty('--critter-tilt', `${currentCritterSpec.tilt}deg`);
  gardenCritterEl.style.setProperty('--critter-body', currentCritterSpec.bodyHue);
  gardenCritterEl.style.setProperty('--critter-ring', currentCritterSpec.ringHue);
  gardenCritterEl.style.setProperty('--critter-blink', `${currentCritterSpec.blink}s`);
  gardenCritterEl.innerHTML = `
    <span class="critter-body">
      <span class="critter-orbit"></span>
      <span class="critter-eye critter-eye-a"></span>
      <span class="critter-eye critter-eye-b"></span>
      <span class="critter-blush critter-blush-a"></span>
      <span class="critter-blush critter-blush-b"></span>
      <span class="critter-mouth"></span>
      <span class="critter-antenna critter-antenna-a"></span>
      <span class="critter-antenna critter-antenna-b"></span>
      <span class="critter-shadow"></span>
    </span>
    <span class="critter-caption">
      <strong>${currentCritterSpec.title}</strong>
      <em>${currentCritterSpec.mood}</em>
    </span>
  `;
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

function chooseMoodFromSpec(spec, preset = currentWeatherPreset) {
  const moodBank = preset.moods;
  return moodBank[(spec.adjectiveIndex * 3 + spec.nounIndex + spec.accentIndex) % moodBank.length];
}

function setMood(nextMood = getIdleMood()) {
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
  const crowding = getLiveBloomElements().filter((bloom) => {
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

function getLiveBloomElements() {
  return stage ? Array.from(stage.querySelectorAll('.bloom:not(.afterimage-copy)')) : [];
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
  syncWeatherUi();
  syncArchiveSelection();
  syncArchiveStatus();
}

function syncControls() {
  const disabled = bloomCount === 0;
  undoBtn.disabled = disabled;
  clearBtn.disabled = disabled;
  replayBtn.disabled = disabled;
  copyLinkBtn.disabled = disabled;
  sharePostcardBtn.disabled = disabled;
  exportPngBtn.disabled = disabled;

  if (disabled) stage.setAttribute('data-empty', 'true');
  else stage.removeAttribute('data-empty');

  hintEl.textContent = disabled
    ? 'Move your cursor to aim a bloom. Click to plant. Press U to undo. Press A for afterimages. Press H to wake the signal chorus.'
    : 'Click to plant. Press U to undo the last bloom. Press C to toggle constellations. Press M to toggle the meteor shower. Press A to toggle afterimages. Press H to toggle the signal chorus. Press W to switch weather when the field is yours.';

  syncWeaveUi();
  syncMeteorUi();
  syncAfterimageUi();
  syncHarmonyUi();
  syncWeatherUi();
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

function drawSignalLink(from, to, accentIndex) {
  if (!from || !to) return;
  if (!signalChorusEnabled) return;

  const layers = ensureSignalOverlayLayers();
  if (!layers) return;

  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', from.x.toFixed(1));
  line.setAttribute('y1', from.y.toFixed(1));
  line.setAttribute('x2', to.x.toFixed(1));
  line.setAttribute('y2', to.y.toFixed(1));
  line.classList.add('signal-line');
  line.style.setProperty('--accent', getAccentToken(accentIndex));
  layers.flashGroup.appendChild(line);
  window.setTimeout(() => line.remove(), 2400);
}

function buildConstellationSegments(sequence, { width = stage?.clientWidth ?? CANONICAL_STAGE_WIDTH, height = stage?.clientHeight ?? CANONICAL_STAGE_HEIGHT } = {}) {
  if (!sequence.length) return [];

  const maxDistance = Math.max(132, Math.min(width, height) * 0.24);
  const segments = [];
  const seen = new Set();

  sequence.forEach((spec, index) => {
    const neighbors = sequence
      .map((other, otherIndex) => {
        if (otherIndex === index) return null;
        const distance = Math.hypot(other.x - spec.x, other.y - spec.y);
        return { other, otherIndex, distance };
      })
      .filter(Boolean)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    neighbors.forEach(({ other, otherIndex, distance }) => {
      if (distance > maxDistance) return;

      const key = index < otherIndex ? `${index}:${otherIndex}` : `${otherIndex}:${index}`;
      if (seen.has(key)) return;
      seen.add(key);
      segments.push({
        from: spec,
        to: other,
        distance,
        accentIndex: spec.accentIndex,
      });
    });
  });

  return segments.sort((a, b) => a.distance - b.distance);
}

function renderConstellationOverlay() {
  if (!constellationOverlay) return;

  const width = Math.max(1, Math.round(stage?.clientWidth ?? CANONICAL_STAGE_WIDTH));
  const height = Math.max(1, Math.round(stage?.clientHeight ?? CANONICAL_STAGE_HEIGHT));
  constellationOverlay.setAttribute('viewBox', `0 0 ${width} ${height}`);
  constellationOverlay.setAttribute('preserveAspectRatio', 'none');
  constellationOverlay.innerHTML = '';

  if (!constellationWeaveEnabled || bloomHistory.length < 2) return;

  const segments = buildConstellationSegments(bloomHistory, { width, height });
  const svgNS = 'http://www.w3.org/2000/svg';
  const group = document.createElementNS(svgNS, 'g');
  group.setAttribute('class', 'constellation-group');

  segments.forEach((segment, index) => {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', segment.from.x.toFixed(1));
    line.setAttribute('y1', segment.from.y.toFixed(1));
    line.setAttribute('x2', segment.to.x.toFixed(1));
    line.setAttribute('y2', segment.to.y.toFixed(1));
    line.classList.add('constellation-line');
    line.style.setProperty('--accent', getAccentToken(segment.accentIndex));
    line.style.setProperty('--distance', `${Math.round(segment.distance)}px`);
    line.style.animationDelay = `${index * 36}ms`;
    group.appendChild(line);

    const beacon = document.createElementNS(svgNS, 'circle');
    beacon.setAttribute('cx', ((segment.from.x + segment.to.x) / 2).toFixed(1));
    beacon.setAttribute('cy', ((segment.from.y + segment.to.y) / 2).toFixed(1));
    beacon.setAttribute('r', `${Math.max(1.6, Math.min(4.5, 7 - segment.distance / 60)).toFixed(1)}`);
    beacon.classList.add('constellation-beacon');
    beacon.style.setProperty('--accent', getAccentToken(segment.accentIndex));
    beacon.style.animationDelay = `${index * 58}ms`;
    group.appendChild(beacon);
  });

  constellationOverlay.appendChild(group);
}

function getMeteorSeed() {
  const trail = bloomHistory
    .slice(-6)
    .map((spec) => `${Math.round(spec.x)}:${Math.round(spec.y)}:${spec.accentIndex}`)
    .join('|') || 'empty';

  return `signal-garden:meteor:${currentWeatherPreset.id}:${fieldSourceMode}:${currentBroadcastKey ?? 'open'}:${constellationWeaveEnabled ? 'weave' : 'plain'}:${trail}`;
}

function buildMeteorShowerSegments({ width = stage?.clientWidth ?? CANONICAL_STAGE_WIDTH, height = stage?.clientHeight ?? CANONICAL_STAGE_HEIGHT } = {}) {
  const rng = makeSeededRandom(getMeteorSeed());
  const streakCount = clamp(4 + Math.floor(bloomHistory.length / 8) + Math.floor(rand(0, 3, rng)), 4, 11);
  const segments = [];

  for (let index = 0; index < streakCount; index += 1) {
    const fromTop = rand(0, 1, rng) < 0.72;
    const x1 = fromTop
      ? rand(width * 0.06, width * 0.94, rng)
      : rand(width * 0.6, width * 1.04, rng);
    const y1 = fromTop
      ? rand(-18, height * 0.18, rng)
      : rand(height * 0.08, height * 0.62, rng);
    const length = rand(width * 0.18, width * 0.36, rng);
    const fall = rand(height * 0.12, height * 0.34, rng);
    const diagonal = rand(width * 0.05, width * 0.12, rng);
    const x2 = clamp(x1 - length - diagonal, -60, width + 60);
    const y2 = clamp(y1 + fall, -48, height + 48);
    const accentIndex = Math.floor(rand(0, ACCENT_SLOT_COUNT, rng));
    const strokeWidth = rand(1.2, 3.2, rng);
    const delay = rand(0, 2.4, rng);
    const duration = rand(4.8, 8.2, rng);
    const glow = rand(0.5, 1, rng);
    const headRadius = rand(2.8, 6, rng);

    segments.push({
      id: `${index}-${Math.round(x1)}-${Math.round(y1)}`,
      x1,
      y1,
      x2,
      y2,
      accentIndex,
      strokeWidth,
      delay,
      duration,
      glow,
      headRadius,
      trailLength: Math.hypot(x2 - x1, y2 - y1),
    });
  }

  return segments.sort((a, b) => a.delay - b.delay);
}

function renderMeteorOverlay() {
  if (!meteorOverlay) return;

  const width = Math.max(1, Math.round(stage?.clientWidth ?? CANONICAL_STAGE_WIDTH));
  const height = Math.max(1, Math.round(stage?.clientHeight ?? CANONICAL_STAGE_HEIGHT));
  meteorOverlay.setAttribute('viewBox', `0 0 ${width} ${height}`);
  meteorOverlay.setAttribute('preserveAspectRatio', 'none');
  meteorOverlay.innerHTML = '';

  if (!meteorShowerEnabled) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const group = document.createElementNS(svgNS, 'g');
  group.setAttribute('class', 'meteor-shower-group');

  buildMeteorShowerSegments({ width, height }).forEach((segment) => {
    const streak = document.createElementNS(svgNS, 'g');
    streak.setAttribute('class', 'meteor-shower');
    streak.style.animationDelay = `${segment.delay.toFixed(2)}s`;
    streak.style.animationDuration = `${segment.duration.toFixed(2)}s`;

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', segment.x1.toFixed(1));
    line.setAttribute('y1', segment.y1.toFixed(1));
    line.setAttribute('x2', segment.x2.toFixed(1));
    line.setAttribute('y2', segment.y2.toFixed(1));
    line.classList.add('meteor-shower-line');
    line.style.setProperty('--accent', getAccentToken(segment.accentIndex));
    line.style.setProperty('--meteor-width', `${segment.strokeWidth.toFixed(2)}px`);
    line.style.setProperty('--meteor-glow', String(segment.glow));
    line.style.animationDelay = `${segment.delay.toFixed(2)}s`;
    line.style.animationDuration = `${segment.duration.toFixed(2)}s`;

    const flare = document.createElementNS(svgNS, 'circle');
    flare.setAttribute('cx', segment.x2.toFixed(1));
    flare.setAttribute('cy', segment.y2.toFixed(1));
    flare.setAttribute('r', Math.max(7, segment.headRadius * 2.2).toFixed(1));
    flare.classList.add('meteor-shower-flare');
    flare.style.setProperty('--accent', getAccentToken(segment.accentIndex));
    flare.style.animationDelay = `${(segment.delay + 0.18).toFixed(2)}s`;
    flare.style.animationDuration = `${segment.duration.toFixed(2)}s`;

    const head = document.createElementNS(svgNS, 'circle');
    head.setAttribute('cx', segment.x2.toFixed(1));
    head.setAttribute('cy', segment.y2.toFixed(1));
    head.setAttribute('r', segment.headRadius.toFixed(1));
    head.classList.add('meteor-shower-head');
    head.style.setProperty('--accent', getAccentToken(segment.accentIndex));
    head.style.animationDelay = `${(segment.delay + 0.1).toFixed(2)}s`;
    head.style.animationDuration = `${segment.duration.toFixed(2)}s`;

    streak.append(line, flare, head);
    group.appendChild(streak);
  });

  meteorOverlay.appendChild(group);
}

function getHarmonySeed() {
  const trail = bloomHistory
    .slice(-8)
    .map((spec) => `${Math.round(spec.x)}:${Math.round(spec.y)}:${spec.accentIndex}:${spec.stemHeight}`)
    .join('|') || 'empty';

  return `signal-garden:harmony:${currentWeatherPreset.id}:${fieldSourceMode}:${currentBroadcastKey ?? 'open'}:${constellationWeaveEnabled ? 'weave' : 'plain'}:${meteorShowerEnabled ? 'meteor' : 'quiet'}:${trail}`;
}

function buildHarmonyRings({ width = stage?.clientWidth ?? CANONICAL_STAGE_WIDTH, height = stage?.clientHeight ?? CANONICAL_STAGE_HEIGHT } = {}) {
  const rng = makeSeededRandom(getHarmonySeed());
  const blooms = bloomHistory.slice(-10);
  const rings = [];

  blooms.forEach((spec, bloomIndex) => {
    const centerY = spec.y - spec.stemHeight;
    const ringCount = 1 + Math.floor(rand(0, 2, rng));
    const baseRadius = Math.max(18, spec.ringA * 0.42);
    const baseOpacity = 0.18 + Math.min(0.22, bloomIndex * 0.018);

    for (let index = 0; index < ringCount; index += 1) {
      const radius = clamp(baseRadius + index * rand(14, 28, rng) + rand(-4, 6, rng), 14, Math.max(width, height) * 0.48);
      const delay = rand(0, 2.8, rng);
      const duration = rand(4.8, 8.8, rng);
      const strokeWidth = rand(1.2, 2.8, rng);
      const dashA = Math.round(rand(6, 14, rng));
      const dashB = Math.round(rand(12, 24, rng));

      rings.push({
        id: `${bloomIndex}-${index}-${Math.round(radius)}`,
        x: spec.x,
        y: centerY,
        radius,
        accentIndex: spec.accentIndex,
        delay,
        duration,
        strokeWidth,
        dashA,
        dashB,
        opacity: baseOpacity + index * 0.08,
        bloomIndex,
      });
    }
  });

  return rings.sort((a, b) => a.delay - b.delay || a.radius - b.radius);
}

function renderSignalOverlay(now = performance.now()) {
  if (!signalOverlay) return;

  const width = Math.max(1, Math.round(stage?.clientWidth ?? CANONICAL_STAGE_WIDTH));
  const height = Math.max(1, Math.round(stage?.clientHeight ?? CANONICAL_STAGE_HEIGHT));
  syncSignalOverlayFrame({ width, height });

  const layers = ensureSignalOverlayLayers();
  if (!layers) return;

  layers.chorusGroup.replaceChildren();

  if (!signalChorusEnabled) {
    layers.flashGroup.replaceChildren();
    return;
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const layout = buildSignalChorusLayout({ width, height, phase: now / 1000 });

  layout.halos.forEach((halo, index) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', halo.x.toFixed(1));
    circle.setAttribute('cy', halo.y.toFixed(1));
    circle.setAttribute('r', halo.radius.toFixed(1));
    circle.classList.add('signal-chorus-halo');
    circle.style.setProperty('--accent', getAccentToken(halo.accentIndex));
    circle.style.setProperty('stroke', getAccentToken(halo.accentIndex));
    circle.style.setProperty('stroke-width', `${Math.max(1.4, 2.8 - index * 0.6).toFixed(2)}px`);
    circle.style.setProperty('stroke-dasharray', `${Math.max(12, Math.round(halo.radius / 4))} ${Math.max(18, Math.round(halo.radius / 3))}`);
    circle.style.setProperty('opacity', halo.opacity.toFixed(2));
    circle.style.setProperty('animation-delay', `${halo.delay.toFixed(2)}s`);
    circle.style.setProperty('animation-duration', `${halo.duration.toFixed(2)}s`);
    layers.chorusGroup.appendChild(circle);
  });

  layout.threads.forEach((thread) => {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', `M ${thread.x1.toFixed(1)} ${thread.y1.toFixed(1)} Q ${thread.cx.toFixed(1)} ${thread.cy.toFixed(1)} ${thread.x2.toFixed(1)} ${thread.y2.toFixed(1)}`);
    path.classList.add('signal-chorus-thread');
    path.style.setProperty('--accent', getAccentToken(thread.accentIndex));
    path.style.setProperty('stroke', getAccentToken(thread.accentIndex));
    path.style.setProperty('stroke-width', `${thread.width.toFixed(2)}px`);
    path.style.setProperty('stroke-dasharray', `${thread.dashA} ${thread.dashB}`);
    path.style.setProperty('opacity', thread.opacity.toFixed(2));
    path.style.setProperty('animation-delay', `${thread.delay.toFixed(2)}s`);
    path.style.setProperty('animation-duration', `${thread.duration.toFixed(2)}s`);
    layers.chorusGroup.appendChild(path);
  });

  layout.nodes.forEach((node) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', node.x.toFixed(1));
    circle.setAttribute('cy', node.y.toFixed(1));
    circle.setAttribute('r', node.radius.toFixed(1));
    circle.classList.add('signal-chorus-node');
    circle.style.setProperty('--accent', getAccentToken(node.accentIndex));
    circle.style.setProperty('fill', getAccentToken(node.accentIndex));
    circle.style.setProperty('opacity', node.opacity.toFixed(2));
    circle.style.setProperty('animation-delay', `${node.delay.toFixed(2)}s`);
    circle.style.setProperty('animation-duration', `${node.duration.toFixed(2)}s`);
    layers.chorusGroup.appendChild(circle);
  });

  layout.flares.forEach((flare) => {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', flare.x.toFixed(1));
    circle.setAttribute('cy', flare.y.toFixed(1));
    circle.setAttribute('r', flare.radius.toFixed(1));
    circle.classList.add('signal-chorus-flare');
    circle.style.setProperty('--accent', getAccentToken(flare.accentIndex));
    circle.style.setProperty('fill', getAccentToken(flare.accentIndex));
    circle.style.setProperty('opacity', flare.opacity.toFixed(2));
    circle.style.setProperty('animation-delay', `${flare.delay.toFixed(2)}s`);
    circle.style.setProperty('animation-duration', `${flare.duration.toFixed(2)}s`);
    layers.chorusGroup.appendChild(circle);
  });
}

function round1(value) {
  return Number(value.toFixed(1));
}

function makeBloomSpec(x, y, randomFn = Math.random) {
  const adjectiveIndex = Math.floor(rand(0, adjectives.length, randomFn));
  const nounIndex = Math.floor(rand(0, nouns.length, randomFn));
  const accentIndex = Math.floor(rand(0, ACCENT_SLOT_COUNT, randomFn));

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

function spawnAfterimageGhosts(spec, priorPoint = null) {
  if (!afterimageEnabled || !stage || !template) return;

  const name = makeNameFromIndexes(spec.adjectiveIndex, spec.nounIndex);
  const basePoint = priorPoint ?? { x: spec.x, y: spec.y };
  const driftX = spec.x - basePoint.x;
  const driftY = spec.y - basePoint.y;
  const echoes = priorPoint
    ? [
      { offset: 0.18, opacity: 0.24, scale: 0.98, blur: 0.7, life: 1900 },
      { offset: 0.36, opacity: 0.16, scale: 0.94, blur: 1, life: 2300 },
      { offset: 0.56, opacity: 0.1, scale: 0.9, blur: 1.4, life: 2700 },
    ]
    : [
      { offset: 0.1, opacity: 0.18, scale: 0.97, blur: 0.7, life: 1700 },
      { offset: 0.28, opacity: 0.11, scale: 0.93, blur: 1.1, life: 2100 },
    ];

  echoes.forEach((echo, index) => {
    const ghost = template.content.firstElementChild.cloneNode(true);
    const echoX = spec.x - driftX * echo.offset + Math.sin((spec.x + spec.y + index * 17) * 0.015) * (6 + index * 2);
    const echoY = spec.y - driftY * echo.offset + Math.cos((spec.x - spec.y + index * 13) * 0.018) * (5 + index * 1.5);

    ghost.classList.add('afterimage-copy');
    ghost.setAttribute('aria-hidden', 'true');
    ghost.style.left = `${echoX}px`;
    ghost.style.top = `${echoY}px`;
    ghost.style.opacity = String(echo.opacity);
    ghost.style.zIndex = '2';
    ghost.style.pointerEvents = 'none';
    ghost.style.mixBlendMode = 'screen';
    ghost.style.filter = `blur(${echo.blur}px) saturate(0.7)`;
    ghost.style.transition = 'opacity 1.8s ease-out, transform 1.8s ease-out, filter 1.8s ease-out';
    ghost.style.setProperty('--accent', getAccentToken(spec.accentIndex));
    ghost.style.setProperty('--stem-height', `${spec.stemHeight}px`);
    ghost.style.setProperty('--ring-a', `${spec.ringA}px`);
    ghost.style.setProperty('--ring-b', `${spec.ringB}px`);
    ghost.style.setProperty('--tilt', `${spec.tilt}deg`);
    ghost.querySelector('.label').textContent = name;
    ghost.querySelector('.label').style.opacity = '0.68';
    ghost.querySelector('.core').style.opacity = '0.82';
    ghost.querySelector('.ring-a').style.opacity = '0.5';
    ghost.querySelector('.ring-b').style.opacity = '0.36';
    ghost.style.transform = `translate(-50%, -78%) translate(${driftX * echo.offset}px, ${driftY * echo.offset}px) scale(${echo.scale})`;

    stage.appendChild(ghost);
    window.requestAnimationFrame(() => {
      ghost.style.opacity = '0';
      ghost.style.transform = `translate(-50%, -78%) translate(${driftX * (echo.offset + 0.08)}px, ${driftY * (echo.offset + 0.08)}px) scale(${Math.min(1.02, echo.scale + 0.03)})`;
    });

    window.setTimeout(() => ghost.remove(), echo.life);
  });

  const ghostCount = stage.querySelectorAll('.afterimage-copy').length;
  if (ghostCount > AFTERIMAGE_GHOST_LIMIT) {
    stage.querySelector('.afterimage-copy')?.remove();
  }
}

function pruneAfterimageCursorTrail(now = performance.now()) {
  afterimageCursorTrail = afterimageCursorTrail.filter((point) => now - point.at < 3600);
}

function stampAfterimageCursorGhost(x, y, accentIndex = 0, priorPoint = null) {
  if (!afterimageEnabled || !stage || !template) return;

  const ghost = template.content.firstElementChild.cloneNode(true);
  const now = performance.now();
  const originPoint = priorPoint ?? afterimageCursorTrail[afterimageCursorTrail.length - 2] ?? { x, y };
  const driftX = x - originPoint.x;
  const driftY = y - originPoint.y;
  const ghostX = x - driftX * 0.18 + Math.sin((x + y + now) * 0.01) * 3;
  const ghostY = y - driftY * 0.18 + Math.cos((x - y + now) * 0.01) * 3;

  ghost.classList.add('afterimage-copy');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.style.left = `${ghostX}px`;
  ghost.style.top = `${ghostY}px`;
  ghost.style.opacity = '0.16';
  ghost.style.zIndex = '2';
  ghost.style.pointerEvents = 'none';
  ghost.style.mixBlendMode = 'screen';
  ghost.style.filter = 'blur(1.2px) saturate(0.72)';
  ghost.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out, filter 1.5s ease-out';
  ghost.style.setProperty('--accent', getAccentToken(accentIndex));
  ghost.style.setProperty('--stem-height', '42px');
  ghost.style.setProperty('--ring-a', '44px');
  ghost.style.setProperty('--ring-b', '76px');
  ghost.style.setProperty('--tilt', `${round1(Math.sin((x + y) * 0.02) * 18)}deg`);
  ghost.querySelector('.label').textContent = '';
  ghost.querySelector('.label').style.opacity = '0';
  ghost.querySelector('.core').style.opacity = '0.68';
  ghost.querySelector('.ring-a').style.opacity = '0.42';
  ghost.querySelector('.ring-b').style.opacity = '0.28';
  ghost.querySelector('.spark-a').style.opacity = '0.24';
  ghost.querySelector('.spark-b').style.opacity = '0.24';
  ghost.style.transform = 'translate(-50%, -78%) scale(0.64)';

  stage.appendChild(ghost);
  window.requestAnimationFrame(() => {
    ghost.style.opacity = '0';
    ghost.style.transform = 'translate(-50%, -78%) translate(0px, 0px) scale(0.72)';
  });

  window.setTimeout(() => ghost.remove(), 1900);
}

function recordAfterimageCursorPoint(x, y, accentIndex = 0, { stampGhost = false, priorPoint = null } = {}) {
  if (!afterimageEnabled) return;

  const now = performance.now();
  pruneAfterimageCursorTrail(now);
  afterimageCursorTrail.push({
    x: round1(x),
    y: round1(y),
    accentIndex,
    at: now,
  });

  while (afterimageCursorTrail.length > AFTERIMAGE_CURSOR_LIMIT) {
    afterimageCursorTrail.shift();
  }

  if (!stampGhost) return;

  if (now - afterimageCursorStampAt < 70) return;
  const anchor = priorPoint ?? afterimageCursorTrail[afterimageCursorTrail.length - 2] ?? null;
  if (anchor && Math.hypot(x - anchor.x, y - anchor.y) < 10) return;

  afterimageCursorStampAt = now;
  stampAfterimageCursorGhost(x, y, accentIndex, anchor);
}

function renderBloom(spec, options = {}) {
  const { logPlant = true, syncUrl = true, animateLink = true } = options;
  const node = template.content.firstElementChild.cloneNode(true);
  const name = makeNameFromIndexes(spec.adjectiveIndex, spec.nounIndex);
  const hadLink = Boolean(previousBloomPoint);
  const priorPoint = previousBloomPoint ? { ...previousBloomPoint } : null;

  node.style.left = `${spec.x}px`;
  node.style.top = `${spec.y}px`;
  node.style.setProperty('--accent', getAccentToken(spec.accentIndex));
  node.style.setProperty('--stem-height', `${spec.stemHeight}px`);
  node.style.setProperty('--ring-a', `${spec.ringA}px`);
  node.style.setProperty('--ring-b', `${spec.ringB}px`);
  node.style.setProperty('--tilt', `${spec.tilt}deg`);
  node.querySelector('.label').textContent = name;

  if (animateLink) {
    drawSignalLink(previousBloomPoint, { x: spec.x, y: spec.y }, spec.accentIndex);
  }
  if (afterimageEnabled) {
    spawnAfterimageGhosts(spec, priorPoint);
    recordAfterimageCursorPoint(spec.x, spec.y, spec.accentIndex);
  }
  previousBloomPoint = { x: spec.x, y: spec.y };

  stage.appendChild(node);
  bloomHistory.push(spec);
  bloomCount += 1;
  countEl.textContent = String(bloomCount);
  lastNameEl.textContent = name;
  setMood(chooseMoodFromSpec(spec, currentWeatherPreset));

  if (logPlant) {
    logField(choosePlantTransmission(name, hadLink, spec.x, spec.y), `tracking ${bloomCount} bloom${bloomCount === 1 ? '' : 's'}`);
  }

  if (bloomCount > MAX_BLOOMS) {
    stage.querySelector('.bloom:not(.afterimage-copy)')?.remove();
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
  updateCritterUi();
  renderConstellationOverlay();
  renderMeteorOverlay();
  renderAfterimageState();
  renderSignalOverlay();
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
  if (accentIndex < 0 || accentIndex >= ACCENT_SLOT_COUNT) return null;

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

function getGardenUrl(encodedGarden, weatherId = currentWeatherPreset.id) {
  const params = new URLSearchParams();
  params.set('garden', encodedGarden);
  params.set('weather', weatherId);
  return `${getBaseUrl()}#${params.toString()}`;
}

function buildHashString() {
  const params = new URLSearchParams();

  if (hashMode === 'broadcast' && currentBroadcastKey) {
    params.set('broadcast', currentBroadcastKey);
  } else if (bloomHistory.length) {
    params.set('garden', bloomHistory.map(encodeBloom).join('~'));
    params.set('weather', currentWeatherPreset.id);
  }

  if (constellationWeaveEnabled) {
    params.set('weave', '1');
  }

  if (meteorShowerEnabled) {
    params.set('meteor', '1');
  }

  if (afterimageEnabled) {
    params.set('afterimage', '1');
  }

  if (!params.toString()) return '';

  return params.toString();
}

function makeShareUrl() {
  const base = getBaseUrl();
  const hash = buildHashString();
  return hash ? `${base}#${hash}` : base;
}

function syncShareState() {
  if (suppressHashSync) return;

  const nextHash = buildHashString();
  const nextUrl = nextHash ? `${window.location.pathname}#${nextHash}` : window.location.pathname;
  history.replaceState(null, '', nextUrl);
}

function setConstellationWeave(nextEnabled, { syncUrl = true, logMessage = null } = {}) {
  constellationWeaveEnabled = Boolean(nextEnabled);
  syncWeaveUi();
  renderConstellationOverlay();

  if (logMessage) {
    logField(logMessage, constellationWeaveEnabled ? 'constellations on' : 'constellations off');
  }

  if (syncUrl) syncShareState();
}

function setMeteorShowerEnabled(nextEnabled, { syncUrl = true, logMessage = null } = {}) {
  meteorShowerEnabled = Boolean(nextEnabled);
  syncMeteorUi();
  renderMeteorOverlay();

  if (logMessage) {
    logField(logMessage, meteorShowerEnabled ? 'meteor shower on' : 'meteor shower off');
  }

  if (syncUrl) syncShareState();
}

function setSignalChorusEnabled(nextEnabled, { syncUrl = true, logMessage = null } = {}) {
  signalChorusEnabled = Boolean(nextEnabled);
  syncHarmonyUi();
  if (signalChorusEnabled) startSignalChorusLoop();
  else stopSignalChorusLoop();
  renderSignalOverlay();

  if (logMessage) {
    logField(logMessage, signalChorusEnabled ? 'afterimages on' : 'afterimages off');
  }

  if (syncUrl) syncShareState();
}

function toggleMeteorShower() {
  const nextEnabled = !meteorShowerEnabled;
  setMeteorShowerEnabled(nextEnabled, {
    logMessage: nextEnabled
      ? 'The sky opened up and a meteor shower started tracing silver gossip across the field.'
      : 'The meteor shower drifted away, leaving only the afterglow behind.',
  });
}

function toggleAfterimageField() {
  const nextEnabled = !afterimageEnabled;
  setAfterimageEnabled(nextEnabled, {
    logMessage: nextEnabled
      ? 'The blooms started leaving afterimages behind, like phosphor trapped in glass.'
      : 'The afterimages faded out and the field went plain again.',
  });
}

function toggleConstellationWeave() {
  const nextEnabled = !constellationWeaveEnabled;
  setConstellationWeave(nextEnabled, {
    logMessage: nextEnabled
      ? 'The field started sketching constellations between blooms.'
      : 'The ambient links are still glowing under the blooms.',
  });
}

function toggleHarmonyField() {
  const nextEnabled = !signalChorusEnabled;
  setSignalChorusEnabled(nextEnabled, {
    logMessage: nextEnabled
      ? 'The afterimage field woke up and started ring-singing through the blooms.'
      : 'The afterimage field settled back into the dirt and went quiet.',
  });
}

function resetField({ logMessage = null, status = 'awaiting first contact', keepLogs = false, syncUrl = true, mood = true } = {}) {
  clearReplayTimers();
  stage.querySelectorAll('.bloom').forEach((bloom) => bloom.remove());
  stage.querySelectorAll('.afterimage-copy').forEach((ghost) => ghost.remove());
  afterimageCursorTrail = [];
  afterimageCursorStampAt = 0;
  if (signalOverlayFlashGroup) signalOverlayFlashGroup.replaceChildren();
  if (signalOverlayChorusGroup) signalOverlayChorusGroup.replaceChildren();
  signalCursorPoint = null;
  previousBloomPoint = null;
  bloomCount = 0;
  bloomHistory = [];
  countEl.textContent = '0';
  lastNameEl.textContent = 'none yet';
  if (!keepLogs) fieldLogEl.innerHTML = '';
  if (logMessage) logField(logMessage, status);
  if (mood) setMood(getIdleMood(currentWeatherPreset));
  syncControls();
  syncArchiveStatus();
  updateCritterUi();
  renderConstellationOverlay();
  renderMeteorOverlay();
  renderSignalOverlay();
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
  const blooms = getLiveBloomElements();
  const latestBloom = blooms[blooms.length - 1];
  if (!latestBloom) return;

  const removedName = latestBloom.querySelector('.label')?.textContent ?? 'that bloom';
  latestBloom.remove();
  bloomHistory.pop();
  bloomCount = Math.max(0, bloomCount - 1);
  countEl.textContent = String(bloomCount);

  const remainingBlooms = getLiveBloomElements();
  const nextLastBloom = remainingBlooms[remainingBlooms.length - 1];
  lastNameEl.textContent = nextLastBloom?.querySelector('.label')?.textContent ?? 'none yet';

  if (bloomHistory.length) {
    const lastSpec = bloomHistory[bloomHistory.length - 1];
    previousBloomPoint = { x: lastSpec.x, y: lastSpec.y };
    setMood(chooseMoodFromSpec(lastSpec, currentWeatherPreset));
  } else {
    previousBloomPoint = null;
    if (signalOverlayFlashGroup) signalOverlayFlashGroup.replaceChildren();
    if (signalOverlayChorusGroup) signalOverlayChorusGroup.replaceChildren();
    setMood(getIdleMood(currentWeatherPreset));
  }

  logField(pick(transmissions.undo).replace('{name}', removedName), bloomCount === 0 ? 'field standing by' : `tracking ${bloomCount} bloom${bloomCount === 1 ? '' : 's'}`);
  syncControls();
  syncArchiveStatus();
  updateCritterUi();
  renderConstellationOverlay();
  renderMeteorOverlay();
  renderSignalOverlay();
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
  const mood = escapeXml(moodEl.textContent || getIdleMood(currentWeatherPreset));
  const weatherLabel = escapeXml(currentWeatherPreset.label.toUpperCase());
  const sourceLabel = escapeXml(sourceLabelEl.textContent || 'open field');
  const exportTheme = currentWeatherPreset.export;
  const skyModeLabel = meteorShowerEnabled ? 'meteor shower on' : 'meteor shower off';
  const signalModeLabel = signalChorusEnabled ? 'signal chorus on' : 'signal chorus off';
  const lastBloom = bloomHistory[bloomHistory.length - 1] ?? null;
  const lastBloomName = lastBloom
    ? escapeXml(makeNameFromIndexes(lastBloom.adjectiveIndex, lastBloom.nounIndex))
    : 'none yet';
  const exportDateKey = currentBroadcastKey ?? getUtcDateKey();
  const exportDateLabel = escapeXml(formatBroadcastDate(exportDateKey));
  const gardenTitle = escapeXml(
    fieldSourceMode === 'broadcast' && currentBroadcastKey
      ? `Daily signal • ${exportDateLabel}`
      : fieldSourceMode === 'shared'
        ? 'Shared garden postcard'
        : 'Signal Garden postcard'
  );
  const gardenSubtitle = escapeXml(
    fieldSourceMode === 'broadcast' && currentBroadcastKey
      ? `UTC broadcast ${currentBroadcastKey} • ${bloomHistory.length} blooms`
      : `${bloomHistory.length} blooms • weather set to ${currentWeatherPreset.label}`
  );
  const footerCopy = escapeXml(`signal.garden • ${fieldSourceMode === 'broadcast' && currentBroadcastKey ? currentBroadcastKey : 'portable field'}`);
  const skyModeBadgeWidth = Math.min(178, Math.max(132, width - 272));
  const skyModeBadgeX = Math.max(16, width - skyModeBadgeWidth - 64);
  const summaryItems = [
    { label: 'WEATHER', value: weatherLabel },
    { label: 'SOURCE', value: sourceLabel },
    { label: 'LAST BLOOM', value: lastBloomName },
    { label: 'COUNT', value: String(bloomHistory.length) },
    { label: 'AFTERIMAGES', value: afterimageEnabled ? 'ON' : 'OFF' },
    { label: 'SIGNAL', value: escapeXml(signalModeLabel.toUpperCase()) },
  ];

  const links = bloomHistory.slice(1).map((spec, index) => {
    const previous = bloomHistory[index];
    const accent = getAccentColor(spec.accentIndex, currentWeatherPreset);
    return `<line x1="${previous.x}" y1="${previous.y}" x2="${spec.x}" y2="${spec.y}" stroke="${accent}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="6 10" opacity="0.5"/>`;
  }).join('');

  const weaveSegments = constellationWeaveEnabled && bloomHistory.length > 1
    ? buildConstellationSegments(bloomHistory, { width, height }).map((segment) => {
      const color = getAccentColor(segment.accentIndex, currentWeatherPreset);
      const radius = Math.max(1.4, Math.min(4.25, 6.6 - segment.distance / 65)).toFixed(1);
      return `
        <g opacity="${Math.max(0.24, 0.58 - segment.distance / 520).toFixed(2)}">
          <line x1="${segment.from.x}" y1="${segment.from.y}" x2="${segment.to.x}" y2="${segment.to.y}" stroke="${color}" stroke-width="${Math.max(1, 2.2 - segment.distance / 220).toFixed(2)}" stroke-linecap="round" stroke-dasharray="7 12" opacity="0.6"/>
          <circle cx="${((segment.from.x + segment.to.x) / 2).toFixed(1)}" cy="${((segment.from.y + segment.to.y) / 2).toFixed(1)}" r="${radius}" fill="${color}" opacity="0.72"/>
        </g>
      `;
    }).join('')
    : '';

  const meteorSegments = meteorShowerEnabled
    ? buildMeteorShowerSegments({ width, height }).map((segment) => {
      const color = getAccentColor(segment.accentIndex, currentWeatherPreset);
      const fade = Math.max(0.35, 0.9 - segment.delay / 3.5);
      return `
        <g opacity="${fade.toFixed(2)}">
          <line x1="${segment.x1.toFixed(1)}" y1="${segment.y1.toFixed(1)}" x2="${segment.x2.toFixed(1)}" y2="${segment.y2.toFixed(1)}" stroke="${color}" stroke-width="${segment.strokeWidth.toFixed(2)}" stroke-linecap="round" stroke-dasharray="${Math.max(14, Math.round(segment.trailLength / 5))} ${Math.max(8, Math.round(segment.trailLength / 9))}" opacity="0.72"/>
          <circle cx="${segment.x2.toFixed(1)}" cy="${segment.y2.toFixed(1)}" r="${segment.headRadius.toFixed(1)}" fill="${color}" opacity="0.9"/>
          <circle cx="${segment.x2.toFixed(1)}" cy="${segment.y2.toFixed(1)}" r="${Math.max(8, segment.headRadius * 2.15).toFixed(1)}" fill="${color}" opacity="0.16"/>
        </g>
      `;
    }).join('')
    : '';

  const afterimageSegments = afterimageEnabled
    ? bloomHistory.slice(-10).map((spec, index) => {
      const accent = getAccentColor(spec.accentIndex, currentWeatherPreset);
      const previous = index > 0 ? bloomHistory[index - 1] : null;
      const driftX = previous ? spec.x - previous.x : 0;
      const driftY = previous ? spec.y - previous.y : 0;
      const echoes = previous
        ? [
          { offset: 0.18, opacity: 0.24, scale: 0.98 },
          { offset: 0.38, opacity: 0.15, scale: 0.94 },
        ]
        : [
          { offset: 0.1, opacity: 0.18, scale: 0.97 },
          { offset: 0.28, opacity: 0.11, scale: 0.93 },
        ];
      const centerY = spec.y - spec.stemHeight;

      return echoes.map((echo, echoIndex) => {
        const echoX = spec.x - driftX * echo.offset + Math.sin((spec.x + spec.y + index * 19 + echoIndex * 7) * 0.01) * 4;
        const echoY = spec.y - driftY * echo.offset + Math.cos((spec.x - spec.y + index * 17 + echoIndex * 5) * 0.012) * 4;
        const echoCenterY = echoY - spec.stemHeight;
        return `
          <g opacity="${echo.opacity.toFixed(2)}">
            <line x1="${echoX}" y1="${echoY - 12}" x2="${echoX}" y2="${echoCenterY}" stroke="${accent}" stroke-width="3.2" stroke-linecap="round" opacity="0.58"/>
            <ellipse cx="${echoX}" cy="${echoCenterY}" rx="${(spec.ringA / 2).toFixed(1)}" ry="${Math.max(8, Math.round(spec.ringA * 0.31)).toFixed(1)}" fill="none" stroke="${accent}" stroke-width="1.6" opacity="0.5" transform="rotate(${spec.tilt} ${echoX} ${echoCenterY})"/>
            <ellipse cx="${echoX}" cy="${echoCenterY}" rx="${(spec.ringB / 2).toFixed(1)}" ry="${Math.max(10, Math.round(spec.ringB * 0.15)).toFixed(1)}" fill="none" stroke="${accent}" stroke-width="1" stroke-dasharray="5 6" opacity="0.34" transform="rotate(${spec.tilt * -1.4} ${echoX} ${echoCenterY})"/>
            <circle cx="${echoX}" cy="${echoCenterY}" r="${Math.max(7, Math.round(9 * echo.scale)).toFixed(1)}" fill="${accent}" opacity="0.78"/>
          </g>
        `;
      }).join('');
    }).join('')
    : '';

  const signalChorusSegments = signalChorusEnabled
    ? (() => {
      const layout = buildSignalChorusLayout({ width, height, phase: bloomHistory.length * 0.37 + 0.5, cursorPoint: null });
      return [
        ...layout.halos.map((halo, index) => {
          const color = getAccentColor(halo.accentIndex, currentWeatherPreset);
          return `
            <circle cx="${halo.x.toFixed(1)}" cy="${halo.y.toFixed(1)}" r="${halo.radius.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${Math.max(1.2, 2.6 - index * 0.5).toFixed(2)}" stroke-dasharray="${Math.max(12, Math.round(halo.radius / 4))} ${Math.max(18, Math.round(halo.radius / 3))}" opacity="${halo.opacity.toFixed(2)}"/>
          `;
        }),
        ...layout.threads.map((thread) => {
          const color = getAccentColor(thread.accentIndex, currentWeatherPreset);
          return `
            <path d="M ${thread.x1.toFixed(1)} ${thread.y1.toFixed(1)} Q ${thread.cx.toFixed(1)} ${thread.cy.toFixed(1)} ${thread.x2.toFixed(1)} ${thread.y2.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${thread.width.toFixed(2)}" stroke-linecap="round" stroke-dasharray="${thread.dashA} ${thread.dashB}" opacity="${thread.opacity.toFixed(2)}"/>
          `;
        }),
        ...layout.nodes.map((node) => {
          const color = getAccentColor(node.accentIndex, currentWeatherPreset);
          return `
            <circle cx="${node.x.toFixed(1)}" cy="${node.y.toFixed(1)}" r="${node.radius.toFixed(1)}" fill="${color}" opacity="${node.opacity.toFixed(2)}"/>
          `;
        }),
        ...layout.flares.map((flare) => {
          const color = getAccentColor(flare.accentIndex, currentWeatherPreset);
          return `
            <circle cx="${flare.x.toFixed(1)}" cy="${flare.y.toFixed(1)}" r="${flare.radius.toFixed(1)}" fill="${color}" opacity="${flare.opacity.toFixed(2)}"/>
          `;
        }),
      ].join('');
    })()
    : '';

  const blooms = bloomHistory.map((spec) => {
    const accent = getAccentColor(spec.accentIndex, currentWeatherPreset);
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
        <text x="${spec.x}" y="${spec.y + 8}" text-anchor="middle" fill="${exportTheme.muted}" font-size="12" font-family="Inter, system-ui, sans-serif">${name}</text>
      </g>
    `;
  }).join('');

  const moodLabel = bloomHistory.length
    ? `<text x="36" y="48" fill="${exportTheme.brand}" font-size="12" font-family="Inter, system-ui, sans-serif" letter-spacing="3">${mood.toUpperCase()}</text>`
    : `<text x="36" y="48" fill="${exportTheme.muted}" font-size="14" font-family="Inter, system-ui, sans-serif">Your garden is empty. Plant the first signal.</text>`;

  const summaryMarkup = summaryItems.map((item, index) => {
    const columnWidth = Math.max(140, Math.floor((width - 112) / summaryItems.length));
    const x = 40 + columnWidth * index;
    return `
      <g transform="translate(${x} 32)">
        <text x="0" y="0" fill="${exportTheme.brand}" font-size="10" font-family="Inter, system-ui, sans-serif" letter-spacing="2">${item.label}</text>
        <text x="0" y="24" fill="${exportTheme.text}" font-size="15" font-family="Inter, system-ui, sans-serif">${item.value}</text>
      </g>
    `;
  }).join('');

  return {
    width,
    height,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${exportTheme.bgStart}"/>
            <stop offset="100%" stop-color="${exportTheme.bgEnd}"/>
          </linearGradient>
          <radialGradient id="groundGlow" cx="50%" cy="110%" r="40%">
            <stop offset="0%" stop-color="${exportTheme.floor}"/>
            <stop offset="100%" stop-color="${exportTheme.floor}" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="skyHaloA" cx="18%" cy="10%" r="28%">
            <stop offset="0%" stop-color="${exportTheme.haloA}"/>
            <stop offset="100%" stop-color="${exportTheme.haloA}" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="skyHaloB" cx="82%" cy="12%" r="24%">
            <stop offset="0%" stop-color="${exportTheme.haloB}"/>
            <stop offset="100%" stop-color="${exportTheme.haloB}" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="topPanelGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${exportTheme.badgeFill}"/>
            <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
          </linearGradient>
          <pattern id="fieldDots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.2" cy="1.2" r="1" fill="#ffffff" fill-opacity="0.22"/>
          </pattern>
          ${currentWeatherPreset.accents.map((accent, index) => `
            <radialGradient id="coreGlow-${index}" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="30%" stop-color="#ffffff"/>
              <stop offset="65%" stop-color="${accent}"/>
              <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
            </radialGradient>
          `).join('')}
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgGradient)" rx="18" ry="18"/>
        <rect width="${width}" height="${height}" fill="url(#skyHaloA)" rx="18" ry="18"/>
        <rect width="${width}" height="${height}" fill="url(#skyHaloB)" rx="18" ry="18"/>
        <rect width="${width}" height="${height}" fill="url(#groundGlow)" rx="18" ry="18"/>
        <rect width="${width}" height="${height}" fill="url(#fieldDots)" opacity="0.08" rx="18" ry="18"/>
        <g transform="translate(24 24)">
          <rect width="${Math.max(220, width - 48)}" height="96" rx="22" ry="22" fill="url(#topPanelGlow)" stroke="${exportTheme.badgeStroke}"/>
          ${moodLabel}
          <text x="36" y="78" fill="${exportTheme.text}" font-size="30" font-weight="700" font-family="Inter, system-ui, sans-serif">${gardenTitle}</text>
          <text x="36" y="104" fill="${exportTheme.muted}" font-size="14" font-family="Inter, system-ui, sans-serif">${gardenSubtitle}</text>
          <text x="${Math.max(220, width - 84)}" y="48" text-anchor="end" fill="${exportTheme.brand}" font-size="12" font-family="Inter, system-ui, sans-serif" letter-spacing="2">SIGNAL GARDEN</text>
          <g transform="translate(${skyModeBadgeX} 14)">
            <rect width="${skyModeBadgeWidth}" height="28" rx="999" ry="999" fill="${exportTheme.badgeFill}" stroke="${exportTheme.badgeStroke}"/>
            <text x="${skyModeBadgeWidth / 2}" y="19" text-anchor="middle" fill="${exportTheme.brand}" font-size="10" font-family="Inter, system-ui, sans-serif" letter-spacing="2">${escapeXml(skyModeLabel.toUpperCase())}</text>
          </g>
        </g>
        ${meteorSegments}
        ${weaveSegments}
        ${afterimageSegments}
        ${signalChorusSegments}
        ${links}
        ${blooms}
        <g transform="translate(24 ${height - 138})">
          <rect width="${Math.max(220, width - 48)}" height="98" rx="24" ry="24" fill="${exportTheme.badgeFill}" stroke="${exportTheme.badgeStroke}"/>
          ${summaryMarkup}
          <text x="16" y="82" fill="${exportTheme.muted}" font-size="12" font-family="Inter, system-ui, sans-serif">${footerCopy}</text>
          <text x="${Math.max(200, width - 80)}" y="82" text-anchor="end" fill="${exportTheme.muted}" font-size="12" font-family="Inter, system-ui, sans-serif">captured ${exportDateLabel}</text>
        </g>
      </svg>
    `,
  };
}

function makePostcardFilename() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `signal-garden-${currentWeatherPreset.id}${meteorShowerEnabled ? '-meteor' : ''}${signalChorusEnabled ? '-chorus' : ''}-${timestamp}.png`;
}

async function renderGardenPngBlob() {
  const { width, height, svg } = buildExportSvg();
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);

  try {
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

    return await new Promise((resolve, reject) => {
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          reject(new Error('png-blob-unavailable'));
          return;
        }
        resolve(pngBlob);
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

function downloadBlob(blob, filename) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

async function exportGardenPng() {
  if (!bloomHistory.length) return;

  exportPngBtn.disabled = true;
  exportPngBtn.dataset.state = 'working';
  exportPngBtn.textContent = 'rendering...';

  try {
    const pngBlob = await renderGardenPngBlob();
    downloadBlob(pngBlob, makePostcardFilename());

    exportPngBtn.dataset.state = 'done';
    exportPngBtn.textContent = 'PNG exported';
    logField('Garden export complete. The field has been pressed into a labeled weather postcard.', signalChorusEnabled ? 'afterimage postcard ready' : meteorShowerEnabled ? 'meteor postcard ready' : 'png ready');
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
  }
}

async function shareGardenPostcard() {
  if (!bloomHistory.length) return;

  sharePostcardBtn.disabled = true;
  sharePostcardBtn.dataset.state = 'working';
  sharePostcardBtn.textContent = 'packing postcard...';

  try {
    const pngBlob = await renderGardenPngBlob();
    const filename = makePostcardFilename();
    const shareUrl = makeShareUrl();
    const shareText = `Signal Garden • ${currentWeatherPreset.label} • ${bloomHistory.length} blooms • ${meteorShowerEnabled ? 'meteor shower on' : 'meteor shower off'} • ${signalChorusEnabled ? 'afterimages on' : 'afterimages off'}`;
    const postcardFile = new File([pngBlob], filename, { type: 'image/png' });
    const sharePayload = {
      title: 'Signal Garden postcard',
      text: `${shareText}
${shareUrl}`,
      url: shareUrl,
      files: [postcardFile],
    };

    if (navigator.share && (!navigator.canShare || navigator.canShare(sharePayload))) {
      await navigator.share(sharePayload);
      sharePostcardBtn.dataset.state = 'done';
      sharePostcardBtn.textContent = 'postcard shared';
      logField('Postcard shared with the full garden attached. Extremely portable weather.', signalChorusEnabled ? `postcard shared • ${currentWeatherPreset.label} • afterimage` : meteorShowerEnabled ? `postcard shared • ${currentWeatherPreset.label} • meteor` : `postcard shared • ${currentWeatherPreset.label}`);
    } else {
      downloadBlob(pngBlob, filename);
      await copyTextToClipboard(shareUrl, 'Copy this Signal Garden postcard link:');
      sharePostcardBtn.dataset.state = 'done';
      sharePostcardBtn.textContent = 'saved + link copied';
      logField('Native share skipped the party, so the postcard was downloaded and the matching link copied instead.', meteorShowerEnabled ? 'postcard saved locally • meteor' : 'postcard saved locally');
    }

    window.clearTimeout(sharePostcardBtn.copyStateTimer);
    sharePostcardBtn.copyStateTimer = window.setTimeout(() => {
      sharePostcardBtn.dataset.state = 'idle';
      sharePostcardBtn.textContent = 'share postcard';
      syncControls();
    }, 2400);
  } catch (error) {
    if (error?.name === 'AbortError') {
      sharePostcardBtn.dataset.state = 'idle';
      sharePostcardBtn.textContent = 'share postcard';
      syncControls();
      logField('Postcard share canceled. The weather remains local for now.', 'share canceled');
      return;
    }

    console.error(error);
    sharePostcardBtn.dataset.state = 'idle';
    sharePostcardBtn.textContent = 'share postcard';
    syncControls();
    logField('Postcard share hit a weird browser pothole. Export PNG still works.', 'share needs retry');
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
    logField(pick(transmissions.share), hashMode === 'broadcast' ? 'daily link copied' : `share link copied • ${currentWeatherPreset.label}`);
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

function getSequenceMood(sequence, preset = currentWeatherPreset) {
  const referenceSpec = sequence[sequence.length - 1] ?? sequence[0];
  return referenceSpec ? chooseMoodFromSpec(referenceSpec, preset) : getIdleMood(preset);
}

function describeDailyBroadcast(key) {
  const weatherPreset = getBroadcastWeatherPreset(key);
  const blooms = buildDailyGarden(key, {
    width: ARCHIVE_PREVIEW_WIDTH,
    height: ARCHIVE_PREVIEW_HEIGHT,
  });
  const featuredSpec = blooms[Math.floor(blooms.length / 2)] ?? blooms[0];
  const mood = getSequenceMood(blooms, weatherPreset);

  return {
    key,
    blooms,
    count: blooms.length,
    mood,
    weatherPreset,
    weatherLabel: weatherPreset.label,
    dateLabel: formatBroadcastDate(key),
    title: featuredSpec
      ? `${makeNameFromIndexes(featuredSpec.adjectiveIndex, featuredSpec.nounIndex)} archive`
      : 'quiet archive',
  };
}

function buildArchivePreviewSvg(sequence, preset) {
  const mood = escapeXml(getSequenceMood(sequence, preset));
  const previewTheme = preset.preview;
  const links = sequence.slice(1).map((spec, index) => {
    const previous = sequence[index];
    const accent = getAccentColor(spec.accentIndex, preset);
    return `<line x1="${previous.x}" y1="${previous.y}" x2="${spec.x}" y2="${spec.y}" stroke="${accent}" stroke-width="1.3" stroke-linecap="round" stroke-dasharray="5 8" opacity="0.45"/>`;
  }).join('');

  const blooms = sequence.map((spec) => {
    const accent = getAccentColor(spec.accentIndex, preset);
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
      <rect width="${ARCHIVE_PREVIEW_WIDTH}" height="${ARCHIVE_PREVIEW_HEIGHT}" rx="18" ry="18" fill="${previewTheme.base}"/>
      <circle cx="70" cy="40" r="90" fill="${previewTheme.skyA}"/>
      <circle cx="270" cy="34" r="84" fill="${previewTheme.skyB}"/>
      <ellipse cx="160" cy="250" rx="180" ry="84" fill="${previewTheme.floor}"/>
      ${links}
      ${blooms}
      <text x="18" y="28" fill="${previewTheme.text}" font-size="11" font-family="Inter, system-ui, sans-serif" letter-spacing="1.8">${mood.toUpperCase()}</text>
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

function renderHighlights() {
  if (!highlightsGridEl) return;

  const cards = GALLERY_HIGHLIGHTS.map((entry) => {
    const preset = getWeatherPresetById(entry.weatherId);
    const sequence = entry.encodedGarden.split('~').map(decodeBloom).filter(Boolean).slice(0, MAX_BLOOMS);
    const mood = getSequenceMood(sequence, preset);
    const card = document.createElement('article');
    card.className = 'archive-card';
    card.dataset.highlightId = entry.id;
    card.innerHTML = `
      <div class="archive-preview" aria-hidden="true">${buildArchivePreviewSvg(sequence, preset)}</div>
      <div class="archive-meta">
        <span class="highlight-tag">${escapeXml(entry.tag)}</span>
        <div class="archive-date">
          <strong>${escapeXml(entry.title)}</strong>
          <span>${escapeXml(preset.label)}</span>
        </div>
        <p class="archive-summary">${sequence.length} blooms • ${escapeXml(mood)}</p>
        <p class="archive-title">${escapeXml(entry.description)}</p>
      </div>
      <div class="archive-actions">
        <button type="button" data-action="load-highlight" data-id="${entry.id}">load highlight</button>
        <button type="button" data-action="copy-highlight" data-id="${entry.id}">copy link</button>
      </div>
    `;
    return card;
  });

  highlightsGridEl.replaceChildren(...cards);
  if (highlightsStatusEl) {
    highlightsStatusEl.textContent = `${GALLERY_HIGHLIGHTS.length} curated starter fields across all four weather modes.`;
  }
}

function syncArchiveStatus() {
  if (!archiveStatusEl) return;

  if (fieldSourceMode === 'broadcast' && currentBroadcastKey) {
    archiveStatusEl.textContent = `Viewing ${formatBroadcastDate(currentBroadcastKey)} • ${currentWeatherPreset.label} • ${bloomCount} blooms • ${moodEl.textContent}`;
    return;
  }

  if (fieldSourceMode === 'shared') {
    archiveStatusEl.textContent = `Shared permalink loaded • ${currentWeatherPreset.label} • plant once and it turns back into your own field.`;
    return;
  }

  archiveStatusEl.textContent = `Showing the last ${ARCHIVE_DAYS} UTC broadcasts. Weather mode: ${currentWeatherPreset.label}.`;
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
      <div class="archive-preview" aria-hidden="true">${buildArchivePreviewSvg(entry.blooms, entry.weatherPreset)}</div>
      <div class="archive-meta">
        <div class="archive-date">
          <strong>${escapeXml(entry.dateLabel)}</strong>
          <span>${key}</span>
        </div>
        <p class="archive-title">${escapeXml(entry.title)}</p>
        <p class="archive-weather">${escapeXml(entry.weatherLabel)}</p>
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

function loadGalleryHighlight(highlightId) {
  const entry = GALLERY_HIGHLIGHTS.find((item) => item.id === highlightId);
  if (!entry) return false;

  const sequence = entry.encodedGarden.split('~').map(decodeBloom).filter(Boolean).slice(0, MAX_BLOOMS);
  if (!sequence.length) return false;

  return applySharedSequence(sequence, {
    replay: false,
    weatherId: entry.weatherId,
    sourceMode: 'shared',
    hashShareMode: 'garden',
    logMessage: `Gallery highlight loaded: ${entry.title}. ${entry.description}`,
    status: `gallery pick loaded • ${sequence.length} blooms • ${getWeatherPresetById(entry.weatherId).label}`,
  });
}

async function copyHighlightLink(highlightId, button) {
  const entry = GALLERY_HIGHLIGHTS.find((item) => item.id === highlightId);
  if (!entry) return;

  const copied = await copyTextToClipboard(getGardenUrl(entry.encodedGarden, entry.weatherId), 'Copy this highlight garden link:');
  if (copied) {
    if (button) flashButtonCopyState(button, 'copied', 'copy link');
    logField(`Highlight link copied for ${entry.title}. Pocket museum secured.`, 'gallery link copied');
    return;
  }

  logField(`Highlight link opened manually for ${entry.title}. Clipboard union rules remain intense.`, 'manual copy required');
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

function applySharedSequence(sequence, {
  replay = false,
  weatherId = DEFAULT_WEATHER_ID,
  sourceMode = 'shared',
  hashShareMode = 'garden',
  broadcastKey = null,
  weaveEnabled = constellationWeaveEnabled,
  meteorEnabled = meteorShowerEnabled,
  afterimageEnabled: afterimageModeEnabled = afterimageEnabled,
  chorusEnabled = signalChorusEnabled,
  logMessage = pick(transmissions.loaded),
  status = null,
} = {}) {
  const blooms = sequence.map((spec) => ({ ...spec }));
  if (!blooms.length) return false;

  suppressHashSync = true;
  hashMode = hashShareMode;
  setFieldSource(sourceMode, sourceMode === 'broadcast' ? broadcastKey : null);
  setWeatherPreset(weatherId || DEFAULT_WEATHER_ID, { syncUrl: false });

  if (replay) {
    setConstellationWeave(weaveEnabled, { syncUrl: false });
    setMeteorShowerEnabled(meteorEnabled, { syncUrl: false });
    setAfterimageEnabled(afterimageModeEnabled, { syncUrl: false });
    setSignalChorusEnabled(chorusEnabled, { syncUrl: false });
    replayGarden(blooms, {
      restoreFromHash: true,
      shareMode: hashShareMode,
      sourceMode,
      broadcastKey,
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
  setConstellationWeave(weaveEnabled, { syncUrl: false });
  setMeteorShowerEnabled(meteorEnabled, { syncUrl: false });
  setAfterimageEnabled(afterimageModeEnabled, { syncUrl: false });
  setSignalChorusEnabled(chorusEnabled, { syncUrl: false });
  logField(logMessage, status ?? `${sourceMode === 'broadcast' ? 'daily signal tuned' : 'shared garden loaded'}: ${blooms.length} blooms • ${currentWeatherPreset.label}`);
  suppressHashSync = false;
  syncShareState();
  return true;
}

function loadDailyBroadcast(key = getUtcDateKey(), { replay = false, weaveEnabled = constellationWeaveEnabled, meteorEnabled = meteorShowerEnabled, afterimageEnabled: afterimageModeEnabled = afterimageEnabled, chorusEnabled = signalChorusEnabled } = {}) {
  if (!isBroadcastKey(key)) return false;

  const blooms = buildDailyGarden(key);
  if (!blooms.length) return false;

  const weatherPreset = getBroadcastWeatherPreset(key);
  return applySharedSequence(blooms, {
    replay,
    weatherId: weatherPreset.id,
    sourceMode: 'broadcast',
    hashShareMode: 'broadcast',
    broadcastKey: key,
    weaveEnabled,
    meteorEnabled,
    afterimageEnabled: afterimageModeEnabled,
    chorusEnabled,
    logMessage: `${pick(transmissions.daily).replace('{date}', key)} Weather report: ${weatherPreset.label}.`,
    status: `daily signal tuned: ${blooms.length} blooms`,
  });
}

function parseHashState() {
  const hash = window.location.hash.replace(/^#/, '').trim();
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  const weaveEnabled = params.get('weave') === '1' || params.get('weave') === 'true';
  const meteorEnabled = params.get('meteor') === '1' || params.get('meteor') === 'true';
  const afterimageEnabled = params.get('afterimage') === '1' || params.get('afterimage') === 'true' || params.get('afterimages') === '1' || params.get('afterimages') === 'true';
  const chorusEnabled = params.get('chorus') === '1' || params.get('chorus') === 'true' || params.get('harmony') === '1' || params.get('harmony') === 'true';

  if (params.has('broadcast')) {
    return {
      type: 'broadcast',
      broadcastKey: params.get('broadcast')?.trim() ?? '',
      weaveEnabled,
      meteorEnabled,
      afterimageEnabled,
      chorusEnabled,
    };
  }

  if (params.has('garden')) {
    return {
      type: 'garden',
      encodedGarden: params.get('garden')?.trim() ?? '',
      weatherId: params.get('weather')?.trim() ?? '',
      weaveEnabled,
      meteorEnabled,
      afterimageEnabled,
      chorusEnabled,
    };
  }

  if (weaveEnabled || meteorEnabled || afterimageEnabled || chorusEnabled) {
    return {
      type: 'modes',
      weaveEnabled,
      meteorEnabled,
      afterimageEnabled,
      chorusEnabled,
    };
  }

  return null;
}

function loadGardenFromHash({ replay = false } = {}) {
  const parsed = parseHashState();
  if (!parsed) return false;

  if (parsed.type === 'modes') {
    suppressHashSync = true;
    setConstellationWeave(parsed.weaveEnabled, { syncUrl: false });
    setMeteorShowerEnabled(parsed.meteorEnabled, { syncUrl: false });
    setAfterimageEnabled(parsed.afterimageEnabled, { syncUrl: false });
    setSignalChorusEnabled(parsed.chorusEnabled, { syncUrl: false });
    suppressHashSync = false;
    syncShareState();
    return true;
  }

  if (parsed.type === 'broadcast') {
    return loadDailyBroadcast(parsed.broadcastKey, { replay, weaveEnabled: parsed.weaveEnabled, meteorEnabled: parsed.meteorEnabled, afterimageEnabled: parsed.afterimageEnabled, chorusEnabled: parsed.chorusEnabled });
  }

  if (parsed.type !== 'garden') return false;
  if (!parsed.encodedGarden) return false;

  const blooms = parsed.encodedGarden.split('~').map(decodeBloom).filter(Boolean).slice(0, MAX_BLOOMS);
  if (!blooms.length) return false;

  return applySharedSequence(blooms, {
    replay,
    weatherId: parsed.weatherId || DEFAULT_WEATHER_ID,
    sourceMode: 'shared',
    hashShareMode: 'garden',
    weaveEnabled: parsed.weaveEnabled,
    meteorEnabled: parsed.meteorEnabled,
    afterimageEnabled: parsed.afterimageEnabled,
    chorusEnabled: parsed.chorusEnabled,
    logMessage: pick(transmissions.loaded),
    status: `shared garden loaded: ${blooms.length} blooms • ${getWeatherPresetById(parsed.weatherId || DEFAULT_WEATHER_ID).label}`,
  });
}

function describeModeStack() {
  return [
    `constellations ${constellationWeaveEnabled ? 'on' : 'off'}`,
    `meteor shower ${meteorShowerEnabled ? 'on' : 'off'}`,
    `afterimages ${afterimageEnabled ? 'on' : 'off'}`,
    `signal chorus ${signalChorusEnabled ? 'on' : 'off'}`,
  ].join(' • ');
}

stage.addEventListener('pointermove', (event) => {
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const priorCursorPoint = signalCursorPoint ? { ...signalCursorPoint } : null;
  signalCursorPoint = { x, y };
  recordAfterimageCursorPoint(x, y, bloomHistory[bloomHistory.length - 1]?.accentIndex ?? 0, {
    stampGhost: true,
    priorPoint: priorCursorPoint,
  });
  updatePreview(x, y);
  if (!previewVisible) showPreview();
  if (signalChorusEnabled) renderSignalOverlay();
});

stage.addEventListener('pointerenter', showPreview);
stage.addEventListener('pointerleave', () => {
  signalCursorPoint = null;
  hidePreview();
  if (signalChorusEnabled) renderSignalOverlay();
});

stage.addEventListener('click', (event) => {
  prepareEditableField();
  const rect = stage.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  signalCursorPoint = { x, y };
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

cycleWeatherBtn?.addEventListener('click', cycleWeatherMode);
toggleWeaveBtn?.addEventListener('click', toggleConstellationWeave);
toggleMeteorBtn?.addEventListener('click', toggleMeteorShower);
toggleAfterimageBtn?.addEventListener('click', toggleAfterimageField);
toggleHarmonyBtn?.addEventListener('click', toggleHarmonyField);

highlightsGridEl?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action][data-id]');
  if (!(button instanceof HTMLButtonElement)) return;

  const { action, id } = button.dataset;
  if (!id) return;

  if (action === 'load-highlight') {
    loadGalleryHighlight(id);
    return;
  }

  if (action === 'copy-highlight') {
    copyHighlightLink(id, button);
  }
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
sharePostcardBtn.addEventListener('click', shareGardenPostcard);
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
  if (event.key.toLowerCase() === 'w' && !event.metaKey && !event.ctrlKey && !event.altKey && fieldSourceMode !== 'broadcast') {
    event.preventDefault();
    cycleWeatherMode();
  }
  if (event.key.toLowerCase() === 'c' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    toggleConstellationWeave();
  }
  if (event.key.toLowerCase() === 'm' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    toggleMeteorShower();
  }
  if (event.key.toLowerCase() === 'a' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    toggleAfterimageField();
  }
  if (event.key.toLowerCase() === 'h' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    toggleHarmonyField();
  }
});

gardenCritterEl?.addEventListener('click', () => {
  if (!currentCritterSpec || !bloomHistory.length) return;
  gardenCritterEl.dataset.bumped = 'true';
  window.setTimeout(() => {
    gardenCritterEl.dataset.bumped = 'false';
  }, 520);

  const specimen = bloomHistory[bloomHistory.length - 1];
  const specimenName = specimen
    ? makeNameFromIndexes(specimen.adjectiveIndex, specimen.nounIndex)
    : 'the nearest bloom';
  logField(`${currentCritterSpec.title} inspected ${specimenName} and approved it with deeply unserious authority.`, `resident awake • ${currentCritterSpec.title}`);
});

window.exportGardenPng = exportGardenPng;

window.addEventListener('hashchange', () => {
  if (!suppressHashSync) {
    loadGardenFromHash();
  }
});

window.addEventListener('load', () => {
  setFieldSource('open');
  setWeatherPreset(DEFAULT_WEATHER_ID, { syncUrl: false });
  syncControls();
  renderHighlights();
  renderArchive();
  logField('Signal Garden online. The soil is listening.', 'awaiting first contact');
  if (!loadGardenFromHash()) {
    copyLinkBtn.textContent = 'copy share link';
  }
  syncArchiveStatus();
});

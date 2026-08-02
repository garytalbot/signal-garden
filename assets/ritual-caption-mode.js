(function () {
  const STORAGE_KEY = 'signal-garden-postcard-mantra-v1';
  const captionStatusEl = document.getElementById('ritualCaptionStatus');
  const captionTextEl = document.getElementById('ritualCaptionOutput');
  const modeToggleBtn = document.getElementById('ritualCaptionMode');
  const refreshBtn = document.getElementById('ritualCaptionRefresh');
  const copyCaptionBtn = document.getElementById('ritualCaptionCopy');
  const copyFieldCardBtn = document.getElementById('copyFieldCard');
  const sharePostcardBtn = document.getElementById('sharePostcard');
  const shareTitle = 'Signal Garden ritual field card';
  const openingLines = [
    'The residue opened its eyes in the midnight dust.',
    'A postcard is a small altar built from static.',
    'This weather has been waiting for a witness.',
    'The field keeps one more secret and calls it weather.',
    'A quiet choir of old blooms pressed around the edge.',
    'The screen bent, and the ghost remembered the motion.'
  ];
  const weatherLines = [
    'violet hush blooms in the seams.',
    'storm glass hums through the margin.',
    'ember rain turns the silence red.',
    'aurora tide makes the edges sing.',
    'moonlit grit drifts into the gutters.',
    'the soil of code starts to glow.'
  ];
  const closingLines = [
    'If you press send, let the trail travel with ceremony.',
    'Keep this caption pinned to the field until dawn forgets it.',
    'Carry this as residue, not evidence.',
    'No one gets to own a weathered whisper.',
    'Stamp it softly; the archive is listening.',
    'Fold this postcard into the next strange night.'
  ];

  let captionMode = localStorage.getItem(STORAGE_KEY) === 'true';
  let copyToastTimer = null;
  let shareToastTimer = null;

  if (!captionStatusEl || !captionTextEl || !modeToggleBtn || !refreshBtn || !copyCaptionBtn) {
    return;
  }

  function hashText(input = '') {
    let hash = 2166136261;
    const text = String(input);

    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
      hash >>>= 0;
    }

    return hash >>> 0;
  }

  function nowLabel() {
    const date = new Date();
    return date.toLocaleString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  }

  function pick(array, index) {
    return array[index % array.length];
  }

  function readShareCard() {
    if (typeof getShareCardCopy !== 'function') return null;
    return getShareCardCopy();
  }

  function bloomCountFromBody(bodyLine = '') {
    const match = String(bodyLine).match(/blooms:\s*([0-9]+|empty field)/i);
    if (!match) return 'no blooms';
    return match[1] === 'empty field' ? '0 blooms' : `${match[1]} blooms`;
  }

  function sourceFromMeta(metaLine = '') {
    const text = String(metaLine).toLowerCase();
    if (text.includes('daily signal')) return 'daily signal residue';
    if (text.includes('shared field card')) return 'shared card residue';
    return 'browser-local residue';
  }

  function buildPoeticCaption() {
    const card = readShareCard();
    if (!card) {
      return {
        caption: `residue note pending.\n${nowLabel()}\nNo card details available yet.`,
        fullText: '',
      };
    }

    const stamp = nowLabel();
    const seed = hashText(`${card.titleLine}|${card.bodyLine}|${card.metaLine}|${stamp}`);
    const countLine = bloomCountFromBody(card.bodyLine);
    const sourceLine = sourceFromMeta(card.metaLine);
    const caption = [
      `Residue timestamp: ${stamp}`,
      `${pick(openingLines, seed)} ${countLine} under ${sourceLine}.`,
      `${pick(weatherLines, Math.floor(seed / 7))} ${card.bodyLine}.`,
      pick(closingLines, Math.floor(seed / 13)),
    ].join('\n');
    return {
      caption,
      fullText: `${card.copyText}\n\n${caption}`,
      statusLine: `poetic stamp for ${countLine} in ${card.titleLine.toLowerCase()}`,
    };
  }

  function setMode(nextMode) {
    captionMode = !!nextMode;
    localStorage.setItem(STORAGE_KEY, captionMode ? 'true' : 'false');
    modeToggleBtn.textContent = `ritual caption: ${captionMode ? 'on' : 'off'}`;
    modeToggleBtn.setAttribute('aria-pressed', String(captionMode));
    captionStatusEl.textContent = captionMode ? 'ritual mode active' : 'residue mode quiet';
    copyCaptionBtn.disabled = !captionMode;
    refreshCaptionPreview();
  }

  function refreshCaptionPreview() {
    const payload = buildPoeticCaption();
    captionTextEl.textContent = captionMode
      ? payload.caption
      : 'Postcard mantra mode is off. Turn it on to reveal timestamped residue captions.';
  }

  function setButtonWorking(button, label) {
    if (!(button instanceof HTMLButtonElement)) return;
    button.disabled = true;
    button.dataset.state = 'working';
    button.textContent = label;
  }

  function flashButtonDone(button, label, timeoutMs = 1400, resetLabel = null) {
    if (!(button instanceof HTMLButtonElement)) return;
    button.dataset.state = 'copied';
    button.textContent = label;

    window.clearTimeout(button === copyFieldCardBtn ? copyToastTimer : shareToastTimer);
    const fallbackLabel = resetLabel || (button === copyFieldCardBtn ? 'copy field card' : 'share field card');
    const timer = window.setTimeout(() => {
      button.textContent = fallbackLabel;
      button.dataset.state = 'idle';
      button.disabled = false;
      if (typeof syncControls === 'function') syncControls();
    }, timeoutMs);

    if (button === copyFieldCardBtn) {
      copyToastTimer = timer;
      return;
    }

    shareToastTimer = timer;
  }

  async function ritualCopyFieldCard(event) {
    if (!captionMode) return;
    if (!copyFieldCardBtn || !captionMode) return;
    if (copyFieldCardBtn.disabled) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const payload = buildPoeticCaption();
    const label = copyFieldCardBtn.textContent;
    setButtonWorking(copyFieldCardBtn, 'inscribing caption...');

    try {
      const copied = await copyTextToClipboard(payload.fullText, 'Copy this Signal Garden field card with mantra:');
      if (copied) {
        flashButtonDone(copyFieldCardBtn, 'field card copied + mantra');
        if (typeof logField === 'function') {
          logField(`Field card copied with mantra. ${payload.statusLine}`, 'field card copied');
        }
      } else {
        if (typeof logField === 'function') {
          logField('Clipboard spirits resisted; the ritual caption stayed local.', 'manual copy required');
        }
        copyFieldCardBtn.textContent = label;
      }
    } catch (error) {
      console.error(error);
      if (typeof logField === 'function') logField('Field card copy mantra broke a glass bead and fell silent.', 'copy needs retry');
      copyFieldCardBtn.textContent = label;
      copyFieldCardBtn.dataset.state = 'idle';
    } finally {
      copyFieldCardBtn.disabled = false;
    }
  }

  async function ritualSharePostcard(event) {
    if (!captionMode) return;
    if (!sharePostcardBtn || sharePostcardBtn.disabled) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const payload = buildPoeticCaption();
    setButtonWorking(sharePostcardBtn, 'forging mantra...');

    try {
      const pngBlob = await renderGardenPngBlob();
      const filename = makePostcardFilename();
      const shareUrl = makeShareUrl();
      const postcardFile = new File([pngBlob], filename, { type: 'image/png' });
      const sharePayload = {
        title: shareTitle,
        text: payload.fullText,
        url: shareUrl,
        files: [postcardFile],
      };

      if (navigator.share && (!navigator.canShare || navigator.canShare(sharePayload))) {
        await navigator.share(sharePayload);
        flashButtonDone(sharePostcardBtn, 'field card shared with mantra', 1800);
        if (typeof logField === 'function') {
          logField(`Field card shared with mantra mode. ${payload.statusLine}`, 'field card shared');
        }
        return;
      }

      downloadBlob(pngBlob, filename);
      await copyTextToClipboard(payload.fullText, 'Copy this Signal Garden field card mantra payload:');
      flashButtonDone(sharePostcardBtn, 'saved + mantra copied', 1900);
      if (typeof logField === 'function') {
        logField(`Native share skipped. Postcard downloaded and mantra copied. ${payload.statusLine}`, 'field card saved locally');
      }
    } catch (error) {
      if (error?.name === 'AbortError') {
        if (typeof logField === 'function') logField('Field card share canceled in the middle of the spell.', 'share canceled');
      } else {
        console.error(error);
        if (typeof logField === 'function') logField('Postcard mantra share hit a browser rift.', 'share needs retry');
      }
      sharePostcardBtn.dataset.state = 'idle';
      sharePostcardBtn.textContent = 'share field card';
    } finally {
      sharePostcardBtn.disabled = false;
    }
  }

  async function copyCaptionOnly() {
    if (!captionMode) return;

    const payload = buildPoeticCaption();
    const copied = await copyTextToClipboard(
      `Residue caption • ${nowLabel()}\n${payload.caption}`,
      'Copy this Signal Garden residue caption:'
    );

    if (copied) {
      if (typeof logField === 'function') {
        logField('Residue caption copied for late-night postage.', 'caption copied');
      }
      flashCaptionButton();
      return;
    }

    if (typeof logField === 'function') {
      logField('Caption copy refused the keyboard and drifted to a prompt.', 'manual caption copy');
    }
  }

  function flashCaptionButton() {
    copyCaptionBtn.dataset.state = 'copied';
    copyCaptionBtn.textContent = 'caption copied';

    window.clearTimeout(copyToastTimer);
    copyToastTimer = window.setTimeout(() => {
      copyCaptionBtn.textContent = 'copy caption';
      copyCaptionBtn.dataset.state = 'idle';
    }, 1300);
  }

  function bindEvents() {
    if (copyFieldCardBtn) {
      copyFieldCardBtn.addEventListener('click', ritualCopyFieldCard, true);
    }
    if (sharePostcardBtn) {
      sharePostcardBtn.addEventListener('click', ritualSharePostcard, true);
    }
    modeToggleBtn.addEventListener('click', () => {
      setMode(!captionMode);
    });
    refreshBtn.addEventListener('click', refreshCaptionPreview);
    copyCaptionBtn.addEventListener('click', copyCaptionOnly);
  }

  function watchShareCardElements() {
    const shareCardTitle = document.getElementById('shareCardTitle');
    const shareCardBody = document.getElementById('shareCardBody');

    if (!shareCardTitle || !shareCardBody) return;

    const observer = new MutationObserver(() => refreshCaptionPreview());
    observer.observe(shareCardTitle, { characterData: true, childList: true, subtree: true });
    observer.observe(shareCardBody, { characterData: true, childList: true, subtree: true });
  }

  setMode(captionMode);
  bindEvents();
  watchShareCardElements();
  setTimeout(refreshCaptionPreview, 160);
})();

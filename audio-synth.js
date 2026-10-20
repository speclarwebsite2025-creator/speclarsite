/* ============================================================
   SPECLAR V3 — AMBIENT AUDIO SYNTHESIZER
   Web Audio API oscilloscope dock
   ============================================================ */

(function () {
  'use strict';

  let audioCtx = null;
  let masterGain = null;
  let analyser = null;
  let oscillators = [];
  let isPlaying = false;
  let animId = null;

  const canvas = document.getElementById('oscilloscope-canvas');
  const stateText = document.getElementById('audio-state-text');
  const btn = document.getElementById('audio-toggle-btn');

  // ---- Oscilloscope Rendering ----
  function renderOscilloscope() {
    if (!canvas) return;
    const ctx2d = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const H = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx2d.scale(window.devicePixelRatio, window.devicePixelRatio);
    const dW = canvas.offsetWidth;
    const dH = canvas.offsetHeight;

    function draw() {
      animId = requestAnimationFrame(draw);
      ctx2d.clearRect(0, 0, dW, dH);

      if (!analyser || !isPlaying) {
        // Idle flat line with gentle pulse
        const t = Date.now() / 1000;
        ctx2d.beginPath();
        ctx2d.strokeStyle = 'rgba(90, 97, 112, 0.4)';
        ctx2d.lineWidth = 1;
        for (let x = 0; x < dW; x++) {
          const y = dH / 2 + Math.sin(x * 0.2 + t * 1.5) * 1.5;
          x === 0 ? ctx2d.moveTo(x, y) : ctx2d.lineTo(x, y);
        }
        ctx2d.stroke();
        return;
      }

      const bufLen = analyser.frequencyBinCount;
      const dataArr = new Uint8Array(bufLen);
      analyser.getByteTimeDomainData(dataArr);

      // Gradient stroke
      const grad = ctx2d.createLinearGradient(0, 0, dW, 0);
      grad.addColorStop(0, 'rgba(230, 71, 73, 0.4)');
      grad.addColorStop(0.5, 'rgba(230, 71, 73, 0.9)');
      grad.addColorStop(1, 'rgba(230, 71, 73, 0.4)');

      ctx2d.beginPath();
      ctx2d.strokeStyle = grad;
      ctx2d.lineWidth = 1.5;

      const sliceW = dW / bufLen;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const v = dataArr[i] / 128.0;
        const y = (v * dH) / 2;
        i === 0 ? ctx2d.moveTo(x, y) : ctx2d.lineTo(x, y);
        x += sliceW;
      }
      ctx2d.stroke();
    }
    draw();
  }

  // ---- Audio Engine ----
  function createAudioContext() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.85;

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  function buildAmbientDrone() {
    // Three-layer ambient: sub, mid, shimmer
    const notes = [
      { freq: 55.0,  type: 'sine',     gain: 0.04 },
      { freq: 110.0, type: 'sine',     gain: 0.025 },
      { freq: 164.8, type: 'triangle', gain: 0.015 },
      { freq: 220.0, type: 'sine',     gain: 0.008 },
    ];

    oscillators = notes.map(note => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = note.type;
      osc.frequency.setValueAtTime(note.freq, audioCtx.currentTime);

      // subtle detune for richness
      osc.detune.setValueAtTime((Math.random() - 0.5) * 8, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(note.gain, audioCtx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(masterGain);
      osc.start();
      return { osc, gainNode };
    });

    // LFO for subtle wobble
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.15, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(3, audioCtx.currentTime);
    lfo.connect(lfoGain);
    oscillators.forEach(({ osc }) => lfoGain.connect(osc.detune));
    lfo.start();
    oscillators.push({ osc: lfo, gainNode: lfoGain });
  }

  function startAudio() {
    createAudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    buildAmbientDrone();
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 2.5);
    isPlaying = true;
    updateUI(true);
  }

  function stopAudio() {
    if (!audioCtx || !masterGain) return;
    const t = audioCtx.currentTime;
    masterGain.gain.linearRampToValueAtTime(0, t + 1.2);
    setTimeout(() => {
      oscillators.forEach(({ osc }) => {
        try { osc.stop(); } catch (_) {}
      });
      oscillators = [];
    }, 1300);
    isPlaying = false;
    updateUI(false);
  }

  function toggleAudio() {
    isPlaying ? stopAudio() : startAudio();
  }

  function updateUI(playing) {
    if (stateText) stateText.textContent = playing ? 'AMBIENT ON' : 'AMBIENT OFF';
    if (btn) btn.setAttribute('aria-pressed', String(playing));
  }

  // ---- Preloader toggle ----
  const preloaderAudioBtn = document.getElementById('preloader-audio-btn');
  if (preloaderAudioBtn) {
    preloaderAudioBtn.addEventListener('click', () => {
      if (!isPlaying) startAudio();
      else stopAudio();
    });
  }

  // ---- Main dock button ----
  if (btn) {
    btn.addEventListener('click', toggleAudio);
  }

  // ---- Init oscilloscope on ready ----
  document.addEventListener('speclar:site-ready', () => {
    renderOscilloscope();
  });

  // Fallback
  setTimeout(renderOscilloscope, 2500);

  // Expose for external use
  window.SpeclAudio = { start: startAudio, stop: stopAudio, toggle: toggleAudio };
})();

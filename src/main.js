// @ts-check
import { createGame, start, step, tickMs, togglePause, turn } from './core/snake.js';
import { advance, runLoop } from './core/loop.js';
import { createRenderer } from './render.js';
import { bindInput } from './input.js';
import { loadHighScore, saveHighScore } from './storage.js';

/** @typedef {import('./core/snake.js').GameState} GameState */

const $ = (/** @type {string} */ sel) => /** @type {HTMLElement} */ (document.querySelector(sel));
const canvas = /** @type {HTMLCanvasElement} */ ($('#board'));
const overlay = $('#overlay');
const overlayTitle = $('#overlay-title');
const overlayText = $('#overlay-text');
const startBtn = /** @type {HTMLButtonElement} */ ($('#start'));
const pauseBtn = /** @type {HTMLButtonElement} */ ($('#pause'));
const wrapToggle = /** @type {HTMLInputElement} */ ($('#wrap'));
const scoreEl = $('#score');
const bestEl = $('#best');
const live = $('#live');

const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const renderer = createRenderer(canvas);

let best = loadHighScore();
/** @type {GameState} */
let state = createGame({ wrap: wrapToggle.checked });
let acc = 0;

function newGame() {
  state = createGame({ wrap: wrapToggle.checked });
  acc = 0;
  scoreEl.textContent = '0';
  pauseBtn.disabled = true;
  pauseBtn.textContent = 'Pause';
}

/** @param {GameState} prev @param {GameState} next */
function onChange(prev, next) {
  if (next.score !== prev.score) scoreEl.textContent = String(next.score);
  if (next.status !== prev.status) {
    if (next.status === 'over') {
      const record = next.score > best;
      if (record) {
        best = next.score;
        saveHighScore(best);
        bestEl.textContent = String(best);
      }
      showOverlay(
        record ? 'New best!' : 'Game over',
        `Score ${next.score}. Press Space or tap Play to go again.`,
        'Play again',
      );
      live.textContent = `Game over. Score ${next.score}.${record ? ' New best.' : ''}`;
    } else if (next.status === 'paused') {
      showOverlay('Paused', 'Press Space or P to resume.', 'Resume');
      live.textContent = 'Paused';
    } else if (next.status === 'playing') {
      hideOverlay();
    }
    pauseBtn.disabled = next.status !== 'playing' && next.status !== 'paused';
    pauseBtn.textContent = next.status === 'paused' ? 'Resume' : 'Pause';
  }
}

/** @param {(s: GameState) => GameState} fn */
function update(fn) {
  const prev = state;
  state = fn(state);
  onChange(prev, state);
}

/** @param {string} title @param {string} text @param {string} cta */
function showOverlay(title, text, cta) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startBtn.textContent = cta;
  overlay.hidden = false;
  startBtn.focus({ preventScroll: true });
}

function hideOverlay() {
  overlay.hidden = true;
  canvas.focus({ preventScroll: true });
}

function primaryAction() {
  if (state.status === 'over') {
    newGame();
    update(start);
  } else {
    update(state.status === 'playing' ? togglePause : start);
  }
}

bindInput({ surface: $('#stage'), pad: document.querySelector('#pad') }, (intent) => {
  if (intent.type === 'turn') {
    if (state.status === 'over') return;
    update((s) => turn(s, intent.dir));
  } else if (intent.type === 'pause') {
    update(togglePause);
  } else {
    primaryAction();
  }
});

startBtn.addEventListener('click', primaryAction);
pauseBtn.addEventListener('click', () => update(togglePause));
wrapToggle.addEventListener('change', () => {
  if (state.status === 'playing') update(togglePause);
  newGame();
  showOverlay('Snake', wrapToggle.checked ? 'Walls wrap around.' : 'Walls are solid.', 'Play');
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.status === 'playing') update(togglePause);
});

const resize = () => renderer.resize(state.cols, state.rows);
new ResizeObserver(resize).observe(canvas);
resize();
bestEl.textContent = String(best);

runLoop((now, elapsed) => {
  if (state.status === 'playing') {
    const r = advance(acc, elapsed, tickMs(state.score));
    acc = r.accumulator;
    for (let i = 0; i < r.steps && state.status === 'playing'; i++) update((s) => step(s));
  }
  renderer.draw(state, { now, alpha: acc / tickMs(state.score), reducedMotion: motion.matches });
});

// @ts-check
/** Keyboard, swipe and on-screen button input. Emits intents, knows nothing about rules. */

/** @typedef {import('./core/snake.js').Direction} Direction */
/** @typedef {{ type: 'turn', dir: Direction } | { type: 'pause' } | { type: 'action' }} Intent */

/** @type {Record<string, Direction>} */
const KEYS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
};

/**
 * Converts a swipe vector to a direction, or null if it was too short.
 * @param {number} dx @param {number} dy @param {number} [min]
 * @returns {Direction | null}
 */
export function swipeDirection(dx, dy, min = 24) {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < min) return null;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}

/**
 * @param {{ surface: HTMLElement, pad: HTMLElement | null }} els
 * @param {(intent: Intent) => void} emit
 */
export function bindInput({ surface, pad }, emit) {
  window.addEventListener('keydown', (e) => {
    const inControl = e.target instanceof Element && e.target.closest('button, input, select, label');
    if (inControl && (e.code === 'Space' || e.code === 'Enter')) return; // Native activation.
    const dir = KEYS[e.code];
    if (dir) {
      e.preventDefault();
      emit({ type: 'turn', dir });
    } else if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      emit({ type: 'action' });
    } else if (e.code === 'KeyP' || e.code === 'Escape') {
      emit({ type: 'pause' });
    }
  });

  /** @type {{ x: number, y: number, id: number } | null} */
  let touch = null;
  surface.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    touch = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  surface.addEventListener('pointermove', (e) => {
    if (!touch || touch.id !== e.pointerId) return;
    const dir = swipeDirection(e.clientX - touch.x, e.clientY - touch.y);
    if (dir) {
      emit({ type: 'turn', dir });
      touch = { x: e.clientX, y: e.clientY, id: e.pointerId }; // Allow chained swipes.
    }
  });
  const end = () => (touch = null);
  surface.addEventListener('pointerup', end);
  surface.addEventListener('pointercancel', end);

  pad?.addEventListener('pointerdown', (e) => {
    const btn = e.target instanceof Element ? e.target.closest('[data-dir]') : null;
    if (!btn) return;
    e.preventDefault();
    emit({ type: 'turn', dir: /** @type {Direction} */ (btn.getAttribute('data-dir')) });
  });
}

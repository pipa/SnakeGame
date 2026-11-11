// @ts-check
const KEY = 'snake.highScore.v1';

/** @param {Storage | undefined} [store] */
export function loadHighScore(store = globalThis.localStorage) {
  try {
    const n = Number.parseInt(store?.getItem(KEY) ?? '0', 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0; // Private mode or storage disabled.
  }
}

/** @param {number} score @param {Storage | undefined} [store] */
export function saveHighScore(score, store = globalThis.localStorage) {
  try {
    store?.setItem(KEY, String(score));
  } catch {
    /* ignore */
  }
}

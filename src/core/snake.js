// @ts-check
/**
 * Pure Snake game logic. No DOM, no canvas, no timers: every function takes a
 * state and returns a new one, so it can be unit tested in Node.
 */

/** @typedef {{ x: number, y: number }} Point */
/** @typedef {'up' | 'down' | 'left' | 'right'} Direction */
/** @typedef {'ready' | 'playing' | 'paused' | 'over'} Status */

/**
 * @typedef {object} GameState
 * @property {number} cols
 * @property {number} rows
 * @property {Point[]} snake Head first.
 * @property {Direction} dir Direction applied on the last tick.
 * @property {Direction[]} queue Pending turns, at most two, so quick double taps register.
 * @property {Point} food
 * @property {number} score
 * @property {Status} status
 * @property {boolean} wrap When true the snake passes through walls.
 * @property {boolean} ate True on the tick the snake ate (renderer uses it for a pulse).
 */

/** @type {Record<Direction, Point>} */
export const VECTORS = Object.freeze({
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
});

/** @type {Record<Direction, Direction>} */
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

export const START_LENGTH = 4;
export const MAX_QUEUE = 2;

/**
 * @typedef {object} Options
 * @property {number} [cols]
 * @property {number} [rows]
 * @property {boolean} [wrap]
 * @property {() => number} [rng] Returns [0, 1). Injected for deterministic tests.
 */

/**
 * @param {Options} [options]
 * @returns {GameState}
 */
export function createGame({ cols = 20, rows = 20, wrap = false, rng = Math.random } = {}) {
  const y = Math.floor(rows / 2);
  const x = Math.floor(cols / 2);
  /** @type {Point[]} */
  const snake = [];
  for (let i = 0; i < START_LENGTH; i++) snake.push({ x: x - i, y });
  const base = {
    cols,
    rows,
    snake,
    dir: /** @type {Direction} */ ('right'),
    queue: [],
    score: 0,
    wrap,
    ate: false,
  };
  return { ...base, status: 'ready', food: placeFood(base, rng) };
}

/**
 * Picks a random empty cell. Returns {-1,-1} if the board is full.
 * @param {{ cols: number, rows: number, snake: Point[] }} state
 * @param {() => number} rng
 * @returns {Point}
 */
export function placeFood({ cols, rows, snake }, rng) {
  const taken = new Set(snake.map((p) => p.y * cols + p.x));
  const free = cols * rows - taken.size;
  if (free <= 0) return { x: -1, y: -1 };
  let n = Math.floor(rng() * free);
  for (let i = 0; i < cols * rows; i++) {
    if (taken.has(i)) continue;
    if (n-- === 0) return { x: i % cols, y: Math.floor(i / cols) };
  }
  return { x: -1, y: -1 };
}

/**
 * Queues a turn. Ignores reversals and duplicates relative to the last queued direction.
 * @param {GameState} state
 * @param {Direction} next
 * @returns {GameState}
 */
export function turn(state, next) {
  if (state.status === 'over' || state.status === 'paused') return state;
  const last = state.queue.at(-1) ?? state.dir;
  if (next === last || next === OPPOSITE[last] || state.queue.length >= MAX_QUEUE) return state;
  return { ...state, status: 'playing', queue: [...state.queue, next] };
}

/** @param {GameState} state @returns {GameState} */
export function start(state) {
  return state.status === 'ready' || state.status === 'paused' ? { ...state, status: 'playing' } : state;
}

/** @param {GameState} state @returns {GameState} */
export function togglePause(state) {
  if (state.status === 'playing') return { ...state, status: 'paused' };
  if (state.status === 'paused') return { ...state, status: 'playing' };
  return state;
}

/**
 * Advances one tick.
 * @param {GameState} state
 * @param {() => number} [rng]
 * @returns {GameState}
 */
export function step(state, rng = Math.random) {
  if (state.status !== 'playing') return state;
  const [nextDir = state.dir, ...queue] = state.queue;
  const v = VECTORS[nextDir];
  const head = state.snake[0];
  let nx = head.x + v.x;
  let ny = head.y + v.y;

  if (state.wrap) {
    nx = (nx + state.cols) % state.cols;
    ny = (ny + state.rows) % state.rows;
  } else if (nx < 0 || ny < 0 || nx >= state.cols || ny >= state.rows) {
    return { ...state, dir: nextDir, queue, status: 'over', ate: false };
  }

  const ate = nx === state.food.x && ny === state.food.y;
  // The tail moves away this tick unless we grow, so it is not an obstacle.
  const body = ate ? state.snake : state.snake.slice(0, -1);
  if (body.some((p) => p.x === nx && p.y === ny)) {
    return { ...state, dir: nextDir, queue, status: 'over', ate: false };
  }

  const snake = [{ x: nx, y: ny }, ...body];
  const next = { ...state, snake, dir: nextDir, queue, ate };
  if (!ate) return next;
  const food = placeFood(next, rng);
  return { ...next, score: state.score + 1, food, status: food.x < 0 ? 'over' : 'playing' };
}

/**
 * Milliseconds per tick: speeds up as the score climbs, with a floor.
 * @param {number} score
 */
export function tickMs(score) {
  return Math.max(55, 130 - score * 3);
}

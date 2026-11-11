// @ts-check
/** Canvas renderer. Reads game state, never changes it. */

/** @typedef {import('./core/snake.js').GameState} GameState */

const COLORS = {
  board: 'rgba(4, 10, 24, 0.72)',
  grid: 'rgba(46, 204, 113, 0.07)',
  head: '#7dffb3',
  body: ['#2ee58a', '#0f9f62'],
  food: '#ff4757',
  leaf: '#5bd16a',
};

/**
 * @param {HTMLCanvasElement} canvas
 */
export function createRenderer(canvas) {
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
  let cell = 20;

  /** Fit the canvas to its CSS box at device pixel ratio for crisp edges. */
  function resize(/** @type {number} */ cols, /** @type {number} */ rows) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cell = Math.floor((Math.min(rect.width / cols, rect.height / rows) || 20) * dpr);
    canvas.width = cell * cols;
    canvas.height = cell * rows;
  }

  /**
   * @param {GameState} s
   * @param {{ now: number, alpha: number, reducedMotion: boolean }} f
   *   alpha is 0..1 progress toward the next tick (used for a subtle head glow only;
   *   positions stay on the grid so play stays crisp).
   */
  function draw(s, { now, reducedMotion }) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = COLORS.board;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < s.cols; x++) {
      ctx.moveTo(x * cell + 0.5, 0);
      ctx.lineTo(x * cell + 0.5, h);
    }
    for (let y = 1; y < s.rows; y++) {
      ctx.moveTo(0, y * cell + 0.5);
      ctx.lineTo(w, y * cell + 0.5);
    }
    ctx.stroke();

    drawFood(s, now, reducedMotion);
    drawSnake(s);
  }

  /** @param {GameState} s @param {number} now @param {boolean} reducedMotion */
  function drawFood(s, now, reducedMotion) {
    if (s.food.x < 0) return;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(now / 260) * 0.06;
    const cx = (s.food.x + 0.5) * cell;
    const cy = (s.food.y + 0.55) * cell;
    const r = cell * 0.36 * pulse;
    ctx.save();
    ctx.shadowColor = COLORS.food;
    ctx.shadowBlur = cell * 0.6;
    const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.1, cx, cy, r);
    g.addColorStop(0, '#ff9aa4');
    g.addColorStop(1, COLORS.food);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = COLORS.leaf;
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.35, cy - r * 1.05, r * 0.38, r * 0.18, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  /** @param {GameState} s */
  function drawSnake(s) {
    const n = s.snake.length;
    const pad = Math.max(1, cell * 0.08);
    ctx.save();
    ctx.shadowColor = 'rgba(46, 229, 138, 0.55)';
    ctx.shadowBlur = cell * 0.5;
    for (let i = n - 1; i >= 0; i--) {
      const p = s.snake[i];
      const t = n > 1 ? i / (n - 1) : 0;
      ctx.fillStyle = i === 0 ? COLORS.head : mix(COLORS.body[0], COLORS.body[1], t);
      roundRect(p.x * cell + pad, p.y * cell + pad, cell - pad * 2, cell - pad * 2, cell * 0.28);
    }
    ctx.restore();
    if (s.status === 'over') {
      ctx.fillStyle = 'rgba(255, 71, 87, 0.35)';
      const p = s.snake[0];
      roundRect(p.x * cell, p.y * cell, cell, cell, cell * 0.28);
    }
    drawEyes(s);
  }

  /** @param {GameState} s */
  function drawEyes(s) {
    const head = s.snake[0];
    const dx = s.dir === 'left' ? -1 : s.dir === 'right' ? 1 : 0;
    const dy = s.dir === 'up' ? -1 : s.dir === 'down' ? 1 : 0;
    const cx = (head.x + 0.5) * cell;
    const cy = (head.y + 0.5) * cell;
    const off = cell * 0.18;
    ctx.fillStyle = '#04121f';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + dx * off + dy * off * side, cy + dy * off - dx * off * side, cell * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /** @param {number} x @param {number} y @param {number} w @param {number} h @param {number} r */
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }

  return { resize, draw };
}

/** @param {string} a @param {string} b @param {number} t */
function mix(a, b, t) {
  const pa = hex(a);
  const pb = hex(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/** @param {string} h */
function hex(h) {
  const n = Number.parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

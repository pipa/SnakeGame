import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createGame,
  placeFood,
  start,
  step,
  tickMs,
  togglePause,
  turn,
  START_LENGTH,
} from '../src/core/snake.js';

const zero = () => 0;
/** @param {Partial<import('../src/core/snake.js').GameState>} over */
const game = (over = {}) => ({ ...start(createGame({ cols: 10, rows: 10, rng: zero })), ...over });

test('new game starts centred, ready, with the start length', () => {
  const g = createGame({ cols: 10, rows: 10, rng: zero });
  assert.equal(g.status, 'ready');
  assert.equal(g.snake.length, START_LENGTH);
  assert.deepEqual(g.snake[0], { x: 5, y: 5 });
});

test('food is never placed on the snake', () => {
  const g = createGame({ cols: 3, rows: 1, rng: zero });
  const s = {
    ...g,
    snake: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ],
  };
  assert.deepEqual(placeFood(s, zero), { x: 2, y: 0 });
  assert.deepEqual(placeFood({ ...s, snake: [...s.snake, { x: 2, y: 0 }] }, zero), { x: -1, y: -1 });
});

test('step moves the head one cell and keeps length', () => {
  const g = step(game({ food: { x: 0, y: 0 } }));
  assert.deepEqual(g.snake[0], { x: 6, y: 5 });
  assert.equal(g.snake.length, START_LENGTH);
});

test('eating grows the snake, scores and moves the food', () => {
  const g = step(game({ food: { x: 6, y: 5 } }), zero);
  assert.equal(g.score, 1);
  assert.equal(g.snake.length, START_LENGTH + 1);
  assert.equal(g.ate, true);
  assert.notDeepEqual(g.food, { x: 6, y: 5 });
});

test('reversing into yourself is ignored', () => {
  const g = turn(game(), 'left');
  assert.deepEqual(g.queue, []);
});

test('two quick turns are both applied on consecutive ticks', () => {
  let g = turn(turn(game({ food: { x: 0, y: 0 } }), 'up'), 'left');
  assert.deepEqual(g.queue, ['up', 'left']);
  g = step(g);
  assert.deepEqual(g.snake[0], { x: 5, y: 4 });
  g = step(g);
  assert.deepEqual(g.snake[0], { x: 4, y: 4 });
});

test('a turn from the ready screen starts the game', () => {
  const g = turn(createGame({ rng: zero }), 'up');
  assert.equal(g.status, 'playing');
});

test('hitting a wall ends the game unless wrap is on', () => {
  const edge = {
    snake: [
      { x: 9, y: 5 },
      { x: 8, y: 5 },
    ],
    food: { x: 0, y: 0 },
  };
  assert.equal(step(game(edge)).status, 'over');
  const wrapped = step(game({ ...edge, wrap: true, food: { x: 3, y: 3 } }));
  assert.equal(wrapped.status, 'playing');
  assert.deepEqual(wrapped.snake[0], { x: 0, y: 5 });
});

test('biting your body ends the game, but chasing your tail does not', () => {
  // Square loop: head at (1,1) going up into (1,0), which is the tail and moves away.
  const loop = [
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
  ];
  const chase = step(game({ snake: loop, dir: 'right', queue: ['up'], food: { x: 5, y: 5 } }));
  assert.equal(chase.status, 'playing');
  const longer = [...loop.slice(0, 3), { x: 1, y: 0 }, { x: 2, y: 0 }];
  const bite = step(game({ snake: longer, dir: 'right', queue: ['up'], food: { x: 5, y: 5 } }));
  assert.equal(bite.status, 'over');
});

test('pause stops ticks and resumes', () => {
  const paused = togglePause(game());
  assert.equal(paused.status, 'paused');
  assert.equal(step(paused), paused);
  assert.equal(togglePause(paused).status, 'playing');
});

test('speed ramps up with a floor', () => {
  assert.ok(tickMs(10) < tickMs(0));
  assert.equal(tickMs(1000), 55);
});

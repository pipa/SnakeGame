import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadHighScore, saveHighScore } from '../src/storage.js';

const memory = () => {
  const m = new Map();
  return /** @type {Storage} */ ({ getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) });
};

test('round-trips the high score', () => {
  const s = memory();
  assert.equal(loadHighScore(s), 0);
  saveHighScore(12, s);
  assert.equal(loadHighScore(s), 12);
});

test('survives storage that throws', () => {
  const broken = /** @type {Storage} */ ({
    getItem: () => {
      throw new Error('denied');
    },
    setItem: () => {
      throw new Error('denied');
    },
  });
  assert.equal(loadHighScore(broken), 0);
  assert.doesNotThrow(() => saveHighScore(3, broken));
});

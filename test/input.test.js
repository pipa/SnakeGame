import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swipeDirection } from '../src/input.js';

test('swipe picks the dominant axis and ignores short moves', () => {
  assert.equal(swipeDirection(40, 5), 'right');
  assert.equal(swipeDirection(-40, 5), 'left');
  assert.equal(swipeDirection(3, -50), 'up');
  assert.equal(swipeDirection(3, 50), 'down');
  assert.equal(swipeDirection(5, 5), null);
});

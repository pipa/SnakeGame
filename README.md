# Snake

A neon browser Snake game in plain, modern JavaScript: ES modules, no framework and no build step.

**Play:** https://pipa.github.io/SnakeGame/

## Controls

| Action        | Keyboard               | Touch                                    |
| ------------- | ---------------------- | ---------------------------------------- |
| Steer         | Arrow keys or WASD     | Swipe on the board, or the on-screen pad |
| Start / pause | Space or Enter, P, Esc | Play / Pause buttons                     |

Options: **Wrap walls** lets the snake pass through the edges. Your best score is kept in `localStorage`.
The game pauses when the tab is hidden and respects _Reduce motion_ (no pulsing food, no blur).

## Run locally

ES modules need to be served over HTTP (browsers block them from `file://`):

```sh
npm start          # serves on http://localhost:5173
# or any static server, e.g. python3 -m http.server
```

## Develop

```sh
npm ci
npm run check      # lint + prettier + JSDoc typecheck + tests
npm test           # node:test, no browser needed
```

## Layout

```
index.html          page shell, HUD, overlay, touch pad
styles.css          layout and theme
src/core/snake.js   pure game rules (state in, state out)
src/core/loop.js    fixed-step accumulator + rAF loop
src/render.js       canvas drawing (reads state only)
src/input.js        keyboard, swipe and pad -> intents
src/storage.js      high score persistence
src/main.js         wiring
test/               node:test unit tests for the core
assets/             art (backdrop and icons generated with Grok Imagine)
```

Deploy: the repo root is the site. GitHub Pages serves it as-is.

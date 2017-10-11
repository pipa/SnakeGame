/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(7);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Engine__ = __webpack_require__(2);
// Deps =========================================


// Kickstart ====================================
window.snakeGame = new __WEBPACK_IMPORTED_MODULE_0__Engine__["a" /* default */]({
  snakeLength: 4
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__snake__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stage__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__apple__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__hud__ = __webpack_require__(6);
// Deps =========================================





// Internals namespace ==========================
const internals = {
  defaults: {
    interval: 1000/10,
    cellSize: 30,
    snakeLength: 5,
    arrowKeys: [37, 38, 39, 40],
    snakePosition: { x: 10, y: 10 }
  }
};

// Enums for directions objet ===================
internals.directionsEnum = {
  DIRECTION_UP: { x: 0, y: -1 },
  DIRECTION_RIGHT: { x: 1, y: 0 },
  DIRECTION_DOWN: { x: 0, y: 1 },
  DIRECTION_LEFT: { x: -1, y: 0 }
};

// Expose Engine of Game ========================
class Engine {
  constructor(options) {

    let canvas;

    this.isGameOver = false;
    this.options = Object.assign({}, internals.defaults, options);

    // Initial settings... helpful when restarting game
    this.init();

    if (this.stage.$canvas.getContext) {
        this.keyBindings();
        this.play();
        // window.onresize = this.screenResize.bind(this); // resize canvas
    }
  }

  init() {

    let canvas;
    let highScore = ('hud' in this && this.hud.score) ? this.hud.score : 0;
    this.stage = new __WEBPACK_IMPORTED_MODULE_1__stage__["a" /* default */]({ cellSize: this.options.cellSize });
    canvas = this.stage.canvas;
    this.hud = new __WEBPACK_IMPORTED_MODULE_3__hud__["a" /* default */]({
      canvas, highScore,
      snakeLength: this.options.snakeLength
    });
    this.snake = new __WEBPACK_IMPORTED_MODULE_0__snake__["a" /* default */]({
      canvas,
      trail: [],
      tail: this.options.snakeLength,
      position: this.options.snakePosition
    });
    this.apple = new __WEBPACK_IMPORTED_MODULE_2__apple__["a" /* default */]({
      canvas,
      stageTiles: this.stage.tiles
    });
    this.direction = internals.directionsEnum.DIRECTION_RIGHT;
  }

  play() {

    this.timer = setInterval(this.run.bind(this), this.options.interval);
  }

  pause() {

    clearInterval(this.timer);
  }

  gameOver() {

    const { canvas, width, height } = this.stage;
    const gameOverText = 'GAME OVER!';
    const restartText = 'Press `enter` to restart';
    const centerX = (width / 2);
    const centerY = (height / 2);

    canvas.beginPath();

    canvas.fillStyle = 'green';
    canvas.fillRect(centerX - 260, centerY - 115, 510, 210);
    canvas.fillStyle = 'black';
    canvas.fillRect(centerX - 255, centerY - 110, 500, 200);

    canvas.font = '48px serif';
    canvas.textAlign = 'center';
    canvas.fillStyle = '#2ecc71';
    canvas.fillText(gameOverText, centerX, (centerY - 10));

    canvas.font = '20px serif';
    canvas.fillStyle = '#2ecc71';
    canvas.fillText(restartText, centerX, (centerY + 10));

    canvas.fill();

    // Stop game
    this.isGameOver = true;
    this.pause();
  }

  screenResize() {

    this.width = document.body.clientWidth - 20;
    this.height = document.body.clientHeight - 20;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.tiles = {
      horizontal: Math.floor(this.canvas.width / this.options.gridSize),
      vertical: Math.floor(this.canvas.height / this.options.gridSize)
    }
    this.setupCanvas();
    this.resetCandy();
  }

  keyBindings() {

    const handleKeys = event => {

      // Check if allowed keys where pressed
      if (this.options.arrowKeys.indexOf(event.keyCode) === -1 && event.keyCode !== 13) {
        return false;
      }

      // Restart game when isGameOver and Enter key pressed
      if (this.isGameOver === true) {
        this.isGameOver = false;
        this.init();
        this.play();

        return false;
      }

      const { DIRECTION_UP, DIRECTION_RIGHT, DIRECTION_DOWN, DIRECTION_LEFT } = internals.directionsEnum;

      switch(event.keyCode) {
        case 37:
          this.direction = DIRECTION_LEFT;
          break;
        case 38:
          this.direction = DIRECTION_UP;
          break;
        case 39:
          this.direction = DIRECTION_RIGHT;
          break;
        case 40:
          this.direction = DIRECTION_DOWN;
          break;
      }

      event.preventDefault(); // Prevents window scroll
    };

    window.addEventListener('keydown', handleKeys);
  }

  boundariesSanitation() {

    const snakePos = this.snake.position;
    const tiles = this.stage.tiles;

    if (snakePos.x < 0) {
        snakePos.x = tiles.horizontal - 1;
    }
    if (snakePos.x > tiles.horizontal - 1) {
        snakePos.x = 0;
    }
    if (snakePos.y < 0) {
        snakePos.y = tiles.vertical - 1;
    }
    if (snakePos.y > tiles.vertical - 1) {
        snakePos.y = 0;
    }
  }

  run() {

    const { stage, snake, hud, apple, direction } = this;
    const gameOverCheck = elem =>
      elem.x === snake.position.x
      && elem.y === snake.position.y;

    snake.position = {
      x: snake.position.x + direction.x,
      y: snake.position.y + direction.y
    };

    // Has game ended?
    if (snake.trail.findIndex(gameOverCheck) >= 0) {
      return this.gameOver();
    }

    // Stage drawing
    stage.draw();

    // Manage our snake going out of canvas boundaries
    this.boundariesSanitation();

    // if Snake caught a apple
    if (snake.position.x === apple.position.x && snake.position.y === apple.position.y) {
      snake.tail = snake.tail + 1;
      this.apple = new __WEBPACK_IMPORTED_MODULE_2__apple__["a" /* default */]({ canvas: stage.canvas, stageTiles: stage.tiles });
    }

    // Update Stats
    hud.draw(snake.tail);

    // Drawing snake
    snake.draw(stage.cellSize);

    // Draw the apple powerup
    this.apple.draw();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Engine;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Internals namespace ==========================
const internals = {
  defaults: {
    tail: 5,
    canvas: null,
    trail: [],
    position: {
      x: 10,
      y: 10
    }
  }
};

// Export Snake =================================
class Snake {
  constructor(opts) {

    Object.assign(this, internals.defaults, opts);
  }

  draw(gridSize) {

    let { canvas, trail, position, gameOver } = this;

    canvas.beginPath();
    canvas.fillStyle = '#4CAF50';

    for (let i = trail.length - 1; i >= 0; i--) {
      canvas.fillRect(
        trail[i].x * gridSize, // x
        trail[i].y * gridSize, // y
        gridSize - 2, // width
        gridSize - 2 // height
      );
    }

    // Add new position to trail
    trail.push({
      x: position.x,
      y: position.y
    });

    // Draw snake in canvas
    canvas.fill();

    // Keeping the snake length...Removes the last trail
    while(trail.length > this.tail) {
      trail.shift();
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Snake;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Internals namespace ==========================
const internals = {
  defaults: {
    id: 'stage',
    cellSize: 20,
    canvas: null,
    color: '#212121',
    tiles: {
      horizontal: 0,
      vertical: 0
    }
  }
};

// Export Stage =================================
class Stage {
  constructor(opts) {

    Object.assign(this, internals.defaults, opts);
    this.$canvas = document.getElementById(this.id);
    this.canvas = this.$canvas.getContext('2d');

    this.setup();
  }

  reinit() {

    return this.setup();
  }

  draw() {

    const { canvas, color, width, height } = this;

    canvas.beginPath();
    canvas.fillStyle = color;
    canvas.fillRect(0, 0, width, height);
    canvas.fill();
  }

  setup() {

    const { $canvas, cellSize } = this;

    this.width = document.body.clientWidth - 20;
    this.height = document.body.clientHeight - 20;
    this.tiles = {
      horizontal: Math.floor(this.width / cellSize),
      vertical: Math.floor(this.height / cellSize)
    };
    $canvas.width = this.width;
    $canvas.height = this.height;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Stage;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Internals namespace ==========================
const internals = {
  defaults: {
    canvas: null,
    color: '#c0392b',
    gridSize: 30,
    gutter: 2,
    position: {
      x: null,
      y: null
    },
    stageTiles: null
  }
};

// Export Snake =================================
class Snake {
  constructor(opts) {

    Object.assign(this, internals.defaults, opts);

    this.setup();
  }

  setup() {

    const stageTiles = this.stageTiles;

    this.position = {
      x: Math.floor(Math.random() * stageTiles.horizontal),
      y: Math.floor(Math.random() * stageTiles.vertical)
    };
  }

  draw() {

    let { canvas, position, gridSize, gutter } = this;

    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.fillRect(
      position.x * gridSize,
      position.y * gridSize,
      gridSize - gutter,
      gridSize - gutter
    );
    canvas.fill();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Snake;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// Internals namespace ==========================
const internals = {
  defaults: {
    canvas: null,
    snakeLength: 0,
    highScore: 0
  }
};

// Export Snake =================================
class Snake {
  constructor(opts) {

    Object.assign(this, internals.defaults, opts);

  }

  draw(tailLength) {

    this.score = (tailLength - this.snakeLength) * 100;

    if (this.score > this.highScore) {
      this.highScore = this.score;
    }

    let { canvas, score, highScore } = this;

    canvas.beginPath();
    canvas.fillStyle = '#795548';
    canvas.font = '20px monospace';
    canvas.fillText(`Score: ${ score }`, 20, 30);
    canvas.fillText(`Highest Score: ${ highScore }`, 20, 60);
    canvas.fill();
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Snake;



/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTBhOWRjODliMDUxMGI5ZjYyNmEiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL0VuZ2luZS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvc25ha2UuanMiLCJ3ZWJwYWNrOi8vLy4vYXNzZXRzL2pzL3N0YWdlLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9qcy9hcHBsZS5qcyIsIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvaHVkLmpzIiwid2VicGFjazovLy8uL2Fzc2V0cy9zY3NzL21hc3Rlci5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REE7QUFBQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDTkQ7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9CLG9CQUFvQixhQUFhO0FBQ2pDLG1CQUFtQixhQUFhO0FBQ2hDLG1CQUFtQjtBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDhFQUE0QixrQ0FBa0M7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsV0FBVyx3QkFBd0I7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGFBQWEsZ0VBQWdFOztBQUU3RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QjtBQUM3Qjs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsV0FBVyxzQ0FBc0M7QUFDakQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRkFBOEIsZ0RBQWdEO0FBQzlFOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDNU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxTQUFTLG9DQUFvQzs7QUFFN0M7QUFDQTs7QUFFQSxrQ0FBa0MsUUFBUTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7OztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxXQUFXLCtCQUErQjs7QUFFMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxXQUFXLG9CQUFvQjs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxTQUFTLHFDQUFxQzs7QUFFOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLDJCQUEyQjs7QUFFcEM7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFFBQVE7QUFDdEMsc0NBQXNDLFlBQVk7QUFDbEQ7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7OztBQ2xDQSx5QyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYTBhOWRjODliMDUxMGI5ZjYyNmEiLCIvLyBEZXBzID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgRW5naW5lIGZyb20gJy4vRW5naW5lJztcblxuLy8gS2lja3N0YXJ0ID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxud2luZG93LnNuYWtlR2FtZSA9IG5ldyBFbmdpbmUoe1xuICBzbmFrZUxlbmd0aDogNFxufSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9qcy9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIERlcHMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBTbmFrZSBmcm9tICcuL3NuYWtlJztcbmltcG9ydCBTdGFnZSBmcm9tICcuL3N0YWdlJztcbmltcG9ydCBBcHBsZSBmcm9tICcuL2FwcGxlJztcbmltcG9ydCBIVUQgZnJvbSAnLi9odWQnO1xuXG4vLyBJbnRlcm5hbHMgbmFtZXNwYWNlID09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCBpbnRlcm5hbHMgPSB7XG4gIGRlZmF1bHRzOiB7XG4gICAgaW50ZXJ2YWw6IDEwMDAvMTAsXG4gICAgY2VsbFNpemU6IDMwLFxuICAgIHNuYWtlTGVuZ3RoOiA1LFxuICAgIGFycm93S2V5czogWzM3LCAzOCwgMzksIDQwXSxcbiAgICBzbmFrZVBvc2l0aW9uOiB7IHg6IDEwLCB5OiAxMCB9XG4gIH1cbn07XG5cbi8vIEVudW1zIGZvciBkaXJlY3Rpb25zIG9iamV0ID09PT09PT09PT09PT09PT09PT1cbmludGVybmFscy5kaXJlY3Rpb25zRW51bSA9IHtcbiAgRElSRUNUSU9OX1VQOiB7IHg6IDAsIHk6IC0xIH0sXG4gIERJUkVDVElPTl9SSUdIVDogeyB4OiAxLCB5OiAwIH0sXG4gIERJUkVDVElPTl9ET1dOOiB7IHg6IDAsIHk6IDEgfSxcbiAgRElSRUNUSU9OX0xFRlQ6IHsgeDogLTEsIHk6IDAgfVxufTtcblxuLy8gRXhwb3NlIEVuZ2luZSBvZiBHYW1lID09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW5naW5lIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuXG4gICAgbGV0IGNhbnZhcztcblxuICAgIHRoaXMuaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGludGVybmFscy5kZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAvLyBJbml0aWFsIHNldHRpbmdzLi4uIGhlbHBmdWwgd2hlbiByZXN0YXJ0aW5nIGdhbWVcbiAgICB0aGlzLmluaXQoKTtcblxuICAgIGlmICh0aGlzLnN0YWdlLiRjYW52YXMuZ2V0Q29udGV4dCkge1xuICAgICAgICB0aGlzLmtleUJpbmRpbmdzKCk7XG4gICAgICAgIHRoaXMucGxheSgpO1xuICAgICAgICAvLyB3aW5kb3cub25yZXNpemUgPSB0aGlzLnNjcmVlblJlc2l6ZS5iaW5kKHRoaXMpOyAvLyByZXNpemUgY2FudmFzXG4gICAgfVxuICB9XG5cbiAgaW5pdCgpIHtcblxuICAgIGxldCBjYW52YXM7XG4gICAgbGV0IGhpZ2hTY29yZSA9ICgnaHVkJyBpbiB0aGlzICYmIHRoaXMuaHVkLnNjb3JlKSA/IHRoaXMuaHVkLnNjb3JlIDogMDtcbiAgICB0aGlzLnN0YWdlID0gbmV3IFN0YWdlKHsgY2VsbFNpemU6IHRoaXMub3B0aW9ucy5jZWxsU2l6ZSB9KTtcbiAgICBjYW52YXMgPSB0aGlzLnN0YWdlLmNhbnZhcztcbiAgICB0aGlzLmh1ZCA9IG5ldyBIVUQoe1xuICAgICAgY2FudmFzLCBoaWdoU2NvcmUsXG4gICAgICBzbmFrZUxlbmd0aDogdGhpcy5vcHRpb25zLnNuYWtlTGVuZ3RoXG4gICAgfSk7XG4gICAgdGhpcy5zbmFrZSA9IG5ldyBTbmFrZSh7XG4gICAgICBjYW52YXMsXG4gICAgICB0cmFpbDogW10sXG4gICAgICB0YWlsOiB0aGlzLm9wdGlvbnMuc25ha2VMZW5ndGgsXG4gICAgICBwb3NpdGlvbjogdGhpcy5vcHRpb25zLnNuYWtlUG9zaXRpb25cbiAgICB9KTtcbiAgICB0aGlzLmFwcGxlID0gbmV3IEFwcGxlKHtcbiAgICAgIGNhbnZhcyxcbiAgICAgIHN0YWdlVGlsZXM6IHRoaXMuc3RhZ2UudGlsZXNcbiAgICB9KTtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IGludGVybmFscy5kaXJlY3Rpb25zRW51bS5ESVJFQ1RJT05fUklHSFQ7XG4gIH1cblxuICBwbGF5KCkge1xuXG4gICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKHRoaXMucnVuLmJpbmQodGhpcyksIHRoaXMub3B0aW9ucy5pbnRlcnZhbCk7XG4gIH1cblxuICBwYXVzZSgpIHtcblxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gIH1cblxuICBnYW1lT3ZlcigpIHtcblxuICAgIGNvbnN0IHsgY2FudmFzLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLnN0YWdlO1xuICAgIGNvbnN0IGdhbWVPdmVyVGV4dCA9ICdHQU1FIE9WRVIhJztcbiAgICBjb25zdCByZXN0YXJ0VGV4dCA9ICdQcmVzcyBgZW50ZXJgIHRvIHJlc3RhcnQnO1xuICAgIGNvbnN0IGNlbnRlclggPSAod2lkdGggLyAyKTtcbiAgICBjb25zdCBjZW50ZXJZID0gKGhlaWdodCAvIDIpO1xuXG4gICAgY2FudmFzLmJlZ2luUGF0aCgpO1xuXG4gICAgY2FudmFzLmZpbGxTdHlsZSA9ICdncmVlbic7XG4gICAgY2FudmFzLmZpbGxSZWN0KGNlbnRlclggLSAyNjAsIGNlbnRlclkgLSAxMTUsIDUxMCwgMjEwKTtcbiAgICBjYW52YXMuZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICBjYW52YXMuZmlsbFJlY3QoY2VudGVyWCAtIDI1NSwgY2VudGVyWSAtIDExMCwgNTAwLCAyMDApO1xuXG4gICAgY2FudmFzLmZvbnQgPSAnNDhweCBzZXJpZic7XG4gICAgY2FudmFzLnRleHRBbGlnbiA9ICdjZW50ZXInO1xuICAgIGNhbnZhcy5maWxsU3R5bGUgPSAnIzJlY2M3MSc7XG4gICAgY2FudmFzLmZpbGxUZXh0KGdhbWVPdmVyVGV4dCwgY2VudGVyWCwgKGNlbnRlclkgLSAxMCkpO1xuXG4gICAgY2FudmFzLmZvbnQgPSAnMjBweCBzZXJpZic7XG4gICAgY2FudmFzLmZpbGxTdHlsZSA9ICcjMmVjYzcxJztcbiAgICBjYW52YXMuZmlsbFRleHQocmVzdGFydFRleHQsIGNlbnRlclgsIChjZW50ZXJZICsgMTApKTtcblxuICAgIGNhbnZhcy5maWxsKCk7XG5cbiAgICAvLyBTdG9wIGdhbWVcbiAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xuICAgIHRoaXMucGF1c2UoKTtcbiAgfVxuXG4gIHNjcmVlblJlc2l6ZSgpIHtcblxuICAgIHRoaXMud2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gMjA7XG4gICAgdGhpcy5oZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCAtIDIwO1xuICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICB0aGlzLnRpbGVzID0ge1xuICAgICAgaG9yaXpvbnRhbDogTWF0aC5mbG9vcih0aGlzLmNhbnZhcy53aWR0aCAvIHRoaXMub3B0aW9ucy5ncmlkU2l6ZSksXG4gICAgICB2ZXJ0aWNhbDogTWF0aC5mbG9vcih0aGlzLmNhbnZhcy5oZWlnaHQgLyB0aGlzLm9wdGlvbnMuZ3JpZFNpemUpXG4gICAgfVxuICAgIHRoaXMuc2V0dXBDYW52YXMoKTtcbiAgICB0aGlzLnJlc2V0Q2FuZHkoKTtcbiAgfVxuXG4gIGtleUJpbmRpbmdzKCkge1xuXG4gICAgY29uc3QgaGFuZGxlS2V5cyA9IGV2ZW50ID0+IHtcblxuICAgICAgLy8gQ2hlY2sgaWYgYWxsb3dlZCBrZXlzIHdoZXJlIHByZXNzZWRcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXJyb3dLZXlzLmluZGV4T2YoZXZlbnQua2V5Q29kZSkgPT09IC0xICYmIGV2ZW50LmtleUNvZGUgIT09IDEzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gUmVzdGFydCBnYW1lIHdoZW4gaXNHYW1lT3ZlciBhbmQgRW50ZXIga2V5IHByZXNzZWRcbiAgICAgIGlmICh0aGlzLmlzR2FtZU92ZXIgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICB0aGlzLnBsYXkoKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgRElSRUNUSU9OX1VQLCBESVJFQ1RJT05fUklHSFQsIERJUkVDVElPTl9ET1dOLCBESVJFQ1RJT05fTEVGVCB9ID0gaW50ZXJuYWxzLmRpcmVjdGlvbnNFbnVtO1xuXG4gICAgICBzd2l0Y2goZXZlbnQua2V5Q29kZSkge1xuICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRElSRUNUSU9OX0xFRlQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBESVJFQ1RJT05fVVA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzk6XG4gICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBESVJFQ1RJT05fUklHSFQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSBESVJFQ1RJT05fRE9XTjtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudHMgd2luZG93IHNjcm9sbFxuICAgIH07XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUtleXMpO1xuICB9XG5cbiAgYm91bmRhcmllc1Nhbml0YXRpb24oKSB7XG5cbiAgICBjb25zdCBzbmFrZVBvcyA9IHRoaXMuc25ha2UucG9zaXRpb247XG4gICAgY29uc3QgdGlsZXMgPSB0aGlzLnN0YWdlLnRpbGVzO1xuXG4gICAgaWYgKHNuYWtlUG9zLnggPCAwKSB7XG4gICAgICAgIHNuYWtlUG9zLnggPSB0aWxlcy5ob3Jpem9udGFsIC0gMTtcbiAgICB9XG4gICAgaWYgKHNuYWtlUG9zLnggPiB0aWxlcy5ob3Jpem9udGFsIC0gMSkge1xuICAgICAgICBzbmFrZVBvcy54ID0gMDtcbiAgICB9XG4gICAgaWYgKHNuYWtlUG9zLnkgPCAwKSB7XG4gICAgICAgIHNuYWtlUG9zLnkgPSB0aWxlcy52ZXJ0aWNhbCAtIDE7XG4gICAgfVxuICAgIGlmIChzbmFrZVBvcy55ID4gdGlsZXMudmVydGljYWwgLSAxKSB7XG4gICAgICAgIHNuYWtlUG9zLnkgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHJ1bigpIHtcblxuICAgIGNvbnN0IHsgc3RhZ2UsIHNuYWtlLCBodWQsIGFwcGxlLCBkaXJlY3Rpb24gfSA9IHRoaXM7XG4gICAgY29uc3QgZ2FtZU92ZXJDaGVjayA9IGVsZW0gPT5cbiAgICAgIGVsZW0ueCA9PT0gc25ha2UucG9zaXRpb24ueFxuICAgICAgJiYgZWxlbS55ID09PSBzbmFrZS5wb3NpdGlvbi55O1xuXG4gICAgc25ha2UucG9zaXRpb24gPSB7XG4gICAgICB4OiBzbmFrZS5wb3NpdGlvbi54ICsgZGlyZWN0aW9uLngsXG4gICAgICB5OiBzbmFrZS5wb3NpdGlvbi55ICsgZGlyZWN0aW9uLnlcbiAgICB9O1xuXG4gICAgLy8gSGFzIGdhbWUgZW5kZWQ/XG4gICAgaWYgKHNuYWtlLnRyYWlsLmZpbmRJbmRleChnYW1lT3ZlckNoZWNrKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5nYW1lT3ZlcigpO1xuICAgIH1cblxuICAgIC8vIFN0YWdlIGRyYXdpbmdcbiAgICBzdGFnZS5kcmF3KCk7XG5cbiAgICAvLyBNYW5hZ2Ugb3VyIHNuYWtlIGdvaW5nIG91dCBvZiBjYW52YXMgYm91bmRhcmllc1xuICAgIHRoaXMuYm91bmRhcmllc1Nhbml0YXRpb24oKTtcblxuICAgIC8vIGlmIFNuYWtlIGNhdWdodCBhIGFwcGxlXG4gICAgaWYgKHNuYWtlLnBvc2l0aW9uLnggPT09IGFwcGxlLnBvc2l0aW9uLnggJiYgc25ha2UucG9zaXRpb24ueSA9PT0gYXBwbGUucG9zaXRpb24ueSkge1xuICAgICAgc25ha2UudGFpbCA9IHNuYWtlLnRhaWwgKyAxO1xuICAgICAgdGhpcy5hcHBsZSA9IG5ldyBBcHBsZSh7IGNhbnZhczogc3RhZ2UuY2FudmFzLCBzdGFnZVRpbGVzOiBzdGFnZS50aWxlcyB9KTtcbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgU3RhdHNcbiAgICBodWQuZHJhdyhzbmFrZS50YWlsKTtcblxuICAgIC8vIERyYXdpbmcgc25ha2VcbiAgICBzbmFrZS5kcmF3KHN0YWdlLmNlbGxTaXplKTtcblxuICAgIC8vIERyYXcgdGhlIGFwcGxlIHBvd2VydXBcbiAgICB0aGlzLmFwcGxlLmRyYXcoKTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvanMvRW5naW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIEludGVybmFscyBuYW1lc3BhY2UgPT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IGludGVybmFscyA9IHtcbiAgZGVmYXVsdHM6IHtcbiAgICB0YWlsOiA1LFxuICAgIGNhbnZhczogbnVsbCxcbiAgICB0cmFpbDogW10sXG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDEwLFxuICAgICAgeTogMTBcbiAgICB9XG4gIH1cbn07XG5cbi8vIEV4cG9ydCBTbmFrZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNuYWtlIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbnRlcm5hbHMuZGVmYXVsdHMsIG9wdHMpO1xuICB9XG5cbiAgZHJhdyhncmlkU2l6ZSkge1xuXG4gICAgbGV0IHsgY2FudmFzLCB0cmFpbCwgcG9zaXRpb24sIGdhbWVPdmVyIH0gPSB0aGlzO1xuXG4gICAgY2FudmFzLmJlZ2luUGF0aCgpO1xuICAgIGNhbnZhcy5maWxsU3R5bGUgPSAnIzRDQUY1MCc7XG5cbiAgICBmb3IgKGxldCBpID0gdHJhaWwubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGNhbnZhcy5maWxsUmVjdChcbiAgICAgICAgdHJhaWxbaV0ueCAqIGdyaWRTaXplLCAvLyB4XG4gICAgICAgIHRyYWlsW2ldLnkgKiBncmlkU2l6ZSwgLy8geVxuICAgICAgICBncmlkU2l6ZSAtIDIsIC8vIHdpZHRoXG4gICAgICAgIGdyaWRTaXplIC0gMiAvLyBoZWlnaHRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQWRkIG5ldyBwb3NpdGlvbiB0byB0cmFpbFxuICAgIHRyYWlsLnB1c2goe1xuICAgICAgeDogcG9zaXRpb24ueCxcbiAgICAgIHk6IHBvc2l0aW9uLnlcbiAgICB9KTtcblxuICAgIC8vIERyYXcgc25ha2UgaW4gY2FudmFzXG4gICAgY2FudmFzLmZpbGwoKTtcblxuICAgIC8vIEtlZXBpbmcgdGhlIHNuYWtlIGxlbmd0aC4uLlJlbW92ZXMgdGhlIGxhc3QgdHJhaWxcbiAgICB3aGlsZSh0cmFpbC5sZW5ndGggPiB0aGlzLnRhaWwpIHtcbiAgICAgIHRyYWlsLnNoaWZ0KCk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2Fzc2V0cy9qcy9zbmFrZS5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBJbnRlcm5hbHMgbmFtZXNwYWNlID09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCBpbnRlcm5hbHMgPSB7XG4gIGRlZmF1bHRzOiB7XG4gICAgaWQ6ICdzdGFnZScsXG4gICAgY2VsbFNpemU6IDIwLFxuICAgIGNhbnZhczogbnVsbCxcbiAgICBjb2xvcjogJyMyMTIxMjEnLFxuICAgIHRpbGVzOiB7XG4gICAgICBob3Jpem9udGFsOiAwLFxuICAgICAgdmVydGljYWw6IDBcbiAgICB9XG4gIH1cbn07XG5cbi8vIEV4cG9ydCBTdGFnZSA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YWdlIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBpbnRlcm5hbHMuZGVmYXVsdHMsIG9wdHMpO1xuICAgIHRoaXMuJGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgIHRoaXMuY2FudmFzID0gdGhpcy4kY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLnNldHVwKCk7XG4gIH1cblxuICByZWluaXQoKSB7XG5cbiAgICByZXR1cm4gdGhpcy5zZXR1cCgpO1xuICB9XG5cbiAgZHJhdygpIHtcblxuICAgIGNvbnN0IHsgY2FudmFzLCBjb2xvciwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblxuICAgIGNhbnZhcy5iZWdpblBhdGgoKTtcbiAgICBjYW52YXMuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgY2FudmFzLmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGNhbnZhcy5maWxsKCk7XG4gIH1cblxuICBzZXR1cCgpIHtcblxuICAgIGNvbnN0IHsgJGNhbnZhcywgY2VsbFNpemUgfSA9IHRoaXM7XG5cbiAgICB0aGlzLndpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIDIwO1xuICAgIHRoaXMuaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLSAyMDtcbiAgICB0aGlzLnRpbGVzID0ge1xuICAgICAgaG9yaXpvbnRhbDogTWF0aC5mbG9vcih0aGlzLndpZHRoIC8gY2VsbFNpemUpLFxuICAgICAgdmVydGljYWw6IE1hdGguZmxvb3IodGhpcy5oZWlnaHQgLyBjZWxsU2l6ZSlcbiAgICB9O1xuICAgICRjYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICRjYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2pzL3N0YWdlLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIEludGVybmFscyBuYW1lc3BhY2UgPT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IGludGVybmFscyA9IHtcbiAgZGVmYXVsdHM6IHtcbiAgICBjYW52YXM6IG51bGwsXG4gICAgY29sb3I6ICcjYzAzOTJiJyxcbiAgICBncmlkU2l6ZTogMzAsXG4gICAgZ3V0dGVyOiAyLFxuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiBudWxsLFxuICAgICAgeTogbnVsbFxuICAgIH0sXG4gICAgc3RhZ2VUaWxlczogbnVsbFxuICB9XG59O1xuXG4vLyBFeHBvcnQgU25ha2UgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbmFrZSB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgaW50ZXJuYWxzLmRlZmF1bHRzLCBvcHRzKTtcblxuICAgIHRoaXMuc2V0dXAoKTtcbiAgfVxuXG4gIHNldHVwKCkge1xuXG4gICAgY29uc3Qgc3RhZ2VUaWxlcyA9IHRoaXMuc3RhZ2VUaWxlcztcblxuICAgIHRoaXMucG9zaXRpb24gPSB7XG4gICAgICB4OiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzdGFnZVRpbGVzLmhvcml6b250YWwpLFxuICAgICAgeTogTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3RhZ2VUaWxlcy52ZXJ0aWNhbClcbiAgICB9O1xuICB9XG5cbiAgZHJhdygpIHtcblxuICAgIGxldCB7IGNhbnZhcywgcG9zaXRpb24sIGdyaWRTaXplLCBndXR0ZXIgfSA9IHRoaXM7XG5cbiAgICBjYW52YXMuYmVnaW5QYXRoKCk7XG4gICAgY2FudmFzLmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG4gICAgY2FudmFzLmZpbGxSZWN0KFxuICAgICAgcG9zaXRpb24ueCAqIGdyaWRTaXplLFxuICAgICAgcG9zaXRpb24ueSAqIGdyaWRTaXplLFxuICAgICAgZ3JpZFNpemUgLSBndXR0ZXIsXG4gICAgICBncmlkU2l6ZSAtIGd1dHRlclxuICAgICk7XG4gICAgY2FudmFzLmZpbGwoKTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9hc3NldHMvanMvYXBwbGUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gSW50ZXJuYWxzIG5hbWVzcGFjZSA9PT09PT09PT09PT09PT09PT09PT09PT09PVxuY29uc3QgaW50ZXJuYWxzID0ge1xuICBkZWZhdWx0czoge1xuICAgIGNhbnZhczogbnVsbCxcbiAgICBzbmFrZUxlbmd0aDogMCxcbiAgICBoaWdoU2NvcmU6IDBcbiAgfVxufTtcblxuLy8gRXhwb3J0IFNuYWtlID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU25ha2Uge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIGludGVybmFscy5kZWZhdWx0cywgb3B0cyk7XG5cbiAgfVxuXG4gIGRyYXcodGFpbExlbmd0aCkge1xuXG4gICAgdGhpcy5zY29yZSA9ICh0YWlsTGVuZ3RoIC0gdGhpcy5zbmFrZUxlbmd0aCkgKiAxMDA7XG5cbiAgICBpZiAodGhpcy5zY29yZSA+IHRoaXMuaGlnaFNjb3JlKSB7XG4gICAgICB0aGlzLmhpZ2hTY29yZSA9IHRoaXMuc2NvcmU7XG4gICAgfVxuXG4gICAgbGV0IHsgY2FudmFzLCBzY29yZSwgaGlnaFNjb3JlIH0gPSB0aGlzO1xuXG4gICAgY2FudmFzLmJlZ2luUGF0aCgpO1xuICAgIGNhbnZhcy5maWxsU3R5bGUgPSAnIzc5NTU0OCc7XG4gICAgY2FudmFzLmZvbnQgPSAnMjBweCBtb25vc3BhY2UnO1xuICAgIGNhbnZhcy5maWxsVGV4dChgU2NvcmU6ICR7IHNjb3JlIH1gLCAyMCwgMzApO1xuICAgIGNhbnZhcy5maWxsVGV4dChgSGlnaGVzdCBTY29yZTogJHsgaGlnaFNjb3JlIH1gLCAyMCwgNjApO1xuICAgIGNhbnZhcy5maWxsKCk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL2pzL2h1ZC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vYXNzZXRzL3Njc3MvbWFzdGVyLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==
// Deps =========================================
import Snake from './snake';
import Stage from './stage';
import Apple from './apple';
import HUD from './hud';

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
export default class Engine {
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
    this.stage = new Stage({ cellSize: this.options.cellSize });
    canvas = this.stage.canvas;
    this.hud = new HUD({
      canvas, highScore,
      snakeLength: this.options.snakeLength
    });
    this.snake = new Snake({
      canvas,
      trail: [],
      tail: this.options.snakeLength,
      position: this.options.snakePosition
    });
    this.apple = new Apple({
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
      this.apple = new Apple({ canvas: stage.canvas, stageTiles: stage.tiles });
    }

    // Update Stats
    hud.draw(snake.tail);

    // Drawing snake
    snake.draw(stage.cellSize);

    // Draw the apple powerup
    this.apple.draw();
  }
}

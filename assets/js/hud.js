// Internals namespace ==========================
const internals = {
  defaults: {
    canvas: null,
    snakeLength: 0,
    highScore: 0
  }
};

// Export Snake =================================
export default class Snake {
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

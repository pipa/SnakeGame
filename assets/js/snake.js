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
export default class Snake {
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

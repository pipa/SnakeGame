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
export default class Snake {
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

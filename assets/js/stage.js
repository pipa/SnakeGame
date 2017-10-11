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
export default class Stage {
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

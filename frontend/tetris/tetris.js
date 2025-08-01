
const config = {
  type: Phaser.AUTO,
  width: 240,
  height: 400,
  parent: 'tetris-game',
  backgroundColor: '#000',
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 24;
const SHAPES = [
  [[1, 1, 1, 1]],
  [[1, 1], [1, 1]],
  [[0, 1, 0], [1, 1, 1]],
  [[1, 1, 0], [0, 1, 1]],
  [[0, 1, 1], [1, 1, 0]],
  [[1, 0, 0], [1, 1, 1]],
  [[0, 0, 1], [1, 1, 1]]
];

let grid = [];
let currentPiece;
let dropTime = 0;
let dropInterval = 500;
let cursors;

function preload() {}

function create() {
  this.graphics = this.add.graphics();
  cursors = this.input.keyboard.createCursorKeys();
  for (let y = 0; y < ROWS; y++) {
    grid[y] = [];
    for (let x = 0; x < COLS; x++) {
      grid[y][x] = 0;
    }
  }
  spawnPiece();
}

function update(time, delta) {
  this.graphics.clear();
  drawGrid(this);
  if (Phaser.Input.Keyboard.JustDown(cursors.left)) movePiece(-1);
  if (Phaser.Input.Keyboard.JustDown(cursors.right)) movePiece(1);
  if (Phaser.Input.Keyboard.JustDown(cursors.down)) dropPiece();
  if (Phaser.Input.Keyboard.JustDown(cursors.up)) rotatePiece();
  dropTime += delta;
  if (dropTime > dropInterval) {
    dropTime = 0;
    dropPiece();
  }
}

function drawGrid(scene) {
  scene.graphics.fillStyle(0x444444);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x]) {
        scene.graphics.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      }
    }
  }
  scene.graphics.fillStyle(0xff0000);
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x]) {
        scene.graphics.fillRect((currentPiece.x + x) * BLOCK_SIZE, (currentPiece.y + y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      }
    }
  }
}

function spawnPiece() {
  const index = Math.floor(Math.random() * SHAPES.length);
  currentPiece = { shape: SHAPES[index], x: 3, y: 0 };
}

function movePiece(dir) {
  currentPiece.x += dir;
  if (collides()) currentPiece.x -= dir;
}

function rotatePiece() {
  const oldShape = currentPiece.shape;
  currentPiece.shape = rotateMatrix(currentPiece.shape);
  if (collides()) currentPiece.shape = oldShape;
}

function dropPiece() {
  currentPiece.y++;
  if (collides()) {
    currentPiece.y--;
    mergePiece();
    clearLines();
    spawnPiece();
    if (collides()) {
      alert('Partie terminée');
      location.reload();
    }
  }
}

function mergePiece() {
  const { shape, x: px, y: py } = currentPiece;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        grid[py + y][px + x] = 1;
      }
    }
  }
}

function clearLines() {
  for (let y = ROWS - 1; y >= 0; y--) {
    if (grid[y].every(cell => cell)) {
      grid.splice(y, 1);
      grid.unshift(new Array(COLS).fill(0));
      y++;
    }
  }
}

function collides() {
  const { shape, x: px, y: py } = currentPiece;
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (
        shape[y][x] &&
        (grid[py + y] && grid[py + y][px + x]) !== 0
      ) return true;
      if (
        shape[y][x] &&
        (px + x < 0 || px + x >= COLS || py + y >= ROWS)
      ) return true;
    }
  }
  return false;
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
}

const config = {
  type: Phaser.AUTO,
  width: 300,
  height: 600,
  backgroundColor: "#000",
  scene: {
    preload,
    create,
    update
  }
};

let game = new Phaser.Game(config);

function preload() {
  // Load assets here
}
function create() {
  // Create Tetris game here
}
function update() {
  // Game loop
}

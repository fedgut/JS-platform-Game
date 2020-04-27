import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
    },
  },
};

export default config;

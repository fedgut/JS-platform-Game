import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  width: 1334,
  height: 750,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
    },
  },
};

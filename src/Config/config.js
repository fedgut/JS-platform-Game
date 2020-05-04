import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 910,
  height: 512,
  physics: {
    default: 'arcade',
    // arcade: {
    //   gravity: { y: 300 },
    // },
  },
  // backgroundColor: 0xc10230,
};

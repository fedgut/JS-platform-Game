import Phaser from 'phaser';
import renderScores from '../API/ServeHighScore';
import Button from '../Objects/Buttons';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('HighScores');
  }

  preload() {
    this.load.html('scoretable', 'HTMLs/scoretable.html');
  }

  create() {
    const element = this.add.dom(667, 200).createFromCache('scoretable');

    this.tweens.add({
      targets: element,
      y: 300,
      duration: 250,
      onComplete: () => {
        renderScores();
      },
    });

    this.TitleButton = new Button(
      this,
      667,
      650,
      'blueButton1',
      'blueButton2',
      'Title',
      'Title',
    );
  }
}

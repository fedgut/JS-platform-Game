import Phaser from 'phaser';
import config from '../Config/config';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    // Game
    this.gameButton = this.add.sprite(100, 200, 'blueButton1').setInteractive();
    this.centerButton(this.gameButton, 1);

    this.gameText = this.add.text(0, 0, 'Play', {
      fontSize: '32px',
      fill: '#fff',
    });
    this.constructor.centerButtonText(this.gameText, this.gameButton);

    this.gameButton.on('pointerdown', () => {
      this.scene.start('Game');
    });

    // Options
    this.optionsButton = this.add
      .sprite(300, 200, 'blueButton1')
      .setInteractive();
    this.centerButton(this.optionsButton);

    this.optionsText = this.add.text(0, 0, 'Options', {
      fontSize: '32px',
      fill: '#fff',
    });
    this.constructor.centerButtonText(this.optionsText, this.optionsButton);

    this.optionsButton.on('pointerdown', () => {
      this.scene.start('Options');
    });

    // Credits
    this.creditsButton = this.add
      .sprite(300, 200, 'blueButton1')
      .setInteractive();
    this.centerButton(this.creditsButton, -1);

    this.creditsText = this.add.text(0, 0, 'Credits', {
      fontSize: '32px',
      fill: '#fff',
    });
    this.constructor.centerButtonText(this.creditsText, this.creditsButton);

    this.creditsButton.on('pointerdown', () => {
      this.scene.start('Credits');
    });

    this.input.on('pointerover', (event, gameObjects) => {
      gameObjects[0].setTexture('blueButton2');
    });

    this.input.on('pointerout', (event, gameObjects) => {
      gameObjects[0].setTexture('blueButton1');
    });
  }

  centerButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(
        config.width / 2,
        config.height / 2 - offset * 100,
        config.width,
        config.height,
      ),
    );
  }

  static centerButtonText(gameText, gameButton) {
    Phaser.Display.Align.In.Center(gameText, gameButton);
  }
}

/* eslint-disable no-unused-expressions */
import Phaser from 'phaser';
import config from '../Config/config';

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    this.creditsText = this.add.text(0, 0, 'Credits', {
      fontSize: '32px',
      fill: '#fff',
    });

    this.madeByText = this.add.text(0, 0, 'Created By: Eduardo Gutierrez', {
      fontSize: '26px',
      fill: '#fff',
    });

    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height,
    );

    this.backButton = this.add.sprite(100, 200, 'blueButton1').setInteractive();
    this.placeButton(this.backButton, 1);
    this.buttonText = this.add.text(0, 0, 'Back', {
      fontSize: '32px',
      fill: '#fff',
    });

    this.constructor.centerButtonText(this.buttonText, this.backButton);

    this.backButton.on('pointerdown', () => {
      this.scene.start('Title');
    });

    this.input.on('pointerover', (event, gameObjects) => {
      gameObjects[0].setTexture('blueButton2');
    });

    this.input.on('pointerout', (event, gameObjects) => {
      gameObjects[0].setTexture('blueButton1');
    });

    Phaser.Display.Align.In.Center(this.creditsText, this.zone);

    Phaser.Display.Align.In.Center(this.madeByText, this.zone);

    this.madeByText.setY(1000);

    this.creditsTween = this.tweens.add({
      targets: this.creditsText,
      y: -100,
      ease: 'Power1',
      duration: 2000,
      delay: 1000,
      onComplete: () => {
        this.destroy;
      },
    });

    this.madeByTween = this.tweens.add({
      targets: this.madeByText,
      y: -300,
      ease: 'Power1',
      duration: 5000,
      delay: 1000,
      onComplete: () => {
        this.madeByTween.destroy;
        this.scene.start('Title');
      },
    });
  }

  placeButton(gameObject, offset = 0) {
    Phaser.Display.Align.In.BottomLeft(
      gameObject,
      this.add.zone(
        config.width / 2,
        config.height / 2 - offset * 100,
        config.width,
        config.height,
      ),
    );
  }

  static centerButtonText(text, button) {
    Phaser.Display.Align.In.Center(text, button);
  }
}

import Phaser from 'phaser';
import Button from '../Objects/Buttons';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('Options');
  }

  create() {
    const { width } = this.cameras.main;
    this.model = this.sys.game.globals.model;
    // Create Sound Options Buttons
    this.text = this.add.text(300 + 300, 100 + 100, 'Options', {
      fontSize: 40,
    });
    this.musicButton = this.add.image(width / 2 - 100, 200 + 150, 'Box');
    this.musicText = this.add.text(width / 2 - 50, 190 + 150, 'Music Enabled', {
      fontSize: 24,
    });

    this.hardButton = this.add.image(width / 2 - 100, 300 + 150, 'checkedBox');
    this.hardText = this.add.text(width / 2 - 50, 290 + 150, 'Hard Mode', {
      fontSize: 24,
    });

    this.musicButton.setInteractive();
    this.hardButton.setInteractive();

    this.musicButton.on('pointerdown', () => {
      this.model.musicOn = !this.model.musicOn;
      this.updateAudio();
    });

    this.hardButton.on('pointerdown', () => {
      this.model.hardMode = !this.model.hardMode;
      this.updateAudio();
    });

    // Menu Button
    this.menuButton = new Button(
      this,
      400 + 300,
      100 + 500,
      'blueButton1',
      'blueButton2',
      'Menu',
      'Title',
    );
    this.updateAudio();
  }

  // Logic to turn on and off game audio in global state
  updateAudio() {
    if (this.model.musicOn === false) {
      this.musicButton.setTexture('box');
      this.sys.game.globals.bgMusic.stop();
      this.model.bgMusicPlaying = false;
    } else {
      this.musicButton.setTexture('checkedBox');
      if (this.model.bgMusicPlaying === false) {
        this.sys.game.globals.bgMusic.play();
        this.model.bgMusicPlaying = true;
      }
    }

    if (this.model.hardMode === false) {
      this.hardButton.setTexture('box');
    } else {
      this.hardButton.setTexture('checkedBox');
    }
  }
}

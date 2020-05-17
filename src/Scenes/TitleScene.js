import Phaser from 'phaser';
import config from '../Config/config';
import Button from '../Objects/Buttons';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('Title');
  }

  create() {
    this.model = this.sys.game.globals.model;

    // Game button
    if (this.model.hardMode === true) {
      this.gameButton = new Button(
        this,
        config.width / 2,
        config.height / 2 - 100,
        'blueButton1',
        'blueButton2',
        'Play',
        'GameHard',
      );
    } else if (this.model.hardMode === false) {
      this.gameButton = new Button(
        this,
        config.width / 2,
        config.height / 2 - 100,
        'blueButton1',
        'blueButton2',
        'Play',
        'Game',
      );
    }

    // Options button
    this.optionsButton = new Button(
      this,
      config.width / 2,
      config.height / 2,
      'blueButton1',
      'blueButton2',
      'Options',
      'Options',
    );

    // Credits button
    this.creditsButton = new Button(
      this,
      config.width / 2,
      config.height / 2 + 100,
      'blueButton1',
      'blueButton2',
      'Credits',
      'Credits',
    );

    // Add music to the game
    this.model = this.sys.game.globals.model;

    this.bgMusic = this.sound.add('bgMusic', {
      volume: 0.2,
      loop: true,
    });
    this.sys.game.globals.bgMusic = this.bgMusic;

    // Play music depending on global music state
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
    }
  }
}

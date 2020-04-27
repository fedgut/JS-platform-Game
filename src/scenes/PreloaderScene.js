/* eslint-disable func-names */
import Phaser from 'phaser';
import star from '../assets/star.png';
import dude from '../assets/dude.png';
import sky from '../assets/sky.png';
import bomb from '../assets/bomb.png';
import platform from '../assets/platform.png';
import phaserLogo from '../assets/logo.png';
import box from '../assets/ui/grey_box.png';
import checkedBox from '../assets/ui/blue_boxCheckmark.png';
import bgMusic from '../assets/TownTheme.mp3';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  ready() {
    this.scene.start('Title');
  }

  timedEvent() {
    this.time.delayedCall(2000, this.ready, [], this);
  }

  preload() {
    // add loading image
    this.add.image(1024, 768, 'loading');

    // add loading progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0xc10230, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#010230',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', (value) => {
      percentText.setText(`${parseInt(value * 100, 10)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    // remove progress bar when complete
    this.load.on(
      'complete',
      // eslint-disable-next-line prefer-arrow-callback
      function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
        this.timedEvent();
      }.bind(this),
    );

    // preload game assets
    this.load.image('sky', sky);
    this.load.image('star', star);
    this.load.image('ground', platform);
    this.load.image('bomb', bomb);
    this.load.image('phaserLogo', phaserLogo);
    this.load.image('box', box);
    this.load.image('checkedBox', checkedBox);
    this.load.audio('bgMusic', bgMusic);

    this.load.spritesheet('dude', dude, {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {}
}

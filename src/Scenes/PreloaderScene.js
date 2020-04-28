/* eslint-disable func-names */
import Phaser from 'phaser';

import button1 from '../../assets/ui/blue_button02.png';
import button2 from '../../assets/ui/blue_button03.png';
import phaserLogo from '../../assets/logo.png';
import box from '../../assets/ui/grey_box.png';
import checkedBox from '../../assets/ui/blue_boxCheckmark.png';
import bgMusic from '../../assets/TownTheme.mp3';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
    this.progressBar = undefined;
    this.progressBox = undefined;
    this.percentText = undefined;
    this.assetText = undefined;
    this.loadingText = undefined;
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    // add logo image
    this.add.image(400, 200, 'logo');

    // display progress bar
    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    this.loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff',
      },
    });

    this.loadingText.setOrigin(0.5, 0.5);

    this.percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });

    this.percentText.setOrigin(0.5, 0.5);

    this.assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
        fill: '#ffffff',
      },
    });
    this.assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', (value) => {
      this.percentText.setText(`${parseInt(value * 100, 10)}%`);
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', (file) => {
      this.assetText.setText(`Loading asset: ${file.key}`);
    });

    // remove progress bar when complete
    this.load.on(
      'complete',
      // eslint-disable-next-line prefer-arrow-callback
      function () {
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
        this.percentText.destroy();
        this.assetText.destroy();
        this.ready();
      }.bind(this),
    );

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    // load assets needed in our game
    this.load.image('blueButton1', button1);
    this.load.image('blueButton2', button2);
    this.load.image('phaserLogo', phaserLogo);
    this.load.image('box', box);
    this.load.image('checkedBox', checkedBox);
    this.load.audio('bgMusic', bgMusic);
  }

  ready() {
    this.scene.start('Options');
    this.readyCount++;
    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
}

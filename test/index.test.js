import Phaser from 'phaser';
import Model from '../src/Model';

import config from '../src/Config/config';
import GameScene from '../src/Scenes/GameScene';
import GameHardScene from '../src/Scenes/GameHardScene';
import PreloaderScene from '../src/Scenes/PreloaderScene';
import TitleScene from '../src/Scenes/TitleScene';
import OptionsScene from '../src/Scenes/OptionsScene';
import CreditsScene from '../src/Scenes/CreditsScene';

export default class Game extends Phaser.Game {
  constructor() {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null };
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('GameHard', GameHardScene);
    this.scene.start('Boot');
  }
}

window.game = new Game();

test('should be a testament of the proper configuration of jest to handle ES6, import and canvas, working with webpacked assets (with mocking for images and css)', () => {
  expect(window.game).not.toBe(undefined);
});

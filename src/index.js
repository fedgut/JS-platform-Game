import Phaser from 'phaser';
import Model from './Model';
import './style.css';

import config from './Config/config';
import GameScene from './Scenes/GameScene';
import GameHardScene from './Scenes/GameHardScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import GameOverScene from './Scenes/GameOverScene';
import HighScoresScene from './Scenes/HighScoresScene';

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
    this.scene.add('GameOver', GameOverScene);
    this.scene.add('HighScores', HighScoresScene);
    this.scene.start('Preloader');
  }
}

const button = document.getElementById('button');

button.onclick = () => {
  const inputUsername = document.getElementById('username');
  const user = JSON.stringify(inputUsername.value);
  const div = document.getElementById('login');
  if (inputUsername.value !== '') {
    localStorage.clear();
    localStorage.setItem('user', user);
    div.removeChild(inputUsername);
    div.removeChild(button);
    div.classList += 'dnone';
    window.game = new Game();
  }
};

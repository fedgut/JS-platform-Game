import Phaser from 'phaser';
import { postScores, getScores } from '../API/Scorehandler';
import Button from '../Objects/Buttons';

export default class OptionsScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const score = localStorage.getItem('score');
    const user = JSON.parse(localStorage.getItem('user'));

    this.text = this.add.text(450, 200, `Game Over! Score: ${score}`, {
      fontSize: 40,
    });

    if (score > 100) {
      this.text = this.add.text(475, 350, `Congratulations ${user}`, {
        fontSize: 40,
      });
    } else {
      this.text = this.add.text(445, 350, `Better luck next time ${user}`, {
        fontSize: 40,
      });
    }

    postScores(user, score);
    getScores();

    // Menu Button
    this.menuButton = new Button(
      this,
      675,
      500,
      'blueButton1',
      'blueButton2',
      'Play Again',
      'Game',
    );
  }
}

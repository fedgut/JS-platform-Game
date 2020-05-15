import Phaser from 'phaser';
import postScores from '../API/PostScore';
import Button from '../Objects/Buttons';
import config from '../Config/config';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create() {
    const score = localStorage.getItem('score');
    const user = JSON.parse(localStorage.getItem('user'));
    postScores(user, score);

    this.text = this.add.text(450, 200, `Game Over! Score: ${score}`, {
      fontSize: 40,
    });

    if (score > 75) {
      this.text = this.add.text(475, 350, `Congratulations ${user}`, {
        fontSize: 40,
      });
    } else {
      this.text = this.add.text(445, 350, `Better luck next time ${user}`, {
        fontSize: 40,
      });
    }

    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height,
    );

    Phaser.Display.Align.In.Center(this.text, this.zone);

    Phaser.Display.Align.In.Center(this.text, this.zone);

    // Ttitle Button
    this.TitleButton = new Button(
      this,
      675,
      500,
      'blueButton1',
      'blueButton2',
      'Title',
      'Title',
    );

    // See Scores Button
    this.ScoresButton = new Button(
      this,
      675,
      575,
      'blueButton1',
      'blueButton2',
      'HighScores',
      'HighScores',
    );
  }
}

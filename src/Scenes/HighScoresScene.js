import Phaser from 'phaser';
import renderScores from '../API/ServeHighScore';
import Button from '../Objects/Buttons';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('HighScores');
  }

  create() {
    const table = `<div class="table">
  <h1>Top 10 Scores</h1>
  <table id="table">
    <tr>
      <th class="table-row">Player</th>
      <th class="table-row">Score</th>
    </tr>
  </table>
</div>`;
    const element = this.add.dom(667, 200).createFromHTML(table);

    this.tweens.add({
      targets: element,
      y: 300,
      duration: 50,
      onComplete: () => {
        renderScores();
      },
    });

    this.TitleButton = new Button(
      this,
      667,
      650,
      'blueButton1',
      'blueButton2',
      'Title',
      'Title',
    );
  }
}

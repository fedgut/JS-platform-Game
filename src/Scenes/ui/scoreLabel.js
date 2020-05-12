import Phaser from 'phaser';

const formatScore = (score) => `Score: ${score}`;

export default class ScoreLabel extends Phaser.GameObjects.Text {
  constructor(scene, x, y, score, style) {
    super(scene, x, y, formatScore(score), style);
    this.score = score;
  }

  setScore(score) {
    this.score = score;
    this.updateScoreText();
  }

  getScore() {
    return this.score;
  }

  add(points) {
    this.setScore(this.score + points);
  }

  remove(points) {
    this.setScore(this.score - points);
  }

  updateScoreText() {
    this.setText(formatScore(this.score));
  }
}

import Phaser from 'phaser';
import ScoreLabel from '../ui/ScoreLabel';
import BombSpawner from '../helpers/BombSpawner';

const DUDE_KEY = 'dude';
const GROUND_KEY = 'ground';
const STAR_KEY = 'star';
const BOMB_KEY = 'bomb';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');

    this.player = undefined;
    this.cursors = undefined;
    this.stars = undefined;
    this.ScoreLabel = undefined;
    this.bombSpawner = undefined;

    this.gameOver = false;
  }

  hitBomb(player) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.gameOver = true;
  }

  // eslint-disable-next-line no-shadow
  collectStar(player, star) {
    star.disableBody(true, true);
    this.ScoreLabel.add(10);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        child.enableBody(true, child.x, 0, true, true);
      });
    }
    this.bombSpawner.spawn(player.x);
  }

  createPlatforms() {
    const platforms = this.physics.add.staticGroup();

    platforms.create(800, 620, GROUND_KEY).setScale(4).refreshBody();
    platforms.create(170, 370, GROUND_KEY);
    platforms.create(470, 170, GROUND_KEY);
    platforms.create(800, 300, GROUND_KEY);
    platforms.create(1300, 400, GROUND_KEY);
    platforms.create(390, 470, GROUND_KEY).setScale(0.5).refreshBody();

    return platforms;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 22,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    return stars;
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, DUDE_KEY);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: DUDE_KEY, frame: 4 }],
      frameRate: 20,
    });

    return this.player;
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#000' };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }

  create() {
    this.add.image(400, 300, 'sky');
    this.add.image(1200, 300, 'sky');

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    this.stars = this.createStars();

    this.ScoreLabel = this.createScoreLabel(16, 15, 0);

    this.bombSpawner = new BombSpawner(this, BOMB_KEY);
    const bombsGroup = this.bombSpawner.group;

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.gameOver) {
      return;
    }
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-260);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(260);

      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-380);
    }
  }
}

import Phaser from 'phaser';
import config from '../Config/config';
import Player from '../Objects/player';
import ScoreLabel from './ui/scoreLabel';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.gameOptions = {
      platformSpeedRange: [250, 350],
      spawnRange: [80, 200],
      platformSizeRange: [180, 250],
      platformHeightRange: [-5, 5],
      platformHeighScale: 10,
      platformVerticalLimit: [0.4, 0.8],
      jumpForce: 400,
      playerStartPosition: 200,
      jumps: 3,
      coinPercent: 75,
      bombPercent: 15,
    };
    this.config = config;
    this.player = undefined;
    this.coins = undefined;
    this.platforms = undefined;
    this.bombs = undefined;
    this.ScoreLabel = undefined;
    this.explosions = undefined;
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: '32px', fill: '#FFF' };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }

  createAnimations() {
    this.anims.create({
      key: 'rotate',
      frames: this.anims.generateFrameNumbers('coin', {
        start: 0,
        end: 5,
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    });

    this.anims.create({
      key: 'firebomb',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'fireball',
        start: 1,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'enemy-death',
        start: 3,
        end: 9,
      }),
      frameRate: 10,
      repeat: 0,
    });
  }

  addPlatform(platformWidth, posX, posY) {
    const platform = this.physics.add.sprite(posX, posY, 'platform');
    platform.setImmovable(true);
    platform.setGravityY(-this.config.physics.arcade.gravity.y);
    platform.setVelocityX(
      Phaser.Math.Between(
        this.gameOptions.platformSpeedRange[0],
        this.gameOptions.platformSpeedRange[1],
      ) * -1,
    );
    this.platforms.add(platform);
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      this.gameOptions.spawnRange[0],
      this.gameOptions.spawnRange[1],
    );

    if (Phaser.Math.Between(1, 100) <= this.gameOptions.coinPercent) {
      const coin = this.physics.add.sprite(posX, posY - 96, 'coin');
      coin.setImmovable(true);
      coin.setGravityY(-this.config.physics.arcade.gravity.y);
      coin.setVelocityX(platform.body.velocity.x);
      coin.anims.play('rotate');
      this.coins.add(coin);
    }
    if (Phaser.Math.Between(1, 100) <= this.gameOptions.bombPercent) {
      const bomb = this.physics.add.sprite(posX + 25, posY - 25, 'firebomb');
      bomb.setGravityY(-this.config.physics.arcade.gravity.y - 10);
      bomb.setVelocityX(platform.body.velocity.x);
      bomb.anims.play('firebomb');
      this.bombs.add(bomb);
    }
  }

  jump() {
    if (
      this.player.body.touching.down
      || (this.playerJumps > 0 && this.playerJumps < this.gameOptions.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.jump();
      this.playerJumps += 1;
    }
  }

  setScore() {
    const key = 'score';
    const value = this.ScoreLabel.getScore();
    localStorage.setItem(key, value);
  }

  checkGameOver() {
    if (this.player.y > this.config.height) {
      this.setScore();
      this.scene.start('GameOver');
    }
  }

  initiateGame() {
    this.player.x = this.gameOptions.playerStartPosition;
  }

  platformHandler() {
    let minDistance = this.config.width;
    let rightmostPlatformHeight = 0;
    this.platforms.getChildren().forEach((platform) => {
      const platformDistance = this.config.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < -platform.displayWidth / 2) {
        this.platforms.killAndHide(platform);
        this.platforms.remove(platform, true, true);
      }
    }, this);

    if (minDistance > this.nextPlatformDistance) {
      const nextPlatformWidth = Phaser.Math.Between(
        this.gameOptions.platformSizeRange[0],
        this.gameOptions.platformSizeRange[1],
      );
      const platformRandomHeight = this.gameOptions.platformHeighScale
        * Phaser.Math.Between(
          this.gameOptions.platformHeightRange[0],
          this.gameOptions.platformHeightRange[1],
        );
      const nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      const minPlatformHeight = this.config.height * this.gameOptions.platformVerticalLimit[0];
      const maxPlatformHeight = this.config.height * this.gameOptions.platformVerticalLimit[1];
      const nextPlatformHeight = Phaser.Math.Clamp(
        nextPlatformGap,
        minPlatformHeight,
        maxPlatformHeight,
      );
      this.addPlatform(
        nextPlatformWidth,
        this.config.width + nextPlatformWidth / 2,
        nextPlatformHeight,
      );
    }
  }

  collectCoin(player, coin) {
    this.ScoreLabel.add(10);
    this.coins.remove(coin);
    this.tweens.add({
      targets: coin,
      y: coin.y - 100,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.easeOut',
      callbackScope: this,
      onComplete: () => {
        this.coins.killAndHide(coin);
      },
    });
  }

  catchFireball(player, bomb) {
    this.ScoreLabel.remove(20);
    this.bombs.remove(bomb);
    this.player.isHurt = true;
    const explode = this.physics.add.sprite(bomb.x, bomb.y, 'explode');
    explode.setGravityY(bomb.body.gravity.y);
    explode.setVelocityX(bomb.body.velocity.x);
    explode.anims.play('explode');
    this.explosions.add(explode);
    this.tweens.add({
      targets: bomb,
      y: bomb.y - 1,
      alpha: 0,
      duration: 1000,
      ease: 'Cubic.easeOut',
      callbackScope: this,
      onComplete: () => {
        this.bombs.killAndHide(bomb);
        this.explosions.killAndHide(explode);
        this.player.isHurt = false;
      },
    });
  }

  create() {
    this.platforms = this.add.group();
    this.coins = this.add.group();
    this.bombs = this.add.group();
    this.explosions = this.add.group();

    this.playerJumps = 0;
    this.ScoreLabel = this.createScoreLabel(16, 15, 0);

    this.createAnimations();

    this.addPlatform(
      this.config.width,
      this.config.width / 4,
      this.config.height * this.gameOptions.platformVerticalLimit[1],
    );

    this.player = new Player(
      this,
      this.gameOptions.playerStartPosition,
      this.config.height / 2,
      this.gameOptions.jumpForce,
    );

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.coins,
      this.collectCoin,
      null,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.bombs,
      this.catchFireball,
      null,
      this,
    );

    this.input.on('pointerdown', this.jump, this);
  }

  update() {
    this.checkGameOver();
    this.initiateGame();
    this.platformHandler();
    this.player.animationsManager();
  }
}

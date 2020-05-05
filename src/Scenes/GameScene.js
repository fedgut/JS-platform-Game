import Phaser from 'phaser';
import config from '../Config/config';
import Player from '../Objects/player';

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
      jumps: 2,
      coinPercent: 25,
      bombPercent: 25,
    };
    this.config = config;
    this.player = undefined;
    this.coins = undefined;
    this.platforms = undefined;
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
      key: 'fireball',
      frames: this.anims.generateFrameNames('atlas', {
        prefix: 'fireball',
        start: 1,
        end: 3,
      }),
      frameRate: 20,
      repeat: -1,
    });
  }

  create() {
    this.addedPlatforms = 0;

    this.platforms = this.add.group();
    this.coins = this.add.group();
    this.playerJumps = 0;

    this.addPlatform(
      this.config.width,
      this.config.width / 2,
      this.config.height * this.gameOptions.platformVerticalLimit[1],
    );

    this.player = new Player(
      this,
      this.gameOptions.playerStartPosition,
      this.config.height / 2,
      this.gameOptions.jumpForce,
    );

    this.physics.add.collider(this.player, this.platforms);

    this.input.on('pointerdown', this.jump, this);
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
  }

  jump() {
    if (
      this.player.body.touching.down ||
      (this.playerJumps > 0 && this.playerJumps < this.gameOptions.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.jump();
      this.playerJumps += 1;
    }
  }

  checkGameOver() {
    if (this.player.y > this.config.height) {
      this.scene.start('Game');
    }
  }

  initiateGame() {
    this.player.x = this.gameOptions.playerStartPosition;
  }

  platformHandler() {
    let minDistance = this.config.width;
    let rightmostPlatformHeight = 0;
    this.platforms.getChildren().forEach((platform) => {
      const platformDistance =
        this.config.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < -platform.displayWidth / 2) {
        this.platforms.killAndHide(platform);
        this.platforms.remove(platform);
      }
    }, this);

    if (minDistance > this.nextPlatformDistance) {
      const nextPlatformWidth = Phaser.Math.Between(
        this.gameOptions.platformSizeRange[0],
        this.gameOptions.platformSizeRange[1],
      );
      const platformRandomHeight =
        this.gameOptions.platformHeighScale *
        Phaser.Math.Between(
          this.gameOptions.platformHeightRange[0],
          this.gameOptions.platformHeightRange[1],
        );
      const nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      const minPlatformHeight =
        this.config.height * this.gameOptions.platformVerticalLimit[0];
      const maxPlatformHeight =
        this.config.height * this.gameOptions.platformVerticalLimit[1];
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

  update() {
    this.checkGameOver();
    this.initiateGame();
    this.platformHandler();
    this.player.animationsManager();
  }
}

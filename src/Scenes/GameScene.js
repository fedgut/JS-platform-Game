import Phaser from 'phaser';
import config from '../Config/config';
import Player from '../Objects/player';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
    this.gameOptions = {
      platformSpeedRange: [300, 400],
      spawnRange: [80, 400],
      platformSizeRange: [90, 300],
      platformHeightRange: [-10, 10],
      platformHeighScale: 10,
      platformVerticalLimit: [0.4, 0.8],
      jumpForce: 400,
      playerStartPosition: 200,
      jumps: 5,
      coinPercent: 25,
      bombPercent: 25,
    };
    this.config = config;
  }

  createAnimations() {
    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });

    // setting coin animation
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
  }

  create() {
    this.addedPlatforms = 0;
    // group with all active platforms.
    this.platforms = this.add.group({
      removeCallback: (platform) => {
        platform.scene.platformPool.add(platform);
      },
    });

    // pool
    this.platformPool = this.add.group({
      removeCallback: (platform) => {
        platform.scene.platforms.add(platform);
      },
    });

    this.coinGroup = this.add.group({
      removeCallback: (coin) => {
        coin.scene.coinPool.add(coin);
      },
    });

    // coin pool
    this.coinPool = this.add.group({
      removeCallback: (coin) => {
        coin.scene.coinGroup.add(coin);
      },
    });

    // number of consecutive jumps made by the player
    this.playerJumps = 0;

    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(
      this.config.width,
      this.config.width / 2,
      this.config.height * this.gameOptions.platformVerticalLimit[1],
    );

    // adding the player;
    this.player = new Player(
      this,
      this.gameOptions.playerStartPosition,
      this.config.height / 2,
      this.gameOptions.jumpForce,
    );

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platforms);

    // checking for input
    this.input.on('pointerdown', this.jump, this);
  }

  // the core of the script: platform are added from the pool or created on the fly
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

  // the player jumps as long as there are jumps left and the first jump was on the ground
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

  update() {
    // game over

    if (this.player.y > this.config.height) {
      this.scene.start('Game');
    }
    this.player.x = this.gameOptions.playerStartPosition;
    // deleting platforms
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

    // adding new platforms
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
}

import Phaser from 'phaser';

export default class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, _jumpSpeed) {
    super(scene, x, y, 'atlas', 'idle1');

    this.scene = scene;

    this.speed = 70;
    this.jumpSpeed = _jumpSpeed;
    this.isCrouching = false;
    this.isAttacking = false;
    this.isAirAttacking = false;
    this.isHurt = false;

    scene.anims.create({
      key: 'player_idle',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'idle',
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'player_crouch_kick',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'crouch-kick',
        start: 1,
        end: 5,
      }),
      frameRate: 20,
      repeat: 0,
    });
    scene.anims.create({
      key: 'player_crouch',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'crouch',
        start: 1,
        end: 2,
      }),
      frameRate: 20,
      repeat: 0,
    });
    scene.anims.create({
      key: 'player_fall',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'fall',
        start: 1,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'player_flying_kick',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'flying-kick',
        start: 1,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'player_hurt',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'hurt',
        start: 1,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'player_jump',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'jump',
        start: 1,
        end: 2,
      }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: 'player_kick',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'kick',
        start: 1,
        end: 5,
      }),
      frameRate: 20,
      repeat: 0,
    });
    scene.anims.create({
      key: 'player_punch',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'punch',
        start: 1,
        end: 6,
      }),
      frameRate: 20,
      repeat: 0,
    });
    scene.anims.create({
      key: 'player_walk',
      frames: scene.anims.generateFrameNames('atlas', {
        prefix: 'walk',
        start: 1,
        end: 6,
      }),
      frameRate: 20,
      repeat: -1,
    });

    this.play('player_idle');

    // on complete animation event
    this.on('animationcomplete', this.animComplete, this);

    scene.add.existing(this);

    // physics
    scene.physics.world.enableBody(this);

    // set size
    this.setOrigin(0.5, 0.5);
    this.body.setSize(12, 44);
    this.body.offset.y = 16;
  }

  // eslint-disable-next-line class-methods-use-this
  create() {}

  // eslint-disable-next-line no-unused-vars
  animComplete(animation, frame) {
    // reset flags when the animations complete
    if (
      animation.key === 'player_kick'
      || animation.key === 'player_punch'
      || animation.key === 'player_crouch_kick'
    ) {
      this.isAttacking = false;
    }
  }

  moveRight() {
    this.body.velocity.x = this.speed;
    this.flipX = false;
  }

  moveLeft() {
    this.body.velocity.x = -this.speed;
    this.flipX = true;
  }

  stopMove() {
    this.body.velocity.x = 0;
  }

  jump() {
    this.body.velocity.y = -this.jumpSpeed;
    // this.scene.audioJump.play();
  }

  crouch() {
    if (!this.isCrouching) {
      this.isCrouching = true;
      this.play('player_crouch', false);
    }
  }

  standUp() {
    if (this.isCrouching) {
      this.isCrouching = false;
    }
  }

  attack() {
    this.isAttacking = true;
    this.body.velocity.x = 0;
    if (Math.random() > 0.5) {
      this.play('player_kick', true);
    } else {
      this.play('player_punch', true);
    }

    this.scene.audioAttack.play();
  }

  airAttack() {
    this.isAirAttacking = true;
    this.play('player_flying_kick', true);
    this.body.velocity.x *= 1.5;
    this.scene.audioAttack.play();
  }

  crouchAttack() {
    this.isAttacking = true;
    this.body.velocity.x = 0;
    this.play('player_crouch_kick', true);
    this.scene.audioAttack.play();
  }

  animationsManager() {
    if (this.isHurt) {
      this.play('player_hurt', true);
      return;
    }

    if (this.isAttacking || this.isAirAttacking || this.isCrouching) {
      return;
    }

    if (this.body.touching.down) {
      this.play('player_walk', true);
    } else if (this.body.velocity.y > 0) {
      this.play('player_fall', true);
    } else {
      this.play('player_jump', true);
    }
  }

  update() {
    this.animationsManager();

    // reset hurt
    if (this.isHurt && this.body.onFloor()) {
      this.isHurt = false;
    }

    // reset air isAttacking
    if (this.isAirAttacking && this.body.onFloor()) {
      this.isAirAttacking = false;
    }
  }
}

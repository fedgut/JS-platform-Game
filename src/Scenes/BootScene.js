import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.html('nameform', 'assets/loginform.html');
  }

  create() {
    const element = this.add.dom(667, 600).createFromCache('nameform');

    element.setPerspective(800);

    element.addListener('click');

    element.on('click', (event) => {
      if (event.target.name === 'loginButton') {
        const inputUsername = element.getChildByName('username');
        const user = JSON.stringify(inputUsername.value);

        if (inputUsername.value !== '') {
          localStorage.clear();
          localStorage.setItem('user', user);
          element.removeListener('click');
          this.tweens.add({
            targets: element.rotate3d,
            x: 1,
            w: 90,
            duration: 500,
            ease: 'Power3',
          });

          this.tweens.add({
            targets: element,
            scaleX: 2,
            scaleY: 2,
            y: 700,
            alpha: 0,
            duration: 1500,
            ease: 'Cubic.easeOut',
            onComplete: () => {
              element.setVisible(false);
              this.scene.start('Preloader');
            },
          });
        }
      }
    });

    this.tweens.add({
      targets: element,
      y: 300,
      duration: 1500,
      ease: 'Power3',
    });
  }
}

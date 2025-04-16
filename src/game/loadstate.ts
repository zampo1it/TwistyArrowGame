declare const Phaser: any;

export default class LoadState extends Phaser.State {
  preload() {
    this.load.image('target', '/assets/images/target.png');
    this.load.image('arrow', '/assets/images/arrow_bow.png');
    this.load.image('bow', '/assets/images/bow.png');
    this.load.image('tet', '/assets/images/tet.png');
    this.load.audio("shoot", "assets/sounds/shoot.mp3");
    this.load.audio("fail", "assets/sounds/fail.mp3");
    this.load.image("back", "assets/images/back.png");
  }

  create() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.refresh();
  
    this.state.start('createstate');
  }
  
}

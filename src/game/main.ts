import CreateState from './createstate';
import LoadState from './loadstate';

export default class Game {
  constructor(parent: HTMLElement) {
    const Phaser = (window as any).Phaser;

    const container = document.createElement("div");
    container.className = "pt-[env(safe-area-inset-top)] bg-white";
    container.id = "phaser-container";
    document.body.appendChild(container);

    const game = new Phaser.Game(
      
      window.innerWidth,
      window.innerHeight,
      Phaser.CANVAS,
      parent
    );

    game.state.add('loadstate', LoadState, false);
    game.state.add('createstate', CreateState, false);
    game.state.start('loadstate');

  }
}

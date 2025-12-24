import Game from './game.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('game-canvas');
  const uiRoot = document.getElementById('ui-root');
  Game.init(canvas, uiRoot);
});

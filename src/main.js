import Game from './game.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('game-canvas');
  const uiRoot = document.getElementById('ui-root');
  Game.init(canvas, uiRoot);

  // menu buttons
  const menu = document.getElementById('menu-overlay');
  const btnNew = document.getElementById('menu-new');
  const btnLoad = document.getElementById('menu-load');
  const btnOptions = document.getElementById('menu-options');
  const btnAbout = document.getElementById('menu-about');
  const countdownEl = document.getElementById('menu-countdown');

  function hideMenu() {
    if (menu) menu.style.display = 'none';
  }

  function showMenuWithWave(wave = 0) {
    if (!menu) return;
    const mw = document.getElementById('menu-wave');
    if (mw) {
      if (wave > 0) {
        mw.textContent = `You died on Wave ${wave}`;
        mw.setAttribute('aria-hidden', 'false');
      } else {
        mw.textContent = '';
        mw.setAttribute('aria-hidden', 'true');
      }
    }
    // re-enable buttons
    if (btnNew) btnNew.disabled = false;
    if (btnLoad) btnLoad.disabled = true;
    if (btnOptions) btnOptions.disabled = true;
    if (btnAbout) btnAbout.disabled = true;
    menu.style.display = 'flex';
  }

  // expose to Game instance so game logic can show menu on death
  Game.showMenu = showMenuWithWave;
  Game.hideMenu = hideMenu;

  function showCountdown(seconds = 5) {
    if (!countdownEl) return Promise.resolve();
    countdownEl.setAttribute('aria-hidden', 'false');
    return new Promise((resolve) => {
      let s = seconds;
      countdownEl.textContent = `Starting in ${s}...`;
      const iv = setInterval(() => {
        s -= 1;
        if (s > 0) countdownEl.textContent = `Starting in ${s}...`;
        else {
          clearInterval(iv);
          countdownEl.textContent = '';
          countdownEl.setAttribute('aria-hidden', 'true');
          resolve();
        }
      }, 1000);
    });
  }

  if (btnNew) {
    btnNew.addEventListener('click', async () => {
      // disable buttons while counting down
      btnNew.disabled = true;
      if (btnLoad) btnLoad.disabled = true;
      if (btnOptions) btnOptions.disabled = true;
      if (btnAbout) btnAbout.disabled = true;
      await showCountdown(5);
      hideMenu();
      Game.start();
    });
  }

  // other buttons are placeholders for later
  if (btnLoad) btnLoad.addEventListener('click', () => {});
  if (btnOptions) btnOptions.addEventListener('click', () => {});
  if (btnAbout) btnAbout.addEventListener('click', () => {});
});

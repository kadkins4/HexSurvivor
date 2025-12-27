import Player from './entities/player.js';
import Hud from './ui/hud.js';
import Projectile from './entities/projectile.js';
import FloatingText from './ui/floatingText.js';
import Explosion from './ui/explosion.js';
import resolveCircleSeparation from './systems/collision.js';
import WaveManager from './systems/waveManager.js';
import {
  SHAKE_INTENSITY_CONTACT,
  SHAKE_DURATION_CONTACT,
  FENCE_AREA,
} from './constants.js';

const Game = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  player: null,
  enemies: [],
  projectiles: [],
  floatingTexts: [],
  explosions: [],
  hud: null,
  lastTime: 0,
  delta: 0,
  running: true,
  started: false,
  _menuShown: false,

  init(canvas, uiRoot) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.player = new Player(this.width / 2, this.height / 2);
    this.hud = new Hud(uiRoot, this);

    this.waveManager = new WaveManager(this);

    this.explosions = [];

    this.projectiles = [];
    this.floatingTexts = [];

    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  },

  // begin the actual run (called after menu countdown)
  start() {
    if (this.started) return;
    this.started = true;

    if (this.waveManager) this.waveManager.startNextWave();
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  },

  loop(ts) {
    this.delta = (ts - this.lastTime) / 1000;
    this.lastTime = ts;
    this.update(this.delta);
    this.render();
    if (this.running) requestAnimationFrame(this.loop.bind(this));
  },

  update(dt) {
    if (!this.started) return; // pause updates until the player starts
    this.player.update(dt, this);
    for (let e of this.enemies) e.update(dt, this);
    // resolve enemy separation (moved to helper for readability)
    resolveCircleSeparation(this.enemies);

    // wave manager (spawns enemies over time)
    if (this.waveManager) this.waveManager.update(dt);

    // update projectiles and floating texts (extracted helpers)
    this.updateProjectiles(dt);
    this.updateFloatingTexts(dt);

    // update explosions
    for (let ex of this.explosions) ex.update(dt);
    this.explosions = this.explosions.filter((ex) => !ex.dead);

    // update screen shake timer
    if (this._shake) {
      this._shake.timer -= dt;
      if (this._shake.timer <= 0) this._shake = null;
    }

    this.enemies = this.enemies.filter((e) => !e.dead);

    // check for player death and show menu once
    if (this.player && this.player.hp <= 0) {
      this.running = false;
      if (!this._menuShown) {
        this._menuShown = true;
        const wave = this.waveManager ? this.waveManager.getWaveNumber() : 0;
        if (typeof this.showMenu === 'function') this.showMenu(wave);
        else {
          // fallback: directly manipulate DOM
          const menu = document.getElementById('menu-overlay');
          const mw = document.getElementById('menu-wave');
          if (mw) {
            mw.textContent = `You died on Wave ${wave}`;
            mw.setAttribute('aria-hidden', 'false');
          }
          if (menu) menu.style.display = 'flex';
        }
      }
    }
  },

  updateProjectiles(dt) {
    for (let p of this.projectiles) p.update(dt, this);
    // mark projectiles outside kill area as dead before filtering
    this.applyFenceArea();
    this.projectiles = this.projectiles.filter((p) => !p.dead);
  },

  // mark entities that move outside the allowed arena + margin as dead
  applyFenceArea() {
    const m = FENCE_AREA;
    const w = this.width;
    const h = this.height;
    const out = (ent) => {
      if (!ent || typeof ent.x !== 'number' || typeof ent.y !== 'number')
        return false;
      return ent.x < -m || ent.x > w + m || ent.y < -m || ent.y > h + m;
    };
    const markArr = (arr) => {
      if (!arr) return;
      for (let e of arr) if (!e.dead && out(e)) e.dead = true;
    };
    markArr(this.enemies);
    markArr(this.projectiles);
    markArr(this.explosions);
    markArr(this.floatingTexts);
  },

  updateFloatingTexts(dt) {
    for (let f of this.floatingTexts) f.update(dt);
    this.floatingTexts = this.floatingTexts.filter((f) => !f.dead);
  },

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    // subtle grid
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#fff';
    for (let x = 0; x < this.width; x += 40) ctx.fillRect(x, 0, 1, this.height);
    for (let y = 0; y < this.height; y += 40) ctx.fillRect(0, y, this.width, 1);
    ctx.restore();

    // apply screen shake offset while rendering game objects
    ctx.save();
    if (this._shake) {
      const s = this._shake;
      const intensity = s.intensity || 4;
      const progress = Math.max(0, s.timer / s.duration);
      const mag = intensity * progress;
      const ox = (Math.random() * 2 - 1) * mag;
      const oy = (Math.random() * 2 - 1) * mag;
      ctx.translate(ox, oy);
    }

    for (let e of this.enemies) e.render(ctx);
    for (let p of this.projectiles) p.render(ctx);
    this.player.render(ctx);
    // explosions underneath floating text
    for (let ex of this.explosions) ex.render(ctx);
    // floating texts on top
    for (let f of this.floatingTexts) f.render(ctx);
    ctx.restore();
  },

  spawnProjectile(x, y, target, damage = 10, source = null) {
    this.projectiles.push(
      new Projectile(x, y, target, damage, undefined, source)
    );
  },

  spawnExplosion(x, y, opts = {}) {
    this.explosions.push(new Explosion(x, y, opts));
  },

  startScreenShake(
    intensity = SHAKE_INTENSITY_CONTACT,
    duration = SHAKE_DURATION_CONTACT
  ) {
    this._shake = { intensity, timer: duration, duration };
  },

  // reset game state to start a fresh run
  reset() {
    this._menuShown = false;
    // recreate player and clear entities
    this.player = new Player(this.width / 2, this.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.floatingTexts = [];

    // reset wave manager to start at wave 1
    if (this.waveManager) {
      // set to zero so startNextWave() advances to wave 1
      this.waveManager.waveIndex = 0;
      this.waveManager.spawnQueue = [];
      this.waveManager.spawning = false;
      this.waveManager.waitingForClear = false;
      this.waveManager.nextWaveTimer = 0;
      this.waveManager.startNextWave();
    } else {
      this.waveManager = new WaveManager(this);
      this.waveManager.startNextWave();
    }

    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  },

  spawnFloatingText(x, y, text, color = '#fff') {
    this.floatingTexts.push(new FloatingText(x, y, text, color));
  },
};

export default Game;

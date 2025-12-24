import Player from './entities/player.js';
import Hud from './ui/hud.js';
import Drone from './entities/drone.js';
import Striker from './entities/striker.js';
import Tank from './entities/tank.js';
import Projectile from './entities/projectile.js';
import FloatingText from './ui/floatingText.js';
import resolveCircleSeparation from './systems/collision.js';
import WaveManager from './systems/waveManager.js';

const Game = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  player: null,
  enemies: [],
  projectiles: [],
  floatingTexts: [],
  hud: null,
  lastTime: 0,
  delta: 0,
  running: true,

  init(canvas, uiRoot) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.player = new Player(this.width / 2, this.height / 2);
    this.hud = new Hud(uiRoot, this);

    // spawn a few enemies for demo (wave manager will handle waves)
    this.waveManager = new WaveManager(this);
    this.waveManager.startNextWave();

    this.projectiles = [];
    this.floatingTexts = [];

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
    this.player.update(dt, this);
    for (let e of this.enemies) e.update(dt, this);
    // resolve enemy separation (moved to helper for readability)
    resolveCircleSeparation(this.enemies);

    // wave manager (spawns enemies over time)
    if (this.waveManager) this.waveManager.update(dt);

    // update projectiles and floating texts (extracted helpers)
    this.updateProjectiles(dt);
    this.updateFloatingTexts(dt);

    this.enemies = this.enemies.filter(e => !e.dead);
  },

  updateProjectiles(dt) {
    for (let p of this.projectiles) p.update(dt, this);
    this.projectiles = this.projectiles.filter(p => !p.dead);
  },

  updateFloatingTexts(dt) {
    for (let f of this.floatingTexts) f.update(dt);
    this.floatingTexts = this.floatingTexts.filter(f => !f.dead);
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

    for (let e of this.enemies) e.render(ctx);
    for (let p of this.projectiles) p.render(ctx);
    this.player.render(ctx);
    // floating texts on top
    for (let f of this.floatingTexts) f.render(ctx);
  },

  spawnProjectile(x, y, target, damage = 10) {
    this.projectiles.push(new Projectile(x, y, target, damage));
  },

  // reset game state to start a fresh run
  reset() {
    // recreate player and clear entities
    this.player = new Player(this.width / 2, this.height / 2);
    this.enemies = [];
    this.projectiles = [];
    // spawn initial demo enemies (mix of types — will be replaced by wave manager later)
    // 3 Drones, 2 Strikers, 1 Tank
    for (let i = 0; i < 3; i++) this.enemies.push(Drone.spawnAtEdge(this.width, this.height));
    for (let i = 0; i < 2; i++) this.enemies.push(Striker.spawnAtEdge(this.width, this.height));
    this.enemies.push(Tank.spawnAtEdge(this.width, this.height));
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop.bind(this));
  }

  ,spawnFloatingText(x, y, text, color = '#fff') {
    this.floatingTexts.push(new FloatingText(x, y, text, color));
  }
};

export default Game;

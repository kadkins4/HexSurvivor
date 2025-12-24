import Drone from '../entities/drone.js';
import Striker from '../entities/striker.js';
import Tank from '../entities/tank.js';

export default class WaveManager {
  constructor(game) {
    this.game = game;
    this.waveIndex = 0;
    this.spawnQueue = [];
    this.spawnInterval = 0.45;
    this.spawnTimer = 0;
    this.spawning = false;
    this.waitingForClear = false;
    this.nextWaveDelay = 2.0;
    this.nextWaveTimer = 0;
  }

  startNextWave() {
    this.waveIndex += 1;
    this.buildSpawnQueue();
    this.spawning = true;
    this.spawnTimer = 0;
    this.waitingForClear = false;
    this.nextWaveTimer = 0;
  }

  // start a custom wave with explicit counts (drones, strikers, tanks)
  startCustomWave(drones = 0, strikers = 0, tanks = 0) {
    this.waveIndex += 1;
    const q = [];
    for (let i = 0; i < drones; i++) q.push('drone');
    for (let i = 0; i < strikers; i++) q.push('striker');
    for (let i = 0; i < tanks; i++) q.push('tank');
    // shuffle
    for (let i = q.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [q[i], q[j]] = [q[j], q[i]];
    }
    this.spawnQueue = q;
    this.spawning = true;
    this.spawnTimer = 0;
    this.waitingForClear = false;
  }

  // restart the current wave (rebuild spawn queue and clear existing enemies)
  restartWave() {
    if (this.waveIndex <= 0) {
      this.startNextWave();
      return;
    }
    this.buildSpawnQueue();
    // clear existing enemies
    this.game.enemies.length = 0;
    this.spawning = true;
    this.spawnTimer = 0;
    this.waitingForClear = false;
  }

  // clear current wave (stop spawning and remove enemies)
  clearWave() {
    this.spawnQueue = [];
    this.spawning = false;
    this.waitingForClear = false;
    this.game.enemies.length = 0;
  }

  buildSpawnQueue() {
    // simple progression: base drones, add strikers after wave 3, add occasional tank
    const base = 6 + this.waveIndex * 2;
    const strikers = Math.max(0, Math.floor((this.waveIndex - 2) / 2));
    const tanks = (this.waveIndex % 5 === 0) ? 1 : 0;
    const drones = Math.max(0, base - strikers * 2 - tanks * 3);

    const q = [];
    for (let i = 0; i < drones; i++) q.push('drone');
    for (let i = 0; i < strikers; i++) q.push('striker');
    for (let i = 0; i < tanks; i++) q.push('tank');

    // simple shuffle
    for (let i = q.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [q[i], q[j]] = [q[j], q[i]];
    }
    this.spawnQueue = q;
  }

  update(dt) {
    if (this.spawning && this.spawnQueue.length > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnTimer = this.spawnInterval;
        const type = this.spawnQueue.shift();
        this.spawnOne(type);
      }
      if (this.spawnQueue.length === 0) {
        this.spawning = false;
        this.waitingForClear = true;
      }
    } else if (this.waitingForClear) {
      // wait until arena clears (no enemies)
      if (this.game.enemies.length === 0) {
        this.nextWaveTimer += dt;
        if (this.nextWaveTimer >= this.nextWaveDelay) {
          this.startNextWave();
        }
      }
    }
  }

  spawnOne(type) {
    let ent = null;
    if (type === 'drone') ent = Drone.spawnAtEdge(this.game.width, this.game.height);
    else if (type === 'striker') ent = Striker.spawnAtEdge(this.game.width, this.game.height);
    else if (type === 'tank') ent = Tank.spawnAtEdge(this.game.width, this.game.height);
    if (ent) this.game.enemies.push(ent);
  }

  getWaveNumber() { return this.waveIndex; }
}

import Drone from '../entities/enemy/enemies/drone.js';
import Charger from '../entities/enemy/enemies/charger.js';
import Tank from '../entities/enemy/enemies/tank.js';
import { icons } from './icons.js';

export default class Hud {
  constructor(root, game) {
    this.game = game;
    this.root = root;
    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.root.appendChild(this.el);
    this._tick = this._tick.bind(this);

    // control panel (adjust player stats + spawn enemies)
    this.panel = document.createElement('div');
    this.panel.className = 'control-panel';
    this.panel.style =
      'height: 70vh; overflow-y: auto; width: 220px; margin-left: 8px';

    // load the full HUD (controls + dev tools) from external file for easier editing
    const devPath = '/src/dev/hud-dev.html';

    fetch(devPath)
      .then((res) => {
        if (!res.ok) throw new Error('no dev file');
        return res.text();
      })
      .then((html) => {
        this.panel.innerHTML = html;
        this._wirePanel();
      })
      .catch((e) => console.error('error loading dev HUD file: ', e));

    // append to UI root (sidebar) if available, else body
    const mount = this.root || document.body;
    mount.appendChild(this.panel);

    // NOTE: HUD HTML is loaded above (fetch -> _wirePanel). No second insert required.

    // wiring is done after the HUD document is injected (see _wirePanel)
    // start HUD update loop after panel and inputs exist
    this.update();
    requestAnimationFrame(this._tick);
  }

  _wirePanel() {
    // avoid double wiring
    if (this._wired) return;
    this._wired = true;

    this.maxHpInput = this.panel.querySelector('#ctl-maxhp');
    this.dmgInput = this.panel.querySelector('#ctl-dmg');
    this.frInput = this.panel.querySelector('#ctl-fr');
    this.rangeInput = this.panel.querySelector('#ctl-range');
    this.lsInput = this.panel.querySelector('#ctl-lifesteal');

    this.spawnDroneBtn = this.panel.querySelector('#spawn-drone');
    this.spawnChargerBtn = this.panel.querySelector('#spawn-charger');
    this.spawnTankBtn = this.panel.querySelector('#spawn-tank');
    this.spawnMultiBtn = this.panel.querySelector('#spawn-multi');
    this.countDrone = this.panel.querySelector('#count-drone');
    this.countCharger = this.panel.querySelector('#count-charger');
    this.countTank = this.panel.querySelector('#count-tank');

    this.customDrones = this.panel.querySelector('#custom-drones');
    this.customChargers = this.panel.querySelector('#custom-chargers');
    this.customTanks = this.panel.querySelector('#custom-tanks');

    this.startCustomBtn = this.panel.querySelector('#start-custom-wave');
    this.restartWaveBtn = this.panel.querySelector('#restart-wave');
    this.nextWaveBtn = this.panel.querySelector('#next-wave');
    this.clearWaveBtn = this.panel.querySelector('#clear-wave');

    // basic DEV controls
    this.invincibleChk = this.panel.querySelector('#invincible');
    this.timeScaleSelect = this.panel.querySelector('#time-scale');
    this.restartBtn = this.panel.querySelector('#restart-btn');
    if (this.restartBtn)
      this.restartBtn.addEventListener('click', () => {
        this.game.reset();
      });

    if (this.spawnDroneBtn)
      this.spawnDroneBtn.addEventListener('click', () => {
        const e = Drone.spawnAtEdge(this.game.width, this.game.height);
        this.game.enemies.push(e);
      });
    if (this.spawnChargerBtn)
      this.spawnChargerBtn.addEventListener('click', () => {
        const e = Charger.spawnAtEdge(this.game.width, this.game.height);
        this.game.enemies.push(e);
      });
    if (this.spawnTankBtn)
      this.spawnTankBtn.addEventListener('click', () => {
        const e = Tank.spawnAtEdge(this.game.width, this.game.height);
        this.game.enemies.push(e);
      });

    if (this.spawnMultiBtn)
      this.spawnMultiBtn.addEventListener('click', () => {
        const d = Number(this.countDrone.value) || 0;
        const c = Number(this.countCharger.value) || 0;
        const t = Number(this.countTank.value) || 0;
        for (let i = 0; i < d; i++)
          this.game.enemies.push(
            Drone.spawnAtEdge(this.game.width, this.game.height)
          );
        for (let i = 0; i < s; i++)
          this.game.enemies.push(
            Striker.spawnAtEdge(this.game.width, this.game.height)
          );
        for (let i = 0; i < t; i++)
          this.game.enemies.push(
            Tank.spawnAtEdge(this.game.width, this.game.height)
          );
      });

    if (this.startCustomBtn)
      this.startCustomBtn.addEventListener('click', () => {
        const d = Number(this.customDrones.value) || 0;
        const s = Number(this.customStrikers.value) || 0;
        const t = Number(this.customTanks.value) || 0;
        if (this.game.waveManager)
          this.game.waveManager.startCustomWave(d, s, t);
      });
    if (this.restartWaveBtn)
      this.restartWaveBtn.addEventListener('click', () => {
        if (this.game.waveManager) this.game.waveManager.restartWave();
      });
    if (this.nextWaveBtn)
      this.nextWaveBtn.addEventListener('click', () => {
        if (this.game.waveManager) this.game.waveManager.startNextWave();
      });
    if (this.clearWaveBtn)
      this.clearWaveBtn.addEventListener('click', () => {
        if (this.game.waveManager) this.game.waveManager.clearWave();
      });

    try {
      if (this.startCustomBtn) {
        const ic = icons.play({ width: 18, height: 18 });
        if (ic) this.startCustomBtn.appendChild(ic);
      }
      if (this.restartWaveBtn) {
        const ic = icons.restart({ width: 18, height: 18 });
        if (ic) this.restartWaveBtn.appendChild(ic);
      }
      if (this.nextWaveBtn) {
        const ic = icons.next({ width: 18, height: 18 });
        if (ic) this.nextWaveBtn.appendChild(ic);
      }
      if (this.clearWaveBtn) {
        const ic = icons.clear({ width: 18, height: 18 });
        if (ic) this.clearWaveBtn.appendChild(ic);
      }
    } catch (e) {
      console.error('error injecting icons into HUD buttons: ', e);
    }

    const applyPlayerInputs = () => {
      const p = this.game.player;
      if (!p) return;
      const maxHp = Number(this.maxHpInput.value) || p.maxHp;
      const dmg = Number(this.dmgInput.value) || p.damage;
      const fr = Number(this.frInput.value) || p.fireRate;
      const range = Number(this.rangeInput.value) || p.range;
      const prevMax = p.maxHp;
      p.maxHp = maxHp;
      if (prevMax > 0) p.hp = Math.min(p.maxHp, (p.hp / prevMax) * p.maxHp);
      p.damage = dmg;
      p.fireRate = fr;
      p.range = range;
      if (this.lsInput) {
        const v = this.lsInput.value;
        if (v !== '') p.lifesteal = Number(v) / 100;
      }
    };

    if (this.maxHpInput)
      this.maxHpInput.addEventListener('change', applyPlayerInputs);
    if (this.dmgInput)
      this.dmgInput.addEventListener('change', applyPlayerInputs);
    if (this.frInput)
      this.frInput.addEventListener('change', applyPlayerInputs);
    if (this.rangeInput)
      this.rangeInput.addEventListener('change', applyPlayerInputs);
    if (this.lsInput)
      this.lsInput.addEventListener('change', applyPlayerInputs);

    if (this.invincibleChk)
      this.invincibleChk.addEventListener('change', () => {
        const p = this.game.player;
        if (!p) return;
        p.invincible = !!this.invincibleChk.checked;
      });

    if (this.timeScaleSelect)
      this.timeScaleSelect.addEventListener('change', () => {
        const v = Number(this.timeScaleSelect.value) || 1;
        this.game.timeScale = v;
      });
  }

  _tick() {
    this.update();
    requestAnimationFrame(this._tick);
  }

  update() {
    const p = this.game.player;
    const enemies = this.game.enemies.length;
    if (p) {
      // populate inputs with current values if empty (guard inputs may not be wired yet)
      if (this.maxHpInput && !this.maxHpInput.value)
        this.maxHpInput.value = Math.round(p.maxHp);
      if (this.dmgInput && !this.dmgInput.value)
        this.dmgInput.value = Math.round(p.damage);
      if (this.frInput && !this.frInput.value) this.frInput.value = p.fireRate;
      if (this.rangeInput && !this.rangeInput.value)
        this.rangeInput.value = Math.round(p.range);
      if (this.lsInput && !this.lsInput.value)
        this.lsInput.value = Math.round((p.lifesteal || 0) * 100);
    }
    const waveNum = this.game.waveManager
      ? this.game.waveManager.getWaveNumber()
      : 0;

    // ensure time scale select reflects current game setting
    if (this.timeScaleSelect && !this.timeScaleSelect.value)
      this.timeScaleSelect.value = String(this.game.timeScale || 1);

    this.el.innerHTML = `
      <div>Wave: ${waveNum}</div>
      <div>HP: ${Math.round(p.hp)} / ${Math.round(p.maxHp)}</div>
      <div>Enemies: ${enemies}</div>
    `;
  }
}

import Drone from '../entities/enemy/enemies/drone.js';
import Striker from '../entities/enemy/enemies/striker.js';
import Tank from '../entities/enemy/enemies/tank.js';

export default class Hud {
  constructor(root, game) {
    this.game = game;
    this.root = root;
    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.el.style = 'margin-left:20px';
    this.root.appendChild(this.el);
    this._tick = this._tick.bind(this);

    // control panel (adjust player stats + spawn enemies)
    this.panel = document.createElement('div');
    this.panel.className = 'control-panel';

    // load the full HUD (controls + dev tools) from external file for easier editing
    this.panel.innerHTML = '<div class="loading">Loading...</div>';
    const devPath = '/src/ui/hud-dev.html';
    const fallback = `
      <details open>
        <summary class="small">Player Controls</summary>
        <label>Max HP<input id="ctl-maxhp" type="number" step="1"></label>
        <label>Damage<input id="ctl-dmg" type="number" step="1"></label>
        <label>Fire Rate<input id="ctl-fr" type="number" step="0.1"></label>
        <label>Range<input id="ctl-range" type="number" step="1"></label>
      </details>

      <details>
        <summary class="small">Enemy Spawner</summary>
        <div style="display:flex;gap:6px;margin-top:6px;">
          <button id="spawn-drone" class="spawn-btn">Spawn Drone</button>
          <button id="spawn-striker" class="spawn-btn">Spawn Striker</button>
          <button id="spawn-tank" class="spawn-btn">Spawn Tank</button>
        </div>
        <details>
        <summary class="small" style="margin-top:8px">Quick Spawn</summary>
        <label>Drone x<input id="count-drone" type="number" step="1" value="3"></label>
        <label>Striker x<input id="count-striker" type="number" step="1" value="2"></label>
        <label>Tank x<input id="count-tank" type="number" step="1" value="1"></label>
        <button id="spawn-multi" class="spawn-btn">Spawn Multiple</button>
        </details>
      </details>

      <details>
        <summary class="small">Wave Controls</summary>
        <div style="margin-top:6px;">
          <label>Custom - Drones<input id="custom-drones" type="number" step="1" value="5"></label>
          <label>Custom - Strikers<input id="custom-strikers" type="number" step="1" value="2"></label>
          <label>Custom - Tanks<input id="custom-tanks" type="number" step="1" value="0"></label>
          <button id="start-custom-wave" class="spawn-btn">Start Custom Wave</button>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px;">
          <button id="restart-wave" class="spawn-btn">Restart Wave</button>
          <button id="next-wave" class="spawn-btn">Next Wave</button>
          <button id="clear-wave" class="spawn-btn">Clear Wave</button>
        </div>
      </details>

      <details>
        <summary class="small">DEV TOOLS</summary>
        <div style="margin-top:6px;display:flex;flex-direction:column;gap:6px;">
          <button id="restart-btn" class="spawn-btn">Restart</button>
        </div>
      </details>
    `;

    fetch(devPath)
      .then((res) => {
        if (!res.ok) throw new Error('no dev file');
        return res.text();
      })
      .then((html) => {
        this.panel.innerHTML = html;
        this._wirePanel();
      })
      .catch(() => {
        this.panel.innerHTML = fallback;
        this._wirePanel();
      });

    // append to UI root (sidebar) if available, else body
    const mount = this.root || document.body;
    mount.appendChild(this.panel);

    // NOTE: HUD HTML is loaded above (fetch -> _wirePanel). No second insert required.

    // wiring is done after the HUD document is injected (see _wirePanel)
    // start HUD update loop after panel and inputs exist
    this.update();
    requestAnimationFrame(this._tick);
  }

  _wireRestart() {
    this.restartBtn = this.panel.querySelector('#restart-btn');
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        this.game.reset();
      });
    }
  }

  _wirePanel() {
    // avoid double wiring
    if (this._wired) return;
    this._wired = true;

    this.maxHpInput = this.panel.querySelector('#ctl-maxhp');
    this.dmgInput = this.panel.querySelector('#ctl-dmg');
    this.frInput = this.panel.querySelector('#ctl-fr');
    this.rangeInput = this.panel.querySelector('#ctl-range');

    this.spawnDroneBtn = this.panel.querySelector('#spawn-drone');
    this.spawnStrikerBtn = this.panel.querySelector('#spawn-striker');
    this.spawnTankBtn = this.panel.querySelector('#spawn-tank');
    this.spawnMultiBtn = this.panel.querySelector('#spawn-multi');
    this.countDrone = this.panel.querySelector('#count-drone');
    this.countStriker = this.panel.querySelector('#count-striker');
    this.countTank = this.panel.querySelector('#count-tank');

    this.customDrones = this.panel.querySelector('#custom-drones');
    this.customStrikers = this.panel.querySelector('#custom-strikers');
    this.customTanks = this.panel.querySelector('#custom-tanks');

    this.startCustomBtn = this.panel.querySelector('#start-custom-wave');
    this.restartWaveBtn = this.panel.querySelector('#restart-wave');
    this.nextWaveBtn = this.panel.querySelector('#next-wave');
    this.clearWaveBtn = this.panel.querySelector('#clear-wave');

    // basic DEV controls
    this.invincibleChk = this.panel.querySelector('#invincible');
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
    if (this.spawnStrikerBtn)
      this.spawnStrikerBtn.addEventListener('click', () => {
        const e = Striker.spawnAtEdge(this.game.width, this.game.height);
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
        const s = Number(this.countStriker.value) || 0;
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
    };

    if (this.maxHpInput)
      this.maxHpInput.addEventListener('change', applyPlayerInputs);
    if (this.dmgInput)
      this.dmgInput.addEventListener('change', applyPlayerInputs);
    if (this.frInput)
      this.frInput.addEventListener('change', applyPlayerInputs);
    if (this.rangeInput)
      this.rangeInput.addEventListener('change', applyPlayerInputs);

    if (this.invincibleChk)
      this.invincibleChk.addEventListener('change', () => {
        const p = this.game.player;
        if (!p) return;
        p.invincible = !!this.invincibleChk.checked;
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
    }
    const waveNum = this.game.waveManager
      ? this.game.waveManager.getWaveNumber()
      : 0;
    this.el.innerHTML = `
      <div>Wave: ${waveNum}</div>
      <div>HP: ${Math.round(p.hp)} / ${Math.round(p.maxHp)}</div>
      <div>Enemies: ${enemies}</div>
    `;
  }
}

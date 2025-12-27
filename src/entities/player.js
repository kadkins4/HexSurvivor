import {
  PLAYER_BASE_DAMAGE,
  PLAYER_BASE_RANGE,
  PLAYER_BASE_FIRE_RATE,
  PLAYER_BASE_MAX_HP,
  PLAYER_BASE_RADIUS,
  PLAYER_HITFLASH_DURATION,
} from '../constants';

export default class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = PLAYER_BASE_RADIUS;
    this.maxHp = PLAYER_BASE_MAX_HP;
    this.hp = this.maxHp;
    this.damage = PLAYER_BASE_DAMAGE;
    this.fireRate = PLAYER_BASE_FIRE_RATE; // shots per second
    this.range = PLAYER_BASE_RANGE;
    this.fireTimer = 0;
    this.hitFlash = 0; // seconds remaining for hit flash
    this.lifesteal = 0; // fraction (e.g. 0.15 = 15%)
  }

  update(dt, game) {
    this.makeRangedAttack(dt, game);
  }

  _incomingDamageTo(enemy, game) {
    if (!game || !game.projectiles) return 0;
    let sum = 0;
    for (let p of game.projectiles) {
      if (p && !p.dead && p.target === enemy) sum += p.damage || 0;
    }
    return sum;
  }

  findNearestValid(enemies, game) {
    if (!enemies || enemies.length === 0) return null;
    let closest = null;
    let closestD = Infinity;
    for (let e of enemies) {
      // ignore enemies that will already die from pending projectiles
      const incoming = this._incomingDamageTo(e, game);
      if (e.hp - incoming <= 0) continue;
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const d = Math.hypot(dx, dy);
      if (d < closestD) {
        closestD = d;
        closest = e;
      }
    }
    return closest;
  }

  makeRangedAttack(dt, game) {
    // auto-fire at nearest enemy
    this.fireTimer -= dt;
    // decay hit flash
    if (this.hitFlash > 0) this.hitFlash = Math.max(0, this.hitFlash - dt);
    const enemies = game.enemies;
    const target = this.findNearestValid(enemies, game);
    if (target && this.inRange(target)) {
      if (this.fireTimer <= 0) {
        this.fireTimer = 1 / this.fireRate;
        // spawn a small projectile that travels to the target
        game.spawnProjectile(this.x, this.y, target, this.damage, this);
      }
    }
  }

  flashHit(duration = null) {
    // use configured default when not provided
    const d = duration || PLAYER_HITFLASH_DURATION;
    this.hitFlash = d;
  }

  findNearest(enemies) {
    if (!enemies || enemies.length === 0) return null;
    let closest = null;
    let closestD = Infinity;
    for (let e of enemies) {
      const dx = e.x - this.x;
      const dy = e.y - this.y;
      const d = Math.hypot(dx, dy);
      if (d < closestD) {
        closestD = d;
        closest = e;
      }
    }
    return closest;
  }

  inRange(target) {
    return Math.hypot(target.x - this.x, target.y - this.y) <= this.range;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
    this.flashHit();
  }

  render(ctx) {
    // draw range circle
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.range, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(72,210,255,0.03)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(72,210,255,0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // draw hex
    ctx.fillStyle = '#48d2ff';
    ctx.strokeStyle = '#7ff5ff';
    ctx.lineWidth = 2;
    const r = this.radius;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // overlay red flash if recently hit
    if (this.hitFlash > 0) {
      ctx.globalAlpha = Math.min(0.6, this.hitFlash * 3);
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
}

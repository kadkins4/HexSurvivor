import {
  PROJECTILE_SPEED,
  PROJECTILE_RADIUS,
  EXPLOSION_LIFE,
  EXPLOSION_RADIUS,
  EXPLOSION_COLOR_HIT,
  PROJECTILE_DAMAGE,
} from '../constants';

export default class Projectile {
  constructor(
    x,
    y,
    target,
    damage = PROJECTILE_DAMAGE,
    speed = PROJECTILE_SPEED
  ) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.speed = speed;
    this.radius = PROJECTILE_RADIUS;
    this.dead = false;
  }

  update(dt, game) {
    if (!this.target || this.target.dead) {
      this.dead = true;
      return;
    }
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const move = Math.min(this.speed * dt, d);
    this.x += (dx / d) * move;
    this.y += (dy / d) * move;

    // collision
    if (
      Math.hypot(this.target.x - this.x, this.target.y - this.y) <=
      this.target.radius + this.radius
    ) {
      if (typeof this.target.takeDamage === 'function')
        this.target.takeDamage(this.damage, game);

      if (typeof game.spawnExplosion === 'function') {
        game.spawnExplosion(this.x, this.y, {
          radius: EXPLOSION_RADIUS,
          life: EXPLOSION_LIFE,
          color: EXPLOSION_COLOR_HIT,
        });
      }

      this.dead = true;
    }
  }

  render(ctx) {
    ctx.save();
    ctx.fillStyle = '#ffe47a';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

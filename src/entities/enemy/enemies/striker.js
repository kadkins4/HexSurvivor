import Enemy from '../enemy.js';
import {
  STRIKER_HP,
  STRIKER_APPROACH_SPEED,
  STRIKER_DASH_SPEED,
  STRIKER_CHARGE_RANGE,
  STRIKER_CHARGE_TIME,
  STRIKER_RADIUS,
  STRIKER_EXPLODE_DAMAGE,
  STRIKER_STATUS,
} from '../../../constants.js';

export default class Striker extends Enemy {
  constructor(x, y) {
    super(x, y, STRIKER_HP, STRIKER_APPROACH_SPEED);
    this.radius = STRIKER_RADIUS;
    this.state = STRIKER_STATUS.APPROACH;
    this.chargeTimer = 0;
    this.dashDir = { x: 0, y: 0 };
    this.dashSpeed = STRIKER_DASH_SPEED;
    this.chargeRange = STRIKER_CHARGE_RANGE;
    this.chargeTime = STRIKER_CHARGE_TIME;
  }
  update(dt, game) {
    if (this.dead) return;
    const px = game.player.x;
    const py = game.player.y;
    const dx = px - this.x;
    const dy = py - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    if (this.state === STRIKER_STATUS.APPROACH) {
      // move slowly toward player until in charge range
      const move = Math.min(
        this.speed * dt,
        Math.max(0, dist - (this.radius + game.player.radius))
      );
      if (move > 0) {
        this.x += (dx / dist) * move;
        this.y += (dy / dist) * move;
      }
      if (dist <= this.chargeRange) {
        this.state = STRIKER_STATUS.CHARGING;
        this.chargeTimer = this.chargeTime;
      }
    } else if (this.state === STRIKER_STATUS.CHARGING) {
      this.chargeTimer -= dt;
      if (this.chargeTimer <= 0) {
        // lock dash direction and go
        const nx = dx / dist;
        const ny = dy / dist;
        this.dashDir.x = nx;
        this.dashDir.y = ny;
        this.state = STRIKER_STATUS.DASHING;
      }
    } else if (this.state === STRIKER_STATUS.DASHING) {
      // move fast along dashDir
      this.x += this.dashDir.x * this.dashSpeed * dt;
      this.y += this.dashDir.y * this.dashSpeed * dt;
      // check collision with player
      const newDist = Math.hypot(
        game.player.x - this.x,
        game.player.y - this.y
      );
      const minDist = this.radius + game.player.radius;
      if (newDist <= minDist + 0.01) {
        // deal explode damage and die
        game.player.hp -= STRIKER_EXPLODE_DAMAGE;
        if (game.player.hp <= 0) {
          game.player.hp = 0;
          game.running = false;
        }
        if (typeof game.spawnFloatingText === 'function') {
          game.spawnFloatingText(
            game.player.x,
            game.player.y - game.player.radius - 6,
            `-${Math.round(STRIKER_EXPLODE_DAMAGE)}`,
            '#ff7b7b'
          );
        }
        this.die();
      }
    }
  }

  // draw the striker's shape; base `render` will handle HP bar and transforms
  drawShape(ctx) {
    // different color/shape (triangle)
    ctx.fillStyle = '#ffcc66';
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius, this.radius);
    ctx.lineTo(-this.radius, this.radius);
    ctx.closePath();
    ctx.fill();
  }
}

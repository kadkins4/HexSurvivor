import Enemy from '../enemy.js';
import {
  CHARGER_HP,
  CHARGER_APPROACH_SPEED,
  CHARGER_CHARGE_SPEED,
  CHARGER_CHARGE_RANGE,
  CHARGER_CHARGE_TIME,
  CHARGER_RADIUS,
  CHARGER_EXPLODE_DAMAGE,
  CHARGER_STATUS,
} from '../../../constants.js';

export default class Charger extends Enemy {
  constructor(x, y) {
    super(x, y, CHARGER_HP, CHARGER_APPROACH_SPEED);
    this.radius = CHARGER_RADIUS;
    this.state = CHARGER_STATUS.APPROACH;
    this.chargeTimer = 0;
    this.chargeDir = { x: 0, y: 0 };
    this.chargeSpeed = CHARGER_CHARGE_SPEED;
    this.chargeRange = CHARGER_CHARGE_RANGE;
    this.chargeTime = CHARGER_CHARGE_TIME;
  }

  update(dt, game) {
    if (this.dead) return;
    const px = game.player.x;
    const py = game.player.y;
    const dx = px - this.x;
    const dy = py - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    if (this.state === CHARGER_STATUS.APPROACH) {
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
        this.state = CHARGER_STATUS.FOCUSING;
        this.chargeTimer = this.chargeTime;
      }
    } else if (this.state === CHARGER_STATUS.FOCUSING) {
      this.chargeTimer -= dt;
      if (this.chargeTimer <= 0) {
        // lock charge direction and go
        const nx = dx / dist;
        const ny = dy / dist;
        this.chargeDir.x = nx;
        this.chargeDir.y = ny;
        this.state = CHARGER_STATUS.CHARGING;
      }
    } else if (this.state === CHARGER_STATUS.CHARGING) {
      // move fast along chargeDir
      this.x += this.chargeDir.x * this.chargeSpeed * dt;
      this.y += this.chargeDir.y * this.chargeSpeed * dt;
      // check collision with player
      const newDist = Math.hypot(
        game.player.x - this.x,
        game.player.y - this.y
      );
      const minDist = this.radius + game.player.radius;
      if (newDist <= minDist + 0.01) {
        // deal explode damage and die
        game.player.hp -= CHARGER_EXPLODE_DAMAGE;
        if (game.player.hp <= 0) {
          game.player.hp = 0;
          game.running = false;
        }
        if (typeof game.spawnFloatingText === 'function') {
          game.spawnFloatingText(
            game.player.x,
            game.player.y - game.player.radius - 6,
            `-${Math.round(CHARGER_EXPLODE_DAMAGE)}`,
            '#ff7b7b'
          );
        }
        this.die();
      }
    }
  }

  // draw the charger's shape; base `render` will handle HP bar and transforms
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

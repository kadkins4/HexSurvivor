import Enemy from '../enemy.js';
import {
  SHIELD_HP,
  SHIELD_APPROACH_SPEED,
  SHIELD_ORBIT_RANGE,
  SHIELD_ORBIT_SPEED,
  SHIELD_LENGTH,
  SHIELD_THICKNESS,
} from '../../../constants.js';

export default class Shield extends Enemy {
  constructor(x, y) {
    // give it high HP and approach speed
    super(x, y, SHIELD_HP, SHIELD_APPROACH_SPEED);
    // visual sizes
    this.length = SHIELD_LENGTH;
    this.thickness = SHIELD_THICKNESS;
    // circle-radius is used by base collision with player; use half thickness
    this.radius = Math.max(8, this.thickness / 2);

    // behavior state: 'approach' then 'orbit'
    this.state = 'approach';
    this.orbitRange = SHIELD_ORBIT_RANGE;
    this.orbitSpeed = SHIELD_ORBIT_SPEED;
    this.orbitAngle = 0;

    // allow other enemies to pass through this entity
    this.passThroughAllies = true;
  }

  update(dt, game) {
    if (this.dead) return;
    const px = game.player.x;
    const py = game.player.y;
    const dx = px - this.x;
    const dy = py - this.y;
    const dist = Math.hypot(dx, dy) || 1;

    if (this.state === 'approach') {
      // move quickly toward the orbit range, but don't penetrate player
      const targetDist = Math.max(0, dist - this.orbitRange);
      const move = Math.min(this.speed * dt, targetDist);
      if (move > 0) {
        this.x += (dx / dist) * move;
        this.y += (dy / dist) * move;
      }
      // when near the orbit radius, lock into orbit
      if (Math.abs(dist - this.orbitRange) <= Math.max(4, this.speed * dt)) {
        this.state = 'orbit';
        this.orbitAngle = Math.atan2(this.y - py, this.x - px);
      }
    } else if (this.state === 'orbit') {
      // advance angle and position to orbit around player
      this.orbitAngle += this.orbitSpeed * dt;
      this.x = px + this.orbitRange * Math.cos(this.orbitAngle);
      this.y = py + this.orbitRange * Math.sin(this.orbitAngle);
      // keep facing tangentially (angle used in drawShape)
      this.angle = this.orbitAngle + Math.PI / 2;
    }

    // reuse base contact behavior: stop at player's edge and apply damage if touching
    // call Enemy.update for contact handling when appropriate
    // but avoid re-running approach movement in base class by only using its contact logic
    // We'll copy minimal contact logic so orbiting shield still damages on contact
    const newD = Math.hypot(game.player.x - this.x, game.player.y - this.y);
    const minDist = this.radius + game.player.radius;
    if (newD <= minDist + 0.001) {
      const dmg = 0; // shield is primarily a blocker; no persistent contact damage
      if (
        dmg > 0 &&
        game.player &&
        typeof game.player.takeDamage === 'function'
      ) {
        game.player.takeDamage(dmg * dt);
      }
      this.hitTimer -= dt;
      if (this.hitTimer <= 0) this.hitTimer = 0.2;
    }
  }

  drawShape(ctx) {
    ctx.save();
    // apply rotation if set (orbiting), default to 0
    if (this.angle) ctx.rotate(this.angle);
    ctx.fillStyle = '#9fb3ff';
    ctx.fillRect(
      -this.length / 2,
      -this.thickness / 2,
      this.length,
      this.thickness
    );
    ctx.restore();
  }
}

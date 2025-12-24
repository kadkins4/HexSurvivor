import Enemy from '../enemy.js';
import {
  TANK_HP,
  TANK_SPEED,
  TANK_RADIUS,
  TANK_CONTACT_DPS,
} from '../../../constants.js';

export default class Tank extends Enemy {
  constructor(x, y) {
    super(x, y, TANK_HP, TANK_SPEED);
    this.radius = TANK_RADIUS;
  }

  // Use base Enemy.update for movement and contact damage, but override contact DPS
  update(dt, game) {
    // reuse base movement toward center but override damage amount when touching
    const dx = game.player.x - this.x;
    const dy = game.player.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const minDist = this.radius + game.player.radius;

    const moveDist = this.speed * dt;
    let desired = moveDist;
    if (d - desired < minDist) {
      desired = Math.max(0, d - minDist);
    }
    if (desired > 0) {
      this.x += (dx / d) * desired;
      this.y += (dy / d) * desired;
    }

    const newD = Math.hypot(game.player.x - this.x, game.player.y - this.y);
    if (newD <= minDist + 0.001) {
      const dmg = TANK_CONTACT_DPS * dt;
      if (game.player && typeof game.player.takeDamage === 'function') {
        game.player.takeDamage(dmg);
      }
      if (game.player.hp <= 0) {
        game.player.hp = 0;
        game.running = false;
      }
      this.hitTimer -= dt;
      if (this.hitTimer <= 0) {
        this.hitTimer = 0.22;
        if (typeof game.spawnFloatingText === 'function') {
          game.spawnFloatingText(
            game.player.x,
            game.player.y - game.player.radius - 6,
            `-${Math.max(1, Math.round(dmg))}`,
            '#ff7b7b'
          );
        }
      }
    }
  }
}

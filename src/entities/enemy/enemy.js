import {
  ENEMY_BASE_HP,
  ENEMY_BASE_SPEED,
  ENEMY_BASE_RADIUS,
  ENEMY_CONTACT_DPS,
  EXPLOSION_COLOR_CONTACT,
  SHAKE_INTENSITY_CONTACT,
  SHAKE_DURATION_CONTACT,
  PLAYER_HITFLASH_DURATION,
} from '../../constants';

export default class Enemy {
  constructor(x, y, hp = ENEMY_BASE_HP, speed = ENEMY_BASE_SPEED) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.maxHp = hp;
    this.speed = speed;
    this.dead = false;
    this.radius = ENEMY_BASE_RADIUS;
    this.hitTimer = 0; // cooldown for showing damage to player
  }

  update(dt, game) {
    // move toward center but stop at player edge (prevent passing through)
    const dx = game.player.x - this.x;
    const dy = game.player.y - this.y;
    const d = Math.hypot(dx, dy) || 1;
    const minDist = this.radius + game.player.radius;

    // compute allowed move so we don't penetrate the player
    const moveDist = this.speed * dt;
    let desired = moveDist;
    if (d - desired < minDist) {
      // clamp so we stop at exactly touching distance
      desired = Math.max(0, d - minDist);
    }
    if (desired > 0) {
      this.x += (dx / d) * desired;
      this.y += (dy / d) * desired;
    }

    // if touching player, apply damage over time
    const newD = Math.hypot(game.player.x - this.x, game.player.y - this.y);
    if (newD <= minDist + 0.001) {
      const dmg = ENEMY_CONTACT_DPS * dt; // damage amount
      game.player.hp -= dmg;
      // visual feedback: explosion at contact, screen nudge and player flash
      if (typeof game.spawnExplosion === 'function') {
        game.spawnExplosion(
          (this.x + game.player.x) / 2,
          (this.y + game.player.y) / 2,
          { radius: 8, life: 0.18, color: EXPLOSION_COLOR_CONTACT }
        );
      }
      if (typeof game.startScreenShake === 'function') {
        game.startScreenShake(SHAKE_INTENSITY_CONTACT, SHAKE_DURATION_CONTACT);
      }
      if (game.player && typeof game.player.flashHit === 'function') {
        game.player.flashHit(PLAYER_HITFLASH_DURATION);
      }
      if (game.player.hp <= 0) {
        game.player.hp = 0;
        game.running = false;
      }
      // spawn a damage popup occasionally while touching
      this.hitTimer -= dt;
      if (this.hitTimer <= 0) {
        this.hitTimer = 0.18;
        const shown = Math.max(1, Math.round(dmg));
        if (typeof game.spawnFloatingText === 'function') {
          game.spawnFloatingText(
            game.player.x,
            game.player.y - game.player.radius - 6,
            `-${shown}`,
            '#ff7b7b'
          );
        }
      }
    }
  }

  takeDamage(amount, game) {
    this.hp -= amount;
    if (
      typeof game !== 'undefined' &&
      game &&
      typeof game.spawnFloatingText === 'function'
    ) {
      const shown = Math.max(1, Math.round(amount));
      game.spawnFloatingText(
        this.x,
        this.y - this.radius - 6,
        `-${shown}`,
        '#ffe47a'
      );
      // explosion feedback when enemy is hit
      if (typeof game.spawnExplosion === 'function') {
        game.spawnExplosion(this.x, this.y, {
          radius: Math.max(6, amount * 0.6),
          life: 0.28,
          color: EXPLOSION_COLOR_CONTACT,
        });
      }
    }
    if (this.hp <= 0) this.die();
  }

  die() {
    this.dead = true;
  }

  // default shape drawer for enemies — subclasses may override this
  drawShape(ctx) {
    ctx.fillStyle = '#ff9a76';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    // draw the enemy-specific shape (subclasses can override `drawShape`)
    this.drawShape(ctx);
    // hp bar - drawn for all enemies by base class when damaged
    if (this.hp < this.maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-this.radius, -this.radius - 8, this.radius * 2, 4);
      ctx.fillStyle = '#76ffb6';
      const w = Math.max(0, (this.hp / this.maxHp) * this.radius * 2);
      ctx.fillRect(-this.radius, -this.radius - 8, w, 4);
    }
    ctx.restore();
  }
}

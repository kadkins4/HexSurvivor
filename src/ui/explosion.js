import { EXPLOSION_LIFE, EXPLOSION_RADIUS } from '../constants';

export default class Explosion {
  constructor(x, y, opts = {}) {
    this.x = x;
    this.y = y;
    this.life = opts.life || EXPLOSION_LIFE; // seconds
    this.maxLife = this.life;
    this.radius = opts.radius || EXPLOSION_RADIUS;
    this.color = opts.color || '#ffcf7a';
  }

  update(dt) {
    this.life -= dt;
  }

  render(ctx) {
    const t = 1 - Math.max(0, this.life / this.maxLife);
    const r = this.radius + t * this.radius * 2;
    const alpha = 1 - t;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = alpha * 0.9;
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  get dead() {
    return this.life <= 0;
  }
}

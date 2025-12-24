import { FLOATING_TEXT_LIFETIME } from '../constants';

export default class FloatingText {
  constructor(x, y, text, color = '#fff', lifetime = FLOATING_TEXT_LIFETIME) {
    this.x = x;
    this.y = y;
    this.text = String(text);
    this.color = color;
    this.life = lifetime;
    this.maxLife = lifetime;
    this.vy = -30 - Math.random() * 20; // upward velocity px/s
    this.vx = (Math.random() - 0.5) * 20;
    this.dead = false;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
      return;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  render(ctx) {
    const t = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = Math.min(1, t * 1.2);
    ctx.fillStyle = this.color;
    ctx.font = 'bold 14px system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

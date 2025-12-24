import Enemy from '../enemy.js';
import { DRONE_HP, DRONE_SPEED, DRONE_RADIUS } from '../../../constants.js';
import { drawCircle } from '../../../utils/drawShapes.js';

export default class Drone extends Enemy {
  constructor(x, y) {
    super(x, y, DRONE_HP, DRONE_SPEED);
    this.radius = DRONE_RADIUS;
  }

  drawShape(ctx) {
    drawCircle(ctx, 0, 0, this.radius, '#ff9a76');
  }
}

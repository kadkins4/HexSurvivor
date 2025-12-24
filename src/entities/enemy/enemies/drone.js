import Enemy from '../enemy.js';
import { DRONE_HP, DRONE_SPEED, DRONE_RADIUS } from '../../../constants.js';

export default class Drone extends Enemy {
  constructor(x, y) {
    super(x, y, DRONE_HP, DRONE_SPEED);
    this.radius = DRONE_RADIUS;
  }

  static spawnAtEdge(width, height) {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) {
      x = -20;
      y = Math.random() * height;
    } else if (side === 1) {
      x = width + 20;
      y = Math.random() * height;
    } else if (side === 2) {
      x = Math.random() * width;
      y = -20;
    } else {
      x = Math.random() * width;
      y = height + 20;
    }
    return new Drone(x, y);
  }
}

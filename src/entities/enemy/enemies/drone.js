import Enemy from '../enemy.js';
import { DRONE_HP, DRONE_SPEED, DRONE_RADIUS } from '../../../constants.js';

export default class Drone extends Enemy {
  constructor(x, y) {
    super(x, y, DRONE_HP, DRONE_SPEED);
    this.radius = DRONE_RADIUS;
  }

}

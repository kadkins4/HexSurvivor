// Resolve circle-circle overlap for an array of entities in-place.
// Each entity must have `x`, `y`, `radius`, and optional `dead`.
export default function resolveCircleSeparation(entities, jitter = 0.5) {
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      const entA = entities[i];
      const entB = entities[j];
      if (!entA || !entB || entA.dead || entB.dead) continue;
      const dx = entB.x - entA.x;
      const dy = entB.y - entA.y;
      let distance = Math.hypot(dx, dy);
      const minSeparation = entA.radius + entB.radius;

      if (distance === 0) {
        // apply a tiny jitter so we have a valid normal
        const n = jitter;
        entA.x -= n; entA.y -= n; entB.x += n; entB.y += n;
        distance = Math.hypot(entB.x - entA.x, entB.y - entA.y);
      }

      const overlap = minSeparation - distance;
      if (overlap > 0) {
        const nx = (dx / distance) || 0;
        const ny = (dy / distance) || 0;
        const push = overlap / 2;
        entA.x -= nx * push;
        entA.y -= ny * push;
        entB.x += nx * push;
        entB.y += ny * push;
      }
    }
  }
}

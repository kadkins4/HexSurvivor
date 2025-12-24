# HexHold — TODO (v0)

## High-level TODO (ordered)

- [x] Initialize project (Vite + Vanilla HTML5 Canvas)
- [x] Create base HTML/CSS and canvas scene
- [x] Implement Player core (hex) visuals & stats
- [x] Implement Enemy entity: Drone (circle) movement & HP
- [x] Implement auto-attack: targeting + firing system (nearest)
- [x] Wave manager & spawner (spawn from edges, scaling per wave)
- [ ] Scrap economy: +1 per kill, wave completion bonus
- [ ] Shop overlay & upgrade system (3 offers, buy multiple)
- [x] Add Striker enemy (triangle) and tune balance
- [ ] HUD: HP bar, Scrap count, Wave number, enemies remaining
- [ ] Feedback: hit flashes, small particles, simple sounds (optional)
- [ ] Optional: Pulse ability (AOE, cooldown) and upgrades
- [ ] Polish: balancing, restart/death screen, UI clarity
- [ ] Build & deploy static site (Netlify/Vercel/GitHub Pages)

---

## Files to create (suggested)

- `index.html` — base page
- `src/main.js` — bootstrap + app mounting
- `src/game.js` — game loop, canvas setup, and scene manager
- `src/entities/player.js` — player logic & stats
- `src/entities/enemy.js` — base enemy class
- `src/entities/drone.js`, `src/entities/striker.js` — enemy types
- `src/systems/waveManager.js` — spawner & progression
- `src/systems/shop.js` — upgrade pool & purchases
- `src/ui/hud.js`, `src/ui/shopUI.js` — UI overlays

---

## Ideas

- Once core game loop is established and there is some polish
  - Think about more player control.
    - Lite active abilities
    - Different battlegrounds where the player chooses deployment area
    - AI adapts and tries to attack in a certain way
    - Different ammunition... single hit, piercing, etc
- What would be interesting to add / experiment with?

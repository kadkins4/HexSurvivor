# HexHold — TODO (v0)

## Recommended Stack (JavaScript, no backend)

- Recommended: Vanilla HTML5 Canvas + Vite (ES modules)
  - Pros: minimal dependencies, full control, tiny bundle, easy to reason about
  - Cons: you implement more low-level systems (collisions/timing)
- Alternative: Lightweight libraries (e.g., `kontra.js`) if you want helpers without a full engine

Quick setup (Vite + Vanilla Canvas):

```bash
# create project
npm create vite@latest hexhold -- --template vanilla
cd hexhold
npm install
npm run dev
```

(Or use `npm init vite@latest` if your npm is newer.)

---

## High-level TODO (ordered)

- [x] Initialize project (Vite + Vanilla HTML5 Canvas)
- [x] Create base HTML/CSS and canvas scene
- [ ] Implement Player core (hex) visuals & stats
- [ ] Implement Enemy entity: Drone (circle) movement & HP
- [ ] Implement auto-attack: targeting + firing system (nearest)
- [ ] Wave manager & spawner (spawn from edges, scaling per wave)
- [ ] Scrap economy: +1 per kill, wave completion bonus
- [ ] Shop overlay & upgrade system (3 offers, buy multiple)
- [ ] Add Striker enemy (triangle) and tune balance
- [ ] HUD: HP bar, Scrap count, Wave number, enemies remaining
- [ ] Feedback: hit flashes, small particles, simple sounds (optional)
- [ ] Optional: Pulse ability (AOE, cooldown) and upgrades
- [ ] Polish: balancing, restart/death screen, UI clarity
- [ ] Build & deploy static site (Netlify/Vercel/GitHub Pages)

---

## Implementation notes & priorities (v0 - 5hr scope)

- Minimum playable loop (Hour 0–1): items 1–5 + simple HP/contact damage
- Waves & scaling (Hour 1–2): item 6
- Shop + upgrades (Hour 2–3): items 7–8
- Second enemy + polish (Hour 3–4): item 9–11
- Final polish or single "nice thing" (Hour 4–5): item 12–13

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

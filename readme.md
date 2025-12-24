# HEX HOLD — Game Design Document (GDD)

**Genre:** Idle / auto-shooter tower defense (arena defense)  
**Platform:** PC Web (HTML5 Canvas, JS/HTML/CSS)
**Target build time (v0):** ~5 hours  
**Art:** Zero custom assets (shapes only)  
**Pitch:** You are a single hex-core turret in the center of an arena. Enemies pour in from the edges in waves. You auto-attack, survive, then spend scrap to upgrade between waves. Simple, snappy, expandable.

---

## 1. Theme & Presentation

### Theme

**Neon Training Simulator: Hex Core Defense**

- Player = **Hexagon** (“Core”)
- Enemies = **Circles** (drones), **Triangles** (strikers), optional **Squares** (tanks)
- Arena = dark background with faint grid/vignette
- Hit feedback = quick flash + small particles (or scale punch)
- Audio optional for v0

### Visual constraints (to keep it fast)

- Use a **3–5 color** palette
- No sprites required (primitives/shapes only)
- Minimal UI: wave, HP, scrap, shop overlay

---

## 2. Design Pillars

1. **Auto first:** player attacks automatically; minimal input required.
2. **Readable chaos:** shapes + clear differences (size/speed).
3. **Upgrade dopamine:** between-wave shop is the star.
4. **5-hour scope:** one arena, 2–3 enemy types, ~10–15 upgrades.

---

## 3. Core Game Loop

1. **Wave starts**
2. Enemies spawn from **arena edges**, path toward center
3. Player **auto-attacks** enemies (nearest by default)
4. Player gains **Scrap** per kill
5. Wave ends when enemies are cleared (or timer ends)
6. **Shop phase:** spend Scrap on upgrades
7. Start next wave → repeat until player dies

**Lose condition:** Player HP reaches 0  
**Win condition (v0):** Survive as long as possible / reach wave N (optional)

---

## 4. Player Mechanics (v0)

### Player Unit: “Core” (stationary for simplicity)

- Position locked at center (no movement)
- Auto-target: **nearest enemy**
- Auto-fire: hitscan or projectile (choose simplest in your engine)

### Player Stats

- Max HP
- Damage
- Fire Rate (shots/sec)
- Range
- Optional (v0 or later): Regen, Crit, Multishot

### Optional 1-button ability (nice stretch)

**Pulse (Spacebar / Click)**

- Cooldown: ~10s
- AOE damage + brief knockback around the player
- Adds engagement without complicating movement/aiming

---

## 5. Enemy Design (v0-friendly)

### Enemy Types

Start with **2**; add the 3rd if time permits.

1. **Drone (Circle)** — baseline
   - Low HP, medium speed
2. **Striker (Triangle)** — fast
   - Low HP, high speed
3. **Tank (Square)** — slow bruiser _(optional)_
   - High HP, low speed

### Enemy Behavior

- Move directly toward the center
- On contact: deal damage over time (or chunk damage + despawn)

### Scaling

Per wave:

- Increase spawn count
- Increase enemy HP slightly
- Increase speed slightly (cap it to keep fairness/readability)

---

## 6. Waves & Spawning

### Wave Structure (simple)

- Each wave spawns **N enemies** over time
- Spawn points are random along the arena boundary
- Wave ends when spawned enemies are all dead

### Example Progression

- Wave 1: 10 drones
- Wave 2: 14 drones
- Wave 3: 12 drones + 6 strikers
- Wave 4: 20 mixed
- Wave 5+: gradual ramp

_(Ultra-simple option: just increase count and HP; introduce striker on wave 3.)_

---

## 7. Economy & Upgrades

### Currency: Scrap

- +Scrap per kill (e.g., **+1** baseline)
- +Wave completion bonus (e.g., **5 + waveIndex**)

### Shop Flow (between waves)

- Pause action; show shop overlay
- Offer **3 upgrade cards** (random from pool)
- Each upgrade has a cost (flat or scaling)
- Player buys upgrades, then starts next wave

**5-hour recommendation:** Allow the player to buy **as many upgrades as they can afford** (simpler than “pick 1”).

### Upgrade Pool (v0 set)

Keep upgrades **numeric and stackable**.

#### Offense

- **+Damage** (e.g., +2)
- **+Fire Rate** (e.g., +10%)
- **+Range** (e.g., +10%)
- **Multishot chance** _(optional)_
- **Pierce** (shots go through 1 enemy) _(optional)_

#### Defense

- **+Max HP** (e.g., +10)
- **+Regen** (e.g., +0.2 HP/sec)
- **Armor** (reduce damage by 1)

#### Control

- **Slow Aura** (enemies in range -10% speed)
- **Knockback on hit** (small)

#### Pulse Upgrades (if Pulse exists)

- **Pulse damage** +10
- **Pulse cooldown** -10%

### Cost Scaling (easy)

- Base cost: **10–20 Scrap**
- Each purchase increases future costs: **+5** (or **+10%**) per buy

---

## 8. UI / UX (minimal but complete)

### In-Run HUD

- HP bar (top-left)
- Scrap count
- Wave number
- Optional: enemies remaining

### Shop Screen

- “Wave Complete” title
- 3 upgrade buttons: **name**, **effect**, **cost**
- “Start Next Wave” button
- Optional stretch: “Reroll” (costs Scrap)

### Death Screen

- Wave reached
- Total kills
- Restart button

---

## 9. Audio (optional in v0)

- Shoot “tick”
- Hit “pop”
- Upgrade “chime”
- Death “buzz”

_(Skip if time is tight; add later.)_

---

## 10. Technical Plan (Engine-Agnostic)

### Minimum Systems

1. Entity system: player + enemies (position, HP, speed)
2. Combat: auto-target selection, firing timer, damage application
3. Spawner: spawn schedule per wave
4. Wave manager: start/end wave, completion detection
5. Upgrade system: persistent stat modifiers
6. UI: HUD + Shop overlay + Game Over

### Simple Data Structures

- `PlayerStats` (base + modifiers)
- `Upgrade` objects: `{ id, name, desc, cost, apply(stats) }`
- Wave generation function based on wave index (avoid large authored datasets)

Implementation note (v0): Use Vanilla HTML5 Canvas + Vite (ES modules) for a minimal, dependency-light web build. Implement simple game loop, input, and rendering in `src/game.js`.

---

## 11. 5-Hour Implementation Timeline (v0)

### Hour 0–1: “Playable in 60”

- Arena + player at center (hex)
- Enemy entity (circle) moves toward center
- Player auto-attacks nearest enemy
- Enemy HP + death
- Player HP + contact damage

**Milestone:** you can die and you can kill enemies.

### Hour 1–2: Waves + Spawning

- Wave manager spawns N enemies from edges over time
- End wave when all spawned enemies are dead
- Basic scaling (count + HP)

**Milestone:** waves progress and get harder.

### Hour 2–3: Scrap + Shop

- Scrap per kill + wave completion bonus
- Shop overlay between waves
- Buy upgrades that modify player stats (damage/fire rate/HP)
- Start next wave button

**Milestone:** full loop exists (play → upgrade → play).

### Hour 3–4: 2nd Enemy Type + Polish

- Add striker (triangle): faster, low HP
- Hit feedback (flash/scale)
- HUD clarity and tuning

**Milestone:** it feels like a “game,” not a prototype.

### Hour 4–5: Balance + “One Nice Thing”

Pick **ONE**:

- Pulse ability + cooldown
- Reroll shop option
- Slow aura upgrade
- End-of-run stats

**Milestone:** shippable v0 with a hook.

**Hard scope cut if needed:** ship with only drones + upgrades; no ability.

---

## 12. Expansion Hooks (Post-v0)

- Meta progression (permanent upgrades)
- Boss waves every 5 waves (big shape)
- Weapon mods (chain lightning, splash, rockets)
- Placeable turrets between waves (true TD flavor)
- Map modifiers (smaller arena, hazards, moving spawns)
- Idle/offline gains (scrap based on best wave/time)

---

## 13. MVP Acceptance Criteria (“Done”)

- Player can start, survive waves, buy upgrades, and eventually die
- At least **10 upgrades** implemented
- At least **1 enemy type** (2 is ideal)
- UI shows wave, HP, scrap, and shop options
- Restart works reliably

---

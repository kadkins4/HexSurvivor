// PLAYER
export const PLAYER_BASE_MAX_HP = 100;
export const PLAYER_BASE_RADIUS = 24;
export const PLAYER_BASE_DAMAGE = 10;
export const PLAYER_BASE_FIRE_RATE = 1.5;
export const PLAYER_BASE_RANGE = 250;

// PROJECTILE
export const PROJECTILE_SPEED = 400;
export const PROJECTILE_RADIUS = 4;
export const PROJECTILE_DAMAGE = 10;

// VISUALS
export const EXPLOSION_LIFE = 0.28;
export const EXPLOSION_RADIUS = 6;
export const EXPLOSION_COLOR_HIT = '#ffe47a';
export const EXPLOSION_COLOR_CONTACT = '#ff9a76';

// SCREEN SHAKE
export const SHAKE_INTENSITY_CONTACT = 6;
export const SHAKE_DURATION_CONTACT = 0.12;

// PLAYER
export const PLAYER_HITFLASH_DURATION = 0.18;

// UI
export const FLOATING_TEXT_LIFETIME = 0.9;

// Wave / spawning
export const BASE_ENEMIES_SPAWNED = 4;
export const WAVE_SPAWN_INTERVAL = 0.3;

// ENEMY (defaults)
export const ENEMY_BASE_HP = 12;
export const ENEMY_BASE_SPEED = 40;
export const ENEMY_BASE_RADIUS = 12;
export const ENEMY_CONTACT_DPS = 10;

// DRONE (standard enemy)
export const DRONE_HP = 15;
export const DRONE_SPEED = 50;
export const DRONE_RADIUS = 10;

// STRIKER (charger)
export const STRIKER_HP = 10;
export const STRIKER_APPROACH_SPEED = 35; // slow approach
export const STRIKER_DASH_SPEED = 320; // fast ram
export const STRIKER_CHARGE_RANGE = 160; // start charging when within this
export const STRIKER_CHARGE_TIME = 0.6; // seconds to charge
export const STRIKER_RADIUS = 8;
export const STRIKER_EXPLODE_DAMAGE = 24;
export const STRIKER_STATUS = {
  APPROACH: 'approach',
  CHARGING: 'charging',
  DASHING: 'dashing',
};

// TANK
export const TANK_HP = 60;
export const TANK_SPEED = 20;
export const TANK_RADIUS = 18;
export const TANK_CONTACT_DPS = 18;

// margin outside the visible arena where entities are killed
export const FENCE_AREA = 40;

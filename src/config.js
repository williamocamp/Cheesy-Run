// Global game constants. Single source of truth for grid + canvas sizing.

export const TILE = 44; // simulation tile size, in flat-world pixels
export const GRID_W = 20;
export const GRID_H = 13;

export const GAME_WIDTH = 880;
export const GAME_HEIGHT = 572;

export const MAX_LIVES = 5;

// --- Isometric projection -------------------------------------------------
export const ISO_W = 34;
export const ISO_H = 19;
export const WALL_H = 30;

// --- Neon palette ---------------------------------------------------------
// Dark base everywhere; colour comes from glowing neon accents.
export const COLORS = {
  bg: 0x070311,

  // Isometric wall cube
  wallTop: 0x271642,
  wallLeft: 0x1b0f30,
  wallRight: 0x130a23,
  wallRimTop: 0x00e5ff, // neon cyan top edge
  wallRimSide: 0xff2bd6, // neon magenta vertical edges

  // Vision cone
  vision: 0xff1a5e,
  visionAlert: 0xff5079,

  // Glows
  glowPlayer: 0x7af0ff, // cyan player light
  glowCheese: 0xffe24a,
  glowDonut: 0xff7ad0,
};

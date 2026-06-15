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
  bg: 0xbfe3f2,

  // Isometric wall cube — bright sunlit toy blocks
  wallTop: 0xfff3e0,
  wallLeft: 0xead0b0,
  wallRight: 0xd9b994,
  wallRimTop: 0xb88f63, // soft warm top edge
  wallRimSide: 0xc9a378, // soft warm vertical edges

  // Vision cone
  vision: 0xff5a5a,
  visionAlert: 0xff8a3d,

  // Glows
  glowCheese: 0xffe24a,
  glowDonut: 0xff9ec7,
};

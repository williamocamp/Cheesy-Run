// Global game constants. Single source of truth for grid + canvas sizing.

export const TILE = 44; // simulation tile size, in flat-world pixels
export const GRID_W = 20;
export const GRID_H = 13;

export const GAME_WIDTH = 880;
export const GAME_HEIGHT = 572;

export const MAX_LIVES = 5;

// --- Isometric projection -------------------------------------------------
// A tile diamond is (2*ISO_W) wide and (2*ISO_H) tall on screen. WALL_H is how
// far walls/cubes rise off the floor, in screen pixels.
export const ISO_W = 34;
export const ISO_H = 19;
export const WALL_H = 30;

// Shared palette (warm, toy-like, cozy).
export const COLORS = {
  bg: 0x241e2b,
  floorLivingRoom: 0xf0dcd4,
  floorWood: 0xe6d6bf,
  floorBedroom: 0xdde6ef,
  floorKitchenA: 0xeef2f6,
  floorKitchenB: 0xd6e6f3,
  floorDoorway: 0xe9dcc7,
  floorEdge: 0x000000,
  wallTop: 0x9b88a6,
  wallLeft: 0x6f5f79,
  wallRight: 0x564860,
  wallEdge: 0x42374c,
  vision: 0xff5d5d,
  visionAlert: 0xff2e2e,
};

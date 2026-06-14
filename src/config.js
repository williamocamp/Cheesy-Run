// Global game constants. Single source of truth for grid + canvas sizing.

export const TILE = 44;
export const GRID_W = 20;
export const GRID_H = 13;

export const GAME_WIDTH = GRID_W * TILE;   // 880
export const GAME_HEIGHT = GRID_H * TILE;  // 572

export const MAX_LIVES = 5;

// Shared palette (warm, toy-like, cozy).
export const COLORS = {
  bg: 0x2b2430,
  floorLivingRoom: 0xf0dcd4,
  floorWood: 0xe6d6bf,
  floorBedroom: 0xdde6ef,
  floorKitchenA: 0xeef2f6,
  floorKitchenB: 0xd6e6f3,
  floorDoorway: 0xe9dcc7,
  wall: 0x6a5a73,
  wallTop: 0x82708e,
  wallEdge: 0x4d4055,
  vision: 0xff5d5d,
  visionAlert: 0xff2e2e,
};

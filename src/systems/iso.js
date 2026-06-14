// Isometric projection helpers.
//
// The game *simulates* in flat cartesian world space (the Arcade physics
// bodies). We only *render* in isometric space: every visible sprite is
// projected here and depth-sorted so nearer objects draw on top.

import { TILE, ISO_W, ISO_H } from '../config.js';

// Shared origin offset, set once by the scene so the whole map sits in view.
export const ORIGIN = { x: 0, y: 0 };

export function setOrigin(x, y) {
  ORIGIN.x = x;
  ORIGIN.y = y;
}

// Flat world pixels -> isometric screen position. `z` raises the point off
// the floor (used for wall height / hovering pickups).
export function isoPos(wx, wy, z = 0) {
  const tx = wx / TILE;
  const ty = wy / TILE;
  return {
    x: (tx - ty) * ISO_W + ORIGIN.x,
    y: (tx + ty) * ISO_H - z + ORIGIN.y,
  };
}

// Painter's-algorithm depth: objects further "back" (smaller tx+ty) draw
// first. Continuous, so moving entities sort smoothly against static cells.
export function isoDepth(wx, wy) {
  return (wx + wy) / TILE;
}

// Convert a screen-relative input direction (sx = right, sy = down) into the
// flat-world velocity direction that moves the mouse that way on screen.
export function screenToWorldDir(sx, sy) {
  return {
    x: ISO_H * sx + ISO_W * sy,
    y: -ISO_H * sx + ISO_W * sy,
  };
}

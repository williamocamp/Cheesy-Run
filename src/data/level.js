// Builds the apartment grid for a floor.
// 0 = floor, 1 = wall. The layout is four rooms around a central cross of
// walls, with doorways punched through so every room is reachable.

import { GRID_W, GRID_H } from '../config.js';

export function buildLevel() {
  const W = GRID_W;
  const H = GRID_H;

  const grid = [];
  for (let y = 0; y < H; y++) {
    grid.push(new Array(W).fill(0));
  }

  // Outer border walls.
  for (let x = 0; x < W; x++) {
    grid[0][x] = 1;
    grid[H - 1][x] = 1;
  }
  for (let y = 0; y < H; y++) {
    grid[y][0] = 1;
    grid[y][W - 1] = 1;
  }

  // Central vertical wall (x = 9), with doorways at y = 4 and y = 8.
  for (let y = 1; y <= H - 2; y++) {
    if (y !== 4 && y !== 8) grid[y][9] = 1;
  }

  // Central horizontal wall (y = 6), with doorways at x = 3 and x = 15.
  for (let x = 1; x <= W - 2; x++) {
    if (x !== 3 && x !== 15) grid[6][x] = 1;
  }

  // Player starts in the top-left living room.
  const spawn = { x: 3, y: 3 };

  return { grid, W, H, spawn };
}

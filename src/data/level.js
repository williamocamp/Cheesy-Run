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

  // Per-room furniture (wall cells) — a distinct interior layout for each of
  // the four rooms. Carefully placed to keep doorways, the spawn, and each
  // human's patrol lane clear.
  const furniture = [
    // Top-left living room: couch + coffee table + plant
    [1, 4], [2, 4], [5, 4], [6, 4], [7, 1],
    // Top-right bedroom: bed + dresser
    [12, 4], [13, 4], [16, 4], [17, 4],
    // Bottom-left storage: shelves + crates
    [1, 8], [2, 8], [5, 8], [6, 8],
    // Bottom-right kitchen: counter island + fridge
    [12, 10], [13, 10], [14, 10], [17, 10],
  ];
  for (const [fx, fy] of furniture) grid[fy][fx] = 1;

  // Player starts in the top-left living room.
  const spawn = { x: 3, y: 3 };

  return { grid, W, H, spawn };
}

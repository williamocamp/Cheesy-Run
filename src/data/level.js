// Builds the apartment grid for a floor.
// 0 = floor, 1 = wall. The layout is four rooms around a central cross of
// walls, with doorways punched through so every room is reachable. The given
// apartment's furniture is then stamped in (skipping any cell that would block
// a doorway, the spawn, or a human patrol lane).

import { GRID_W, GRID_H } from '../config.js';

// Cells that furniture must never occupy: spawn, doorways + their approaches,
// and the four patrol lanes.
function buildForbidden() {
  const set = new Set();
  const add = (x, y) => set.add(`${x},${y}`);
  // spawn + breathing room
  [[3, 3], [2, 3], [4, 3], [3, 2], [3, 4]].forEach(([x, y]) => add(x, y));
  // doorways + approach tiles on each side
  [
    [9, 4], [8, 4], [10, 4],
    [9, 8], [8, 8], [10, 8],
    [3, 6], [3, 5], [3, 7],
    [15, 6], [15, 5], [15, 7],
  ].forEach(([x, y]) => add(x, y));
  // patrol lanes
  for (let x = 12; x <= 17; x++) { add(x, 2); add(x, 8); }
  for (let x = 2; x <= 7; x++) add(x, 10);
  for (let x = 5; x <= 8; x++) add(x, 2);
  return set;
}

export function buildLevel(apartment) {
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

  // Stamp in this apartment's furniture, skipping protected cells. `furniture`
  // maps each placed cell "x,y" to its object type so it gets the right texture.
  const forbidden = buildForbidden();
  const furniture = new Map();
  if (apartment) {
    for (const key of ['LT', 'RT', 'LB', 'RB']) {
      const quad = apartment.quadrants[key];
      if (!quad || !quad.furniture) continue;
      for (const [fx, fy, type] of quad.furniture) {
        if (forbidden.has(`${fx},${fy}`)) continue;
        if (grid[fy] && grid[fy][fx] === 0) {
          grid[fy][fx] = 1;
          furniture.set(`${fx},${fy}`, type || 'crate');
        }
      }
    }
  }

  // Player starts in the top-left living room.
  const spawn = { x: 3, y: 3 };

  // The single-cell gaps between rooms. Traps must never block these.
  const doors = [
    { x: 9, y: 4 },
    { x: 9, y: 8 },
    { x: 3, y: 6 },
    { x: 15, y: 6 },
  ];

  return { grid, W, H, spawn, doors, furniture };
}

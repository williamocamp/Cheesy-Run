// Per-floor difficulty scaling and the human patrol routes.
// Routes are given in TILE coordinates; each route stays inside a single
// room so humans never need to path through doorways.

export const PATROL_ROUTES = [
  // Right-top room
  [{ x: 12, y: 2 }, { x: 17, y: 2 }, { x: 17, y: 4 }, { x: 12, y: 4 }],
  // Left-bottom room
  [{ x: 2, y: 8 }, { x: 7, y: 8 }, { x: 7, y: 10 }, { x: 2, y: 10 }],
  // Right-bottom room (kitchen)
  [{ x: 12, y: 8 }, { x: 17, y: 8 }, { x: 17, y: 10 }, { x: 12, y: 10 }],
  // Left-top room (near spawn — only used on busy floors)
  [{ x: 5, y: 2 }, { x: 7, y: 2 }, { x: 7, y: 4 }, { x: 5, y: 4 }],
];

export function getFloorConfig(floor) {
  return {
    cheese: Math.min(6 + floor * 3, 28),
    traps: Math.min(2 + floor, 12),
    humans: Math.min(floor, 4),
    donuts: 1,
    humanSpeed: 55 + floor * 16,
  };
}

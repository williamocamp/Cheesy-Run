// Per-floor difficulty scaling and the human patrol routes.
// Routes are given in TILE coordinates; each route stays inside a single
// room so humans never need to path through doorways.

// Each route is a clear horizontal lane that dodges that room's furniture, so
// humans pace back and forth (and turn smoothly at each end).
export const PATROL_ROUTES = [
  // Right-top bedroom — lane along row 2
  [{ x: 12, y: 2 }, { x: 17, y: 2 }],
  // Right-bottom kitchen — lane along row 8
  [{ x: 12, y: 8 }, { x: 17, y: 8 }],
  // Left-bottom storage — lane along row 10
  [{ x: 2, y: 10 }, { x: 7, y: 10 }],
  // Left-top living room (near spawn — only used on busy floors)
  [{ x: 5, y: 2 }, { x: 8, y: 2 }],
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

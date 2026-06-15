// Per-floor colour themes. Each floor cycles through these so levels look
// distinct. Bright, cheerful, toy-like palettes: a light background plus each
// room's floor {fill, grid} (grid is a soft deeper shade for tile texture).

export const THEMES = [
  {
    name: 'Sunny Apartment',
    bg: 0xbfe3f2,
    rooms: {
      living: { fill: 0xffd9b3, grid: 0xf0b07e },
      wood: { fill: 0xe8c79a, grid: 0xcba472 },
      bedroom: { fill: 0xd9c2f0, grid: 0xbf9fe0 },
      kitchenA: { fill: 0xc9efd6, grid: 0x9fd9b4 },
      kitchenB: { fill: 0xd9f3e2, grid: 0x9fd9b4 },
      doorway: { fill: 0xf3e6c8, grid: 0xd9c29a },
    },
  },
  {
    name: 'Bubblegum',
    bg: 0xffe0ef,
    rooms: {
      living: { fill: 0xffc2dd, grid: 0xff8ec0 },
      wood: { fill: 0xffd6b0, grid: 0xffb27a },
      bedroom: { fill: 0xe6c8ff, grid: 0xc99cff },
      kitchenA: { fill: 0xc9f0ff, grid: 0x8fd6f0 },
      kitchenB: { fill: 0xd9f5ff, grid: 0x8fd6f0 },
      doorway: { fill: 0xfff0d6, grid: 0xf3d39a },
    },
  },
  {
    name: 'Meadow',
    bg: 0xd7f0c2,
    rooms: {
      living: { fill: 0xbfe8a8, grid: 0x8fcf6f },
      wood: { fill: 0xe8d6a8, grid: 0xc9b06f },
      bedroom: { fill: 0xbfe0e8, grid: 0x8fc7d6 },
      kitchenA: { fill: 0xfff0c2, grid: 0xe6d28f },
      kitchenB: { fill: 0xfff6d6, grid: 0xe6d28f },
      doorway: { fill: 0xe0f0c2, grid: 0xbdd99a },
    },
  },
  {
    name: 'Skyline',
    bg: 0xcdeafe,
    rooms: {
      living: { fill: 0xbfe0ff, grid: 0x8fc4f0 },
      wood: { fill: 0xdfe6f5, grid: 0xb6c2e0 },
      bedroom: { fill: 0xd6c2f5, grid: 0xb398e6 },
      kitchenA: { fill: 0xc2f5ec, grid: 0x8fded0 },
      kitchenB: { fill: 0xd6f7f0, grid: 0x8fded0 },
      doorway: { fill: 0xeef2ff, grid: 0xc6cfe6 },
    },
  },
  {
    name: 'Sorbet',
    bg: 0xffe3c2,
    rooms: {
      living: { fill: 0xffcaa8, grid: 0xff9e6e },
      wood: { fill: 0xffe0a8, grid: 0xffc46e },
      bedroom: { fill: 0xffc2cf, grid: 0xff8fa6 },
      kitchenA: { fill: 0xfff0c2, grid: 0xf3c98f },
      kitchenB: { fill: 0xffe9d6, grid: 0xf3c98f },
      doorway: { fill: 0xfff2dd, grid: 0xf0d2a0 },
    },
  },
];

export function getTheme(floor) {
  return THEMES[(floor - 1) % THEMES.length];
}

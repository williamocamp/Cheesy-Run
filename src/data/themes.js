// Per-floor colour themes. Each floor cycles through these so levels look
// distinct. A theme sets the background plus each room's floor {fill, grid}.

export const THEMES = [
  {
    name: 'Neon Loft',
    bg: 0x070311,
    rooms: {
      living: { fill: 0x190a2e, grid: 0xff2bd6 },
      wood: { fill: 0x0a1430, grid: 0x00e5ff },
      bedroom: { fill: 0x06231d, grid: 0x39ff14 },
      kitchenA: { fill: 0x251139, grid: 0xffd400 },
      kitchenB: { fill: 0x0e2138, grid: 0xffd400 },
      doorway: { fill: 0x130f24, grid: 0x9b5cff },
    },
  },
  {
    name: 'Synthwave Sunset',
    bg: 0x0d0620,
    rooms: {
      living: { fill: 0x2a0f24, grid: 0xff3d81 },
      wood: { fill: 0x2a160a, grid: 0xff8c2b },
      bedroom: { fill: 0x1d0f2e, grid: 0xb86bff },
      kitchenA: { fill: 0x2a1010, grid: 0xffd23d },
      kitchenB: { fill: 0x1d0a1a, grid: 0xffd23d },
      doorway: { fill: 0x180a24, grid: 0xff5db0 },
    },
  },
  {
    name: 'Toxic',
    bg: 0x02100a,
    rooms: {
      living: { fill: 0x07231a, grid: 0x39ff14 },
      wood: { fill: 0x06231f, grid: 0x00ffc8 },
      bedroom: { fill: 0x102610, grid: 0xaaff2b },
      kitchenA: { fill: 0x0a2218, grid: 0x2bffea },
      kitchenB: { fill: 0x0a1f22, grid: 0x2bffea },
      doorway: { fill: 0x081a14, grid: 0x66ff8c },
    },
  },
  {
    name: 'Cryo',
    bg: 0x040a1a,
    rooms: {
      living: { fill: 0x0a1733, grid: 0x37c8ff },
      wood: { fill: 0x0e1430, grid: 0x6f8cff },
      bedroom: { fill: 0x0a2030, grid: 0x2bf0ff },
      kitchenA: { fill: 0x101a33, grid: 0xbfe6ff },
      kitchenB: { fill: 0x0a1428, grid: 0xbfe6ff },
      doorway: { fill: 0x0a1226, grid: 0x8a7bff },
    },
  },
  {
    name: 'Ember',
    bg: 0x120307,
    rooms: {
      living: { fill: 0x2a0712, grid: 0xff3d5e },
      wood: { fill: 0x2a0a07, grid: 0xff7a3d },
      bedroom: { fill: 0x240a1d, grid: 0xff4dbf },
      kitchenA: { fill: 0x2a0f12, grid: 0xffd23d },
      kitchenB: { fill: 0x1d0a0e, grid: 0xffd23d },
      doorway: { fill: 0x1a060f, grid: 0xff6b8c },
    },
  },
];

export function getTheme(floor) {
  return THEMES[(floor - 1) % THEMES.length];
}

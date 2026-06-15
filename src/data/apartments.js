// Each floor of the building is a different tenant's apartment. They share the
// same shell (four rooms + doorways) but differ in room types, colours,
// furniture layout, and furniture tint — so every level feels like a different
// person's home. Floors cycle through this list.
//
// Quadrants: LT = top-left, RT = top-right, LB = bottom-left, RB = bottom-right.
// Furniture is given in tile coords; anything that would block a doorway or a
// patrol lane is skipped automatically (see level.js), and cheese only spawns
// on reachable cells (see GameScene), so layouts are always solvable.

export const APARTMENTS = [
  {
    name: 'The Hendersons',
    bg: 0xe6c9a8,
    hallway: { fill: 0xf3e6c8, grid: 0xd9c29a },
    quadrants: {
      LT: {
        type: 'Living room',
        fill: 0xffd9b3,
        grid: 0xf0b07e,
        furnitureTint: 0xc98a5a,
        furniture: [[1, 1], [1, 3], [1, 4], [4, 4], [5, 4], [6, 1], [7, 1]],
      },
      RT: {
        type: 'Bedroom',
        fill: 0xd9c2f0,
        grid: 0xbf9fe0,
        furnitureTint: 0x9b7fc4,
        furniture: [[16, 3], [17, 3], [16, 4], [17, 4], [14, 4], [11, 1], [12, 1]],
      },
      LB: {
        type: 'Bathroom',
        fill: 0xc9efd6,
        grid: 0x9fd9b4,
        furnitureTint: 0x6fbfd0,
        furniture: [[1, 8], [2, 8], [6, 8], [1, 11]],
      },
      RB: {
        type: 'Kitchen',
        fill: 0xfff0c2,
        grid: 0xe6d28f,
        furnitureTint: 0xcf9a6a,
        furniture: [[12, 10], [13, 10], [14, 10], [17, 7], [17, 10], [11, 7]],
      },
    },
  },
  {
    name: 'Pixel (gamer, 24)',
    bg: 0xbfd0e8,
    hallway: { fill: 0xe6ecf5, grid: 0xc2cde0 },
    quadrants: {
      LT: {
        type: 'Bedroom',
        fill: 0xc8d6f5,
        grid: 0x9fb4e6,
        furnitureTint: 0x6f7fc4,
        furniture: [[1, 4], [2, 4], [5, 1], [6, 1], [7, 1], [5, 3]],
      },
      RT: {
        type: 'Living room',
        fill: 0xffd9c2,
        grid: 0xf0b08e,
        furnitureTint: 0xd07a5a,
        furniture: [[11, 4], [12, 4], [13, 4], [16, 1], [17, 1], [16, 4]],
      },
      LB: {
        type: 'Kitchen',
        fill: 0xfff0c2,
        grid: 0xe6d28f,
        furnitureTint: 0xcf9a6a,
        furniture: [[1, 8], [2, 8], [1, 11], [5, 8], [6, 8]],
      },
      RB: {
        type: 'Bathroom',
        fill: 0xc9efe8,
        grid: 0x9fd9cf,
        furnitureTint: 0x6fbfd0,
        furniture: [[16, 10], [17, 10], [12, 10], [17, 7]],
      },
    },
  },
  {
    name: 'Ms. Vale (minimalist)',
    bg: 0xcdd6e0,
    hallway: { fill: 0xeef1f5, grid: 0xccd3dd },
    quadrants: {
      LT: {
        type: 'Living room',
        fill: 0xe8edf2,
        grid: 0xc6cfd9,
        furnitureTint: 0x9aa2ad,
        furniture: [[1, 4], [2, 4], [7, 1]],
      },
      RT: {
        type: 'Bedroom',
        fill: 0xdfe4ea,
        grid: 0xbcc4ce,
        furnitureTint: 0x8f97a3,
        furniture: [[16, 3], [17, 3], [16, 4], [17, 4]],
      },
      LB: {
        type: 'Bathroom',
        fill: 0xe4eef0,
        grid: 0xbfd2d6,
        furnitureTint: 0x88a0a8,
        furniture: [[1, 8], [6, 11]],
      },
      RB: {
        type: 'Kitchen',
        fill: 0xeef0e8,
        grid: 0xccd0c2,
        furnitureTint: 0x9aa08f,
        furniture: [[12, 10], [13, 10], [17, 7]],
      },
    },
  },
  {
    name: 'The Greenhouse (plant lover)',
    bg: 0xbfe0b0,
    hallway: { fill: 0xdceccb, grid: 0xb6d49a },
    quadrants: {
      LT: {
        type: 'Living room',
        fill: 0xc8e8a8,
        grid: 0x96cf6f,
        furnitureTint: 0x4f9a4a,
        furniture: [[1, 1], [7, 1], [1, 4], [7, 3], [5, 5]],
      },
      RT: {
        type: 'Bedroom',
        fill: 0xbfe0d0,
        grid: 0x8fc7b0,
        furnitureTint: 0x4f9a7a,
        furniture: [[16, 3], [17, 3], [16, 4], [17, 4], [11, 1], [11, 5]],
      },
      LB: {
        type: 'Bathroom',
        fill: 0xc2e8e0,
        grid: 0x8fd0c4,
        furnitureTint: 0x4f9a90,
        furniture: [[1, 8], [2, 8], [1, 11], [6, 11]],
      },
      RB: {
        type: 'Kitchen',
        fill: 0xe0f0b0,
        grid: 0xc2d98f,
        furnitureTint: 0x7a9a4a,
        furniture: [[12, 10], [13, 10], [14, 10], [17, 7], [11, 11]],
      },
    },
  },
  {
    name: 'Chez Gourmet (the chef)',
    bg: 0xf0c89a,
    hallway: { fill: 0xf5e2c2, grid: 0xe0c596 },
    quadrants: {
      LT: {
        type: 'Living room',
        fill: 0xffcaa8,
        grid: 0xff9e6e,
        furnitureTint: 0xd0613a,
        furniture: [[1, 4], [2, 4], [5, 4], [6, 4], [7, 1]],
      },
      RT: {
        type: 'Bedroom',
        fill: 0xffc2cf,
        grid: 0xff8fa6,
        furnitureTint: 0xd05a78,
        furniture: [[16, 3], [17, 3], [16, 4], [17, 4], [11, 1], [12, 1]],
      },
      LB: {
        type: 'Bathroom',
        fill: 0xffd9c2,
        grid: 0xf0b08e,
        furnitureTint: 0xd0915a,
        furniture: [[1, 8], [2, 8], [6, 11]],
      },
      RB: {
        type: 'Kitchen',
        fill: 0xffe0a8,
        grid: 0xffc46e,
        furnitureTint: 0xc46a2a,
        furniture: [[12, 10], [13, 10], [14, 10], [17, 10], [17, 7], [12, 7], [13, 7], [11, 9]],
      },
    },
  },
];

export function getApartment(floor) {
  return APARTMENTS[(floor - 1) % APARTMENTS.length];
}

// Each floor of the building is a different tenant's apartment. They share the
// same shell (four rooms + doorways) but differ in room types, colours, and
// furniture — so every level feels like a different person's home. Floors
// cycle through this list.
//
// Quadrants: LT = top-left, RT = top-right, LB = bottom-left, RB = bottom-right.
// Furniture entries are [x, y, type]; each type has its own textured iso block
// (see BootScene). Anything that would block a doorway or a patrol lane is
// skipped automatically (level.js), and cheese only spawns on reachable cells
// (GameScene), so layouts are always solvable.

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
        furniture: [[1, 4, 'couch'], [5, 4, 'table'], [6, 1, 'tv'], [7, 1, 'lamp'], [1, 1, 'plant']],
      },
      RT: {
        type: 'Bedroom',
        fill: 0xd9c2f0,
        grid: 0xbf9fe0,
        furniture: [[17, 4, 'bed'], [16, 4, 'nightstand'], [11, 1, 'dresser'], [12, 1, 'wardrobe']],
      },
      LB: {
        type: 'Bathroom',
        fill: 0xc9efd6,
        grid: 0x9fd9b4,
        furniture: [[1, 8, 'bathtub'], [2, 8, 'toilet'], [6, 8, 'sink'], [1, 11, 'plant']],
      },
      RB: {
        type: 'Kitchen',
        fill: 0xfff0c2,
        grid: 0xe6d28f,
        furniture: [[17, 7, 'fridge'], [17, 10, 'oven'], [12, 10, 'counter'], [13, 10, 'counter'], [11, 7, 'table']],
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
        furniture: [[1, 4, 'bed'], [2, 4, 'nightstand'], [5, 1, 'table'], [6, 1, 'tv'], [7, 1, 'lamp'], [5, 3, 'bookshelf']],
      },
      RT: {
        type: 'Living room',
        fill: 0xffd9c2,
        grid: 0xf0b08e,
        furniture: [[11, 4, 'couch'], [12, 4, 'couch'], [16, 1, 'tv'], [17, 1, 'lamp'], [16, 4, 'table']],
      },
      LB: {
        type: 'Kitchen',
        fill: 0xfff0c2,
        grid: 0xe6d28f,
        furniture: [[1, 8, 'fridge'], [2, 8, 'oven'], [5, 8, 'counter'], [6, 8, 'counter'], [1, 11, 'sink']],
      },
      RB: {
        type: 'Bathroom',
        fill: 0xc9efe8,
        grid: 0x9fd9cf,
        furniture: [[16, 10, 'bathtub'], [17, 10, 'toilet'], [12, 10, 'sink'], [17, 7, 'plant']],
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
        furniture: [[1, 4, 'couch'], [7, 1, 'plant']],
      },
      RT: {
        type: 'Bedroom',
        fill: 0xdfe4ea,
        grid: 0xbcc4ce,
        furniture: [[17, 3, 'bed'], [11, 1, 'lamp']],
      },
      LB: {
        type: 'Bathroom',
        fill: 0xe4eef0,
        grid: 0xbfd2d6,
        furniture: [[1, 8, 'toilet'], [6, 11, 'sink']],
      },
      RB: {
        type: 'Kitchen',
        fill: 0xeef0e8,
        grid: 0xccd0c2,
        furniture: [[12, 10, 'counter'], [17, 7, 'fridge']],
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
        furniture: [[1, 4, 'couch'], [1, 1, 'plant'], [7, 1, 'plant'], [7, 3, 'plant'], [5, 5, 'lamp']],
      },
      RT: {
        type: 'Bedroom',
        fill: 0xbfe0d0,
        grid: 0x8fc7b0,
        furniture: [[17, 4, 'bed'], [16, 4, 'nightstand'], [11, 1, 'plant'], [11, 5, 'plant']],
      },
      LB: {
        type: 'Bathroom',
        fill: 0xc2e8e0,
        grid: 0x8fd0c4,
        furniture: [[1, 8, 'bathtub'], [2, 8, 'toilet'], [1, 11, 'plant'], [6, 11, 'plant']],
      },
      RB: {
        type: 'Kitchen',
        fill: 0xe0f0b0,
        grid: 0xc2d98f,
        furniture: [[12, 10, 'counter'], [13, 10, 'counter'], [17, 7, 'fridge'], [11, 11, 'plant'], [14, 10, 'table']],
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
        furniture: [[1, 4, 'couch'], [5, 4, 'table'], [6, 4, 'bookshelf'], [7, 1, 'lamp']],
      },
      RT: {
        type: 'Bedroom',
        fill: 0xffc2cf,
        grid: 0xff8fa6,
        furniture: [[17, 4, 'bed'], [16, 4, 'nightstand'], [11, 1, 'wardrobe'], [12, 1, 'dresser']],
      },
      LB: {
        type: 'Bathroom',
        fill: 0xffd9c2,
        grid: 0xf0b08e,
        furniture: [[1, 8, 'bathtub'], [2, 8, 'toilet'], [6, 11, 'sink']],
      },
      RB: {
        type: 'Kitchen',
        fill: 0xffe0a8,
        grid: 0xffc46e,
        furniture: [
          [17, 7, 'fridge'], [17, 10, 'oven'], [12, 10, 'counter'], [13, 10, 'counter'],
          [14, 10, 'counter'], [12, 7, 'table'], [13, 7, 'sink'], [11, 9, 'counter'],
        ],
      },
    },
  },
];

export function getApartment(floor) {
  return APARTMENTS[(floor - 1) % APARTMENTS.length];
}

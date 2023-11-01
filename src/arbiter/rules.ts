export const rules = {
  rook: {
    range: 7,
    directions: [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ],
  },
  knight: {
    range: 1,
    directions: [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ],
  },
  bishop: {
    range: 7,
    directions: [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ],
  },
  queen: {
    range: 7,
    directions: [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ],
  },
  king: {
    range: 1,
    directions: [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ],
  },
  pawn: {
    range: 1,
    directions: [
      [1, 0],
      [1, -1],
      [1, 1],
    ],
  },
};

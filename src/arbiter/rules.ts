const getPieceRules = (piece: string) => {
  switch (piece) {
    case "r":
      return rules.rook
    case "R":
      return rules.rook
    case "n":
      return rules.knight
    case "N":
      return rules.knight
    case "b":
      return rules.bishop
    case "B":
      return rules.bishop
    case "q":
      return rules.queen
    case "Q":
      return rules.queen
    case "k":
      return rules.king
    case "K":
      return rules.king
  }
  return { range: 0, directions: [] }
}

const rules = {
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
}

export { getPieceRules }
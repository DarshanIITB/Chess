import { rules } from "./rules"
import {
  checkBounds,
  getFileChar,
  getPieceColor,
  getSquareIndices,
  isKingInCheck,
  dedupMoves,
  isSquareAttacked,
} from "../utils/UtililtyFns"
import { PieceType, Player } from "../utils/UtililtyFns"

export function getMoves(
  position: string[][],
  rank: number,
  file: number,
  enPassantTarget: string,
  castlingAvailability: string
) {
  const piece = position[rank][file]
  if (piece === "") return []
  //   if (isPiecePinned(position, rank, file, enPassantTarget, castlingAvailability)) return []
  if (piece === PieceType.WHITE_PAWN || piece === PieceType.BLACK_PAWN)
    return getPawnMoves(position, rank, file, enPassantTarget)
  else if (piece === PieceType.WHITE_KING || piece === PieceType.BLACK_KING)
    return getKingMoves(position, rank, file, castlingAvailability)
  return getPieceMoves(position, rank, file)
}

export function getKingMoves(
  position: string[][],
  rank: number,
  file: number,
  castlingAvailability: string
) {
  const allowedMoves = []
  const pieceRules = getPieceRules(position[rank][file])
  const directions = pieceRules.directions
  const attackingPlayer =
    getPieceColor(position[rank][file]) === Player.WHITE
      ? Player.BLACK
      : Player.WHITE
  for (const direction of directions) {
    const newRank = rank + direction[0]
    const newFile = file + direction[1]
    if (
      checkBounds(newRank, newFile) &&
      !isSquareAttacked(position, [newRank, newFile], attackingPlayer) &&
      position[newRank][newFile] === ""
    ) {
      allowedMoves.push([newRank, newFile])
    }
  }
  allowedMoves.push(
    ...getCastlingMoves(position, rank, file, castlingAvailability)
  )
  return allowedMoves
}

export function getAttackedSquares(
  position: string[][],
  attackingPlayer: string
) {
  let attackedSquares: number[][] = []
  attackedSquares.push(...getPawnAttacks(position, attackingPlayer))
  attackedSquares.push(...getPieceAttacks(position, attackingPlayer))
  attackedSquares = dedupMoves(attackedSquares)
  return attackedSquares
}

const getPawnAttackedSquares = (
  attackingPlayer: string,
  rank: number,
  file: number
) => {
  const direction = attackingPlayer === Player.WHITE ? -1 : 1
  const diagSq = [
    [rank + direction, file - 1],
    [rank + direction, file + 1],
  ].filter((sq) => checkBounds(sq[0], sq[1]))
  return diagSq
}

export function getPawnAttacks(position: string[][], attackingPlayer: string) {
  const attackedSquares: number[][] = []
  position.map((row, rank) => {
    row.map((piece, file) => {
      if (attackingPlayer === Player.WHITE && piece === PieceType.WHITE_PAWN) {
        attackedSquares.push(
          ...getPawnAttackedSquares(attackingPlayer, rank, file)
        )
      } else if (
        attackingPlayer === Player.BLACK &&
        piece === PieceType.BLACK_PAWN
      ) {
        attackedSquares.push(
          ...getPawnAttackedSquares(attackingPlayer, rank, file)
        )
      }
    })
  })
  return attackedSquares
}

export function getPawnMoves(
  position: string[][],
  rank: number,
  file: number,
  enPassantTarget: string
) {
  const color = getPieceColor(position[rank][file])
  const allowedMoves: number[][] = []
  const direction = color === Player.WHITE ? -1 : 1
  // move forward 1 square
  if (position[rank + direction][file] === "") {
    allowedMoves.push([rank + direction, file])
  }
  // push forward 2 squares for the first move
  if (
    (color === Player.WHITE && rank === 6) ||
    (color === Player.BLACK && rank === 1)
  ) {
    if (
      position[rank + direction][file] === "" &&
      position[rank + direction * 2][file] === ""
    ) {
      allowedMoves.push([rank + direction * 2, file])
    }
  }
  // take diagonally
  const diagSq = [
    [rank + direction, file - 1],
    [rank + direction, file + 1],
  ].filter((sq) => checkBounds(sq[0], sq[1]))

  diagSq.forEach((square) => {
    if (
      position[square[0]][square[1]] !== "" &&
      getPieceColor(position[square[0]][square[1]]) !== color
    ) {
      allowedMoves.push([square[0], square[1]])
    }
  })

  // en passant
  if (enPassantTarget !== "-") {
    const [enPassantRank, enPassantFile] = getSquareIndices(enPassantTarget)
    diagSq.forEach((square) => {
      if (enPassantFile === square[1] && enPassantRank === square[0]) {
        allowedMoves.push([enPassantRank, enPassantFile])
      }
    })
  }
  return allowedMoves
}

// get all the squares attacked by pieces
export function getPieceAttacks(position: string[][], attackingPlayer: string) {
  const attackedSquares: number[][] = []
  position.map((row, rank) => {
    row.map((piece, file) => {
      if (
        piece !== "" &&
        piece !== PieceType.BLACK_KING &&
        piece !== PieceType.WHITE_KING &&
        piece !== PieceType.BLACK_PAWN &&
        piece !== PieceType.WHITE_PAWN &&
        getPieceColor(piece) === attackingPlayer
      ) {
        attackedSquares.push(...getPieceAttacksFromSquare(position, rank, file))
      }
    })
  })
  return dedupMoves(attackedSquares)
}

function getPieceAttacksFromSquare(
  position: string[][],
  rank: number,
  file: number
) {
  const piece = position[rank][file]
  if (piece === "") return []
  const pieceRules = getPieceRules(piece)
  const [range, directions] = [pieceRules.range, pieceRules.directions]
  const attackedSquares: number[][] = []
  for (const direction of directions) {
    for (let dist = 1; dist <= range; dist++) {
      const newRank = rank + direction[0] * dist
      const newFile = file + direction[1] * dist
      if (!checkBounds(newRank, newFile)) break
      attackedSquares.push([newRank, newFile])
      if (position[newRank][newFile] !== "") {
        break
      }
    }
  }
  return attackedSquares
}

export function getPieceMoves(
  position: string[][],
  rank: number,
  file: number
) {
  const piece = position[rank][file]
  const color = getPieceColor(piece)
  const pieceRules = getPieceRules(piece)
  const [range, directions] = [pieceRules.range, pieceRules.directions]
  const allowedMoves: number[][] = []
  for (const direction of directions) {
    for (let dist = 1; dist <= range; dist++) {
      const newRank = rank + direction[0] * dist
      const newFile = file + direction[1] * dist
      if (!checkBounds(newRank, newFile)) break
      if (position[newRank][newFile] !== "") {
        const interferingPiece = position[newRank][newFile]
        if (color !== getPieceColor(interferingPiece)) {
          allowedMoves.push([newRank, newFile])
        }
        break
      } else {
        allowedMoves.push([newRank, newFile])
      }
    }
  }
  return allowedMoves
}

const castlingSquares = {
  k: [
    [0, 5],
    [0, 6],
  ],
  q: [
    [0, 3],
    [0, 2],
  ],
  K: [
    [7, 5],
    [7, 6],
  ],
  Q: [
    [7, 3],
    [7, 2],
  ],
}

const checkCastlingDirection = (
  position: string[][],
  castlingAvailability: string,
  castlingDirection: string,
  color: string
) => {
  console.log("Checking castling direction: ", castlingDirection)
  const attackingPlayer = color === Player.WHITE ? Player.BLACK : Player.WHITE
  const squares: number[][] =
    castlingSquares[castlingDirection as keyof typeof castlingSquares]
  for (const square of squares) {
    if (
      position[square[0]][square[1]] !== "" ||
      isSquareAttacked(position, square, attackingPlayer)
    )
      return false
  }
  return true
}

const getCastlingMoves = (
  position: string[][],
  rank: number,
  file: number,
  castlingAvailability: string
) => {
  if (!castlingAvailability || castlingAvailability === "") return []
  const allowedMoves: number[][] = []
  const color = getPieceColor(position[rank][file])
  const castlingDirections = castlingAvailability.split("")
  if (color === Player.WHITE) {
    if (
      castlingDirections.includes("K") &&
      checkCastlingDirection(position, castlingAvailability, "K", color)
    ) {
      allowedMoves.push([7, 6])
    }
    if (
      castlingDirections.includes("Q") &&
      checkCastlingDirection(position, castlingAvailability, "Q", color)
    ) {
      allowedMoves.push([7, 2])
    }
  } else {
    if (
      castlingDirections.includes("k") &&
      checkCastlingDirection(position, castlingAvailability, "k", color)
    ) {
      allowedMoves.push([0, 6])
    }
    if (
      castlingDirections.includes("q") &&
      checkCastlingDirection(position, castlingAvailability, "q", color)
    ) {
      allowedMoves.push([0, 2])
    }
  }
  return allowedMoves
}

export function isPiecePinned(
  position: string[][],
  rank: number,
  file: number
) {
  let altPosition = JSON.parse(JSON.stringify(position))
  altPosition[rank][file] = ""
  if (isKingInCheck(altPosition, getPieceColor(position[rank][file]))) {
    return true
  }
  return false
}

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

const piecePrefix = {
  rook: "R",
  knight: "N",
  bishop: "B",
  queen: "Q",
  king: "K",
  pawn: "",
}

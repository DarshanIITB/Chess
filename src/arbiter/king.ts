import { getPieceColor, isSquareAttacked , checkBounds } from "../utils/UtililtyFns"
import { Player } from "../utils/UtililtyFns"
import { getPieceRules } from "./rules"


const getKingMoves = (
  position: string[][],
  rank: number,
  file: number,
  castlingAvailability: string
) => {
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
      checkCastlingDirection(position, "K", color)
    ) {
      allowedMoves.push([7, 6])
    }
    if (
      castlingDirections.includes("Q") &&
      checkCastlingDirection(position, "Q", color)
    ) {
      allowedMoves.push([7, 2])
    }
  } else {
    if (
      castlingDirections.includes("k") &&
      checkCastlingDirection(position, "k", color)
    ) {
      allowedMoves.push([0, 6])
    }
    if (
      castlingDirections.includes("q") &&
      checkCastlingDirection(position, "q", color)
    ) {
      allowedMoves.push([0, 2])
    }
  }
  return allowedMoves
}

const checkCastlingDirection = (
  position: string[][],
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

export { getKingMoves }

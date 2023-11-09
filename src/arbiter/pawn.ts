import {
  getPieceColor,
  checkBounds,
  getSquareIndices,
  isMoveValid,
} from "../utils/UtililtyFns"
import { Player, PieceType } from "../utils/UtililtyFns"

const getPawnMoves = (
  position: string[][],
  rank: number,
  file: number,
  enPassantTarget: string
) => {
  const color = getPieceColor(position[rank][file])
  const allowedMoves: number[][] = []
  const direction = color === Player.WHITE ? -1 : 1
  // move forward 1 square
  if (
    position[rank + direction][file] === "" &&
    isMoveValid(position, color, rank, file, rank + direction, file)
  ) {
    allowedMoves.push([rank + direction, file])
  }
  // push forward 2 squares for the first move
  if (
    (color === Player.WHITE && rank === 6) ||
    (color === Player.BLACK && rank === 1)
  ) {
    if (
      position[rank + direction][file] === "" &&
      position[rank + direction * 2][file] === "" &&
      isMoveValid(position, color, rank, file, rank + 2 * direction, file)
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
      getPieceColor(position[square[0]][square[1]]) !== color &&
      isMoveValid(position, color, rank, file, square[0], square[1])
    ) {
      allowedMoves.push([square[0], square[1]])
    }
  })

  // en passant
  if (enPassantTarget !== "-") {
    const [enPassantRank, enPassantFile] = getSquareIndices(enPassantTarget)
    diagSq.forEach((square) => {
      if (
        enPassantFile === square[1] &&
        enPassantRank === square[0] &&
        isMoveValid(position, color, rank, file, enPassantRank, enPassantFile)
      ) {
        allowedMoves.push([enPassantRank, enPassantFile])
      }
    })
  }
  return allowedMoves
}

const getPawnAttacks = (position: string[][], attackingPlayer: string) => {
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

export { getPawnMoves, getPawnAttacks }

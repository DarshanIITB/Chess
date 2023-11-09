import {
  checkBounds,
  getPieceColor,
  isKingInCheck,
  dedupMoves,
  isMoveValid,
} from "../utils/UtililtyFns"
import { PieceType, Player } from "../utils/UtililtyFns"
import { getPawnMoves, getPawnAttacks } from "./pawn"
import { getKingMoves } from "./king"
import { getPieceRules } from "./rules"

export function getMoves(
  position: string[][],
  rank: number,
  file: number,
  enPassantTarget: string,
  castlingAvailability: string
) {
  const piece = position[rank][file]
  if (piece === "") return []
  if (piece === PieceType.WHITE_PAWN || piece === PieceType.BLACK_PAWN)
    return getPawnMoves(position, rank, file, enPassantTarget)
  else if (piece === PieceType.WHITE_KING || piece === PieceType.BLACK_KING)
    return getKingMoves(position, rank, file, castlingAvailability)
  return getPieceMoves(position, rank, file)
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
  console.log('color: ', color)
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
        if (color !== getPieceColor(interferingPiece) && isMoveValid(position, color, rank, file, newRank, newFile)) {
          allowedMoves.push([newRank, newFile])
        }
        break
      } else if (isMoveValid(position, color, rank, file, newRank, newFile)) {
        allowedMoves.push([newRank, newFile])
      }
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

const piecePrefix = {
  rook: "R",
  knight: "N",
  bishop: "B",
  queen: "Q",
  king: "K",
  pawn: "",
}

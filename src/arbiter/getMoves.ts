import { rules } from "./rules"
import {
  checkBounds,
  getFileChar,
  getPieceColor,
  getSquareIndices,
} from "../utils/UtililtyFns"

export function getMoves(position: string[][], rank: number, file: number) {
  const piece = position[rank][file]
  if (piece === "") return []
  if (piece === "p" || piece === "P")
    return getPawnMoves(position, rank, file, "-")
  return getPieceMoves(position, rank, file)
}

export function getPawnMoves(
  position: string[][],
  rank: number,
  file: number,
  enPassantTarget: string
) {
  const color = getPieceColor(position[rank][file])
  const allowedMoves: number[][] = []
  const direction = color === "w" ? -1 : 1
  // move forward 1 square
  if (position[rank + direction][file] === "") {
    allowedMoves.push([rank + direction, file])
  }
  // push forward 2 squares for the first move
  if ((color === "w" && rank === 6) || (color === "b" && rank === 1)) {
    if (
      position[rank + direction][file] === "" &&
      position[rank + (direction * 2)][file] === ""
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
    const [enPassantFile, enPassantRank] = getSquareIndices(enPassantTarget)
    diagSq.forEach((square) => {
      if (enPassantFile === square[1] && enPassantRank === square[0]) {
        allowedMoves.push([enPassantRank, enPassantFile])
      }
    })
  }
  return allowedMoves
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
      if (newRank < 0 || newRank > 7 || newFile < 0 || newFile > 7) break
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
  if(piece === 'k' || piece === 'K') {
    allowedMoves.push(...getCastlingMoves(position, rank, file, 'KQkq'))
  }
  return allowedMoves
}

const castlingSquares = {
    k: [[0, 5], [0, 6]],
    q: [[0, 3], [0, 2], [0, 1]],
    K: [[7, 5], [7, 6]],
    Q: [[7, 3], [7, 2], [7, 1]]
}

const checkCastlingDirection = (position: string[][], rank: number, file: number, castlingAvailability: string, castlingDirection: string, color: string) => {
    const squares: number[][] = castlingSquares[castlingDirection as keyof typeof castlingSquares]
    let canCastle = true
    squares.forEach(square => {
        if(position[square[0]][square[1]] !== '') {
            canCastle = false
        }
    })
    return canCastle
}

const getCastlingMoves = (position: string[][], rank: number, file: number, castlingAvailability: string) => {
    const allowedMoves: number[][] = []
    const color = getPieceColor(position[rank][file])
    const castlingDirections = castlingAvailability.split('')
    if(color === 'w') {
        if(castlingDirections.includes('K') && checkCastlingDirection(position, rank, file, castlingAvailability, 'K', color)) {
            allowedMoves.push([7, 6])
        }
        if(castlingDirections.includes('Q') && checkCastlingDirection(position, rank, file, castlingAvailability, 'Q', color)) {
            allowedMoves.push([7, 2])
        }
    } else {
        if(castlingDirections.includes('k') && checkCastlingDirection(position, rank, file, castlingAvailability, 'k', color)) {
            allowedMoves.push([0, 6])
        }
        if(castlingDirections.includes('q') && checkCastlingDirection(position, rank, file, castlingAvailability, 'q', color)) {
            allowedMoves.push([0, 2])
        }
    }
    return allowedMoves
}

const isPiecePinned = (position: string[][], rank: number, file: number) => {
    
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
    case "p":
      return rules.pawn
    case "P":
      return rules.pawn
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

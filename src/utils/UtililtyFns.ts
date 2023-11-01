import { getMoves } from "../arbiter/getMoves"

export enum Piece {
  PAWN = 'p',
  ROOK = 'r',
  KNIGHT = 'n',
  BISHOP = 'b',
  QUEEN = 'q',
  KING = 'k',
}

export enum PieceColor {
  WHITE = 'w',
  BLACK = 'b',
}

export function getPieceColor(piece: string) {
  return piece.charCodeAt(0) < 97 ? 'w' : 'b'
}

export function getFileChar(file: number) {
  // ... return the alphabetical charecter for a file
  return String.fromCharCode(97 + file)
}

export function getSquareIndices(square: string) {
  return [8 - parseInt(square[1]), square.charCodeAt(0) - 97]
}

export function checkBounds(rank: number, file: number) {
  return rank >= 0 && rank <= 7 && file >= 0 && file <= 7
}

export function parseFEN(fen: string) {
  // ... parse the FEN string and return a board object
  let [board, turn, castlingAvailability, enPassant, halfMove, fullMove] = fen.split(" ")
  enPassant = enPassant || '-'
  const boardArray = board.split("/")
  const position = []
  for (let i = 0; i < 8; i++) {
    const row = []
    for (let j = 0; j < boardArray[i].length; j++) {
      if (boardArray[i][j].charCodeAt(0) >= 49 && boardArray[i][j].charCodeAt(0) <= 57) {
        const n = parseInt(boardArray[i][j])
        row.push(...Array(n).fill(''))
      } else {
        row.push(boardArray[i][j])
      }
    }
    position.push(row)
  }
  // const castlingAvailability = getCastlingAvailability(castling)
  return { position, turn, castlingAvailability, enPassant, halfMove, fullMove }
}

export const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export function getPosition (moveHistory: string[]) {
  // ... return the position after all the moves in moveHistory
  
}

export function extendPosition (move: string, position: string[][], turn: string, castlingAvailability: number, enPassant: string, halfMove: number, fullMove: number) {
  // ... return the position after the move is played
  const isCheckMate = move[move.length - 1] === '#'
  const isCheck = move[move.length - 1] === '+'
  if(move === 'O-O') {
    return []
  }
  if(isCheckMate || isCheck) {
    isCheckMate ? console.log('Checkmate') : console.log('Check')
    move = move.slice(0, -1)
  }
  const isPromotion = move[move.length - 2] === '='
  if(isPromotion) {
    const promotedPiece = move[move.length - 1]
    console.log(`Promoted to ${promotedPiece}`)
    move = move.slice(0, -2)
  }
  if(move[0].charCodeAt(0) >= 97 && move[0].charCodeAt(0) <= 104) {
    // pawn move

  } else {
    // piece move
  }
  console.log('Move: ', move)
}

const handlePawnMove = (move: string, position: string[][]) => {

}

export function checkValidity(finalSquare: number[], moves: number[][], isKingMove: boolean) {
  // ... return true if finalSquare is in moves
  return moves.some(move => move[0] === finalSquare[0] && move[1] === finalSquare[1])
}

const getTotalMoves = (position: string[][], turn: string) => {
  let moves: number[][] = []
  position.forEach((r, rank) => r.forEach((f, file) => {
      if(f !== '') {
          moves.push(...getMoves(position, rank, file))
      }
  }))
  return moves
}
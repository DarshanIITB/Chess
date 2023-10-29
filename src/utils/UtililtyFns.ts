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
  console.log(piece)
  return piece.charCodeAt(0) < 97 ? 'white' : 'black'
}

export function getFileChar(file: number) {
  // ... return the alphabetical charecter for a file
  return String.fromCharCode(96 + file)
}

export function parseFEN(fen: string) {
  // ... parse the FEN string and return a board object
  const [board, turn, castling, enPassant, halfMove, fullMove] = fen.split(" ")
  const boardArray = board.split("/")
  const position = []
  for (let i = 0; i < 8; i++) {
    const row = []
    for (let j = 0; j < boardArray[i].length; j++) {
      if (boardArray[i][j].charCodeAt(0) >= 49 && boardArray[i][j].charCodeAt(0) <= 57) {
        const n = parseInt(boardArray[i][j])
        row.push(...Array(n).fill(null))
      } else {
        row.push(boardArray[i][j])
      }
    }
    position.push(row)
  }
  const castlingAvailability = getCastlingAvailability(castling)
  console.log('Position', position)
  return { position, turn, castlingAvailability, enPassant, halfMove, fullMove }
}

const getCastlingAvailability = (castling: string) => {
  let castlingAvailability = 0
  if(castling.search('K') !== -1) {
    castlingAvailability += 1
  }
  if(castling.search('Q') !== -1) {
    castlingAvailability += 2
  }
  if(castling.search('k') !== -1) {
    castlingAvailability += 4
  }
  if(castling.search('q') !== -1) {
    castlingAvailability += 8
  }
  return castlingAvailability
}

export const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export function getPosition (moveHistory: string[]) {
  // ... return the position after all the moves in moveHistory
  
}

export function extendPosition (move: string[], position: string[][]) {
  // ... return the position after the move is played
  const pieceType: string = move[0]
  if(move[1] === 'x') {
    const file: number = move[2].charCodeAt(0) - 97
    const rank: number = parseInt(move[3]) - 1
  } else {
    const file: number = move[1].charCodeAt(0) - 97
    const rank: number = parseInt(move[2]) - 1
    position[rank][file] = pieceType
  }
}
import { rules } from "./rules"
import { getFileChar, getPieceColor } from "../utils/UtililtyFns"

export function getPieceMoves(position: string[][], piece: string, color: string, rank: number, file: number) {
    const pieceRules = getPieceRules(piece)
    const [range, directions] = [pieceRules.range, pieceRules.directions]
    const allowedMoves: string[] = []
    for (const direction of directions) {
    for (let dist = 1; dist <= range; dist++) {
            const newRank = rank + direction[0] * dist
            const newFile = file + direction[1] * dist
            if(newRank < 0 || newRank > 7 || newFile < 0 || newFile > 7) break;
            if (position[newRank][newFile] !== '') {
                const interferingPiece = position[newRank][newFile]
                if (color !== getPieceColor(interferingPiece)) 
                    allowedMoves.push(`Rx${getFileChar(file)}${rank+1}`)
                break;
            } else {
                allowedMoves.push(`R${getFileChar(file)}${rank+1}`)
            }
        }
    }
    return allowedMoves
}

const getPieceRules = (piece: string) => {
    switch (piece) {
        case 'r' || 'R': return rules.rook
        case 'n' || 'N': return rules.knight
        case 'b' || 'B': return rules.bishop
        case 'q' || 'Q': return rules.queen
        case 'k' || 'K': return rules.king
        case 'p' || 'P': return rules.pawn
    }
    return { range: 0, directions: []}
}

const piecePrefix = {
    'rook': 'R',
    'knight': 'N',
    'bishop': 'B',
    'queen': 'Q',
    'king': 'K',
    'pawn': ''
}
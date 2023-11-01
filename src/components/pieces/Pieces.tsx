import React, { useState, useRef } from 'react'
import Piece from './Piece'
import './Pieces.css'
import { getPieceMoves, getMoves } from '../../arbiter/getMoves'
import { checkValidity, extendPosition, getFileChar, getPieceColor, parseFEN, startingFEN } from '../../utils/UtililtyFns'

const Pieces = () => {
    const ref = useRef<HTMLDivElement>(null)
    const puzzleFEN = 'r5rk/5p1p/5R2/4B3/8/8/7P/7K w'
    const puzzlePosition = parseFEN(puzzleFEN).position
    const gameStatus = parseFEN(startingFEN)
    const [turn, setTurn] = useState<string>(gameStatus.turn)
    const [castling, setCastling] = useState<string>(gameStatus.castlingAvailability)
    const [enPassantTarget, setEnPassantTarget] = useState<string>(gameStatus.enPassant)
    const [halfMove, setHalfMove] = useState<number>(parseInt(gameStatus.halfMove))
    const [fullMove, setFullMove] = useState<number>(parseInt(gameStatus.fullMove))
    const castlingPositionFEN = 'rnbqk2r/ppp2ppp/3bpn2/3p4/3P4/2N1B3/PPPQPPPP/R3KBNR w KQkq - 0 1'
    const [position, setPosition] = useState<string[][]>(
        // parseFEN(startingFEN).position
        // puzzlePosition
        parseFEN(castlingPositionFEN).position
    )

    const getFinalSquare = (e: React.DragEvent) => {
        const {width, height, left, top} = ref.current!.getBoundingClientRect()
        const size = width / 8
        const file = Math.floor((e.clientX - left) / size)
        const rank = Math.floor((e.clientY - top) / size)
        return [rank, file]
    }

    const handleCastling = (piece: string, originalRank: number, originalFile: number, finalRank: number, finalFile: number) => {
        let newPosition = position.slice()
        if(piece === 'k') {
            if(finalFile === 6) {
                // black king side castling
                newPosition[originalRank][originalFile] = ''
                newPosition[0][6] = 'k'
                newPosition[0][5] = 'r'
                newPosition[0][7] = ''
            } else if (finalFile === 2) {
                // black queen side castling
                newPosition[originalRank][originalFile] = ''
                newPosition[0][2] = 'k'
                newPosition[0][3] = 'r'
                newPosition[0][0] = ''
            }
            setPosition(newPosition)
        } else if (piece === 'K') {
            if(finalFile === 6) {
                // white king side castling
                newPosition[originalRank][originalFile] = ''
                newPosition[7][6] = 'K'
                newPosition[7][5] = 'R'
                newPosition[7][7] = ''
            } else if (finalFile === 2) {
                // white queen side castling
                newPosition[originalRank][originalFile] = ''
                newPosition[7][2] = 'K'
                newPosition[7][3] = 'R'
                newPosition[7][0] = ''
            }
            setPosition(newPosition)
        }
    }

    const handleNormalMoves = (piece: string, originalRank: number, originalFile: number, finalRank: number, finalFile: number) => {
        let newPosition = position.slice()
        newPosition[originalRank][originalFile] = ''
        newPosition[finalRank][finalFile] = piece
        setPosition(newPosition)
    }

    const updatePosition = (piece: string, originalRank: number, originalFile: number, finalRank: number, finalFile: number) => {
        console.log('Original rank: ' + originalRank, 'Original file: ' + originalFile, 'Final rank: ' + finalRank, 'Final file: ' + finalFile)
        let newPosition = position.slice()
        // handle castling
        if((piece === 'k' || piece === 'K') && Math.abs(originalFile - finalFile) === 2) {
            handleCastling(piece, originalRank, originalFile, finalRank, finalFile)
        }
        // handle normal moves
        else {
            handleNormalMoves(piece, originalRank, originalFile, finalRank, finalFile)
        }
        if(turn === 'b') {
            setFullMove(fullMove + 1)
        }
        setTurn(turn === 'w' ? 'b' : 'w')
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const[piece, originalRank, originalFile] = e.dataTransfer.getData('text/plain').split('-')
        const [originalRankInt, originalFileInt] = [parseInt(originalRank), parseInt(originalFile)]
        const availableMoves = getMoves(position, originalRankInt, originalFileInt)
        const finalSquare = getFinalSquare(e)
        const [rank, file] = finalSquare
        const isKingMove = piece === 'K' || piece === 'k'
        console.log(finalSquare)
        console.log(availableMoves)
        if(getPieceColor(position[originalRankInt][originalFileInt]) === turn &&
        checkValidity(finalSquare, availableMoves, isKingMove)) {
            console.log('Valid move')
            updatePosition(piece, originalRankInt, originalFileInt, rank, file)
        }
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    return (
        <div 
        ref={ref}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="pieces">
            {position.map((r, rank) => 
                r.map((f, file) => 
                    position[rank][file] ?
                    <Piece key={`${rank}-${file}`} rank={7-rank} file={file} piece={position[rank][file]} />
                    : null
                )
            )}
        </div>
    )
}

export default Pieces
import React, { useState, useRef } from 'react'
import Piece from './Piece'
import './Pieces.css'
import { getPieceMoves, getMoves, isPiecePinned, getPawnAttacks, getAttackedSquares, getKingMoves, getPieceAttacks } from '../../arbiter/getMoves'
import { checkValidity, extendPosition, getFileChar, getPieceColor, getRankChar, parseFEN, startingFEN } from '../../utils/UtililtyFns'
import { PieceType, Player, isSquareAttacked, getTotalMoves } from '../../utils/UtililtyFns'

const Pieces = () => {
    const ref = useRef<HTMLDivElement>(null)
    const puzzleFEN = 'r5rk/5p1p/5R2/4B3/8/8/7P/7K w'
    const castlingPositionFEN = 'rnbqk2r/ppp2ppp/3bpn2/3p4/3P4/2N1B3/PPPQPPPP/R3KBNR w KQkq - 0 1'
    const pinnedRookFEN = '2k5/3r4/8/8/8/7B/8/6K1 w'
    const enPassantFEN = '2k5/3r4/8/8/1Pp6/7B/8/6K1 b - b3 0 1'
    const gameStatus = parseFEN(startingFEN)
    const [turn, setTurn] = useState<string>(gameStatus.turn)
    const [castling, setCastling] = useState<string>(gameStatus.castlingAvailability)
    const [enPassantTarget, setEnPassantTarget] = useState<string>(gameStatus.enPassant)
    const [halfMove, setHalfMove] = useState<number>(parseInt(gameStatus.halfMove))
    const [castlingAvailability, setCastlingAvailability] = useState<string>(gameStatus.castlingAvailability)
    const [fullMove, setFullMove] = useState<number>(parseInt(gameStatus.fullMove))
    const [position, setPosition] = useState<string[][]>(
        gameStatus.position
    )
    const getFinalSquare = (e: React.DragEvent) => {
        const {width, left, top} = ref.current!.getBoundingClientRect()
        const size = width / 8
        const file = Math.floor((e.clientX - left) / size)
        const rank = Math.floor((e.clientY - top) / size)
        return [rank, file]
    }

    const handleEnPassant = (piece: string, originalRank: number, originalFile: number, finalRank: number, finalFile: number) => {
        let newPosition = position.slice()
        newPosition[originalRank][originalFile] = ''
        newPosition[finalRank][finalFile] = piece
        if(piece === PieceType.BLACK_PAWN) {
            newPosition[finalRank - 1][finalFile] = ''
        } else if (piece === PieceType.WHITE_PAWN) {
            newPosition[finalRank + 1][finalFile] = ''
        }
        setPosition(newPosition)
    }

    const handleCastling = (piece: string, originalRank: number, originalFile: number, finalRank: number, finalFile: number) => {
        let newPosition = position.slice()
        if(piece === PieceType.BLACK_KING) {
            if(finalFile === 6) {
                // black king side castling
                newPosition[originalRank][originalFile] = ''
                newPosition[0][6] = PieceType.BLACK_KING
                newPosition[0][5] = PieceType.BLACK_ROOK
                newPosition[0][7] = ''
            } else if (finalFile === 2) {
                // black queen side castling
                newPosition[originalRank][originalFile] = ''
                newPosition[0][2] = PieceType.BLACK_KING
                newPosition[0][3] = PieceType.BLACK_ROOK
                newPosition[0][0] = ''
            }
            let newCastling = castlingAvailability.replace('k', '')
            newCastling = newCastling.replace('q', '')
            setCastlingAvailability(newCastling)
            setPosition(newPosition)
        } else if (piece === PieceType.WHITE_KING) {
            if(finalFile === 6) {
                // white king side castling
                newPosition[originalRank][originalFile] = ''
                newPosition[7][6] = PieceType.WHITE_KING
                newPosition[7][5] = PieceType.WHITE_ROOK
                newPosition[7][7] = ''
            } else if (finalFile === 2) {
                // white queen side castling
                newPosition[originalRank][originalFile] = ''
                newPosition[7][2] = PieceType.WHITE_KING
                newPosition[7][3] = PieceType.WHITE_ROOK
                newPosition[7][0] = ''
            }
            let newCastling = castlingAvailability.replace('K', '')
            newCastling = newCastling.replace('Q', '')
            setCastlingAvailability(newCastling)
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
        setEnPassantTarget('-')
        // handle castling
        if ((piece === PieceType.BLACK_KING || piece === PieceType.WHITE_KING) && Math.abs(originalFile - finalFile) === 2) {
            handleCastling(piece, originalRank, originalFile, finalRank, finalFile)
        }
        // handle en passant capture
        else if ((piece === PieceType.BLACK_PAWN || piece === PieceType.WHITE_PAWN) && finalFile !== originalFile && position[finalRank][finalFile] === '') {
            handleEnPassant(piece, originalRank, originalFile, finalRank, finalFile)
        }
        else if (piece === PieceType.BLACK_ROOK) {
            if(originalFile === 0) {
                let newCastling = castlingAvailability.replace('q', '')
                setCastlingAvailability(newCastling)
            } else if (originalFile === 7) {
                let newCastling = castlingAvailability.replace('k', '')
                setCastlingAvailability(newCastling)
            }
        }
        else if (piece === PieceType.WHITE_ROOK) {
            if(originalFile === 0) {
                let newCastling = castlingAvailability.replace('Q', '')
                setCastlingAvailability(newCastling)
            } else if (originalFile === 7) {
                let newCastling = castlingAvailability.replace('K', '')
                setCastlingAvailability(newCastling)
            }
        }
        // handle normal moves
        else {
            handleNormalMoves(piece, originalRank, originalFile, finalRank, finalFile)
        }
        if(turn === Player.BLACK) {
            setFullMove(fullMove + 1)
        }
        // handle movement to en passant target square
        if (piece === PieceType.WHITE_PAWN && originalRank === 6 && finalRank === 4) {
            setEnPassantTarget(getFileChar(finalFile) + getRankChar(finalRank + 1))
        }
        else if(piece === PieceType.BLACK_PAWN && originalRank === 1 && finalRank === 3) {
            setEnPassantTarget(getFileChar(finalFile) + getRankChar(finalRank - 1))
        }
        setTurn(turn === Player.WHITE ? Player.BLACK : Player.WHITE)
        console.log('en passant target', enPassantTarget)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const[piece, originalRank, originalFile] = e.dataTransfer.getData('text/plain').split('-')
        const [originalRankInt, originalFileInt] = [parseInt(originalRank), parseInt(originalFile)]
        const availableMoves = getMoves(position, originalRankInt, originalFileInt, enPassantTarget, castlingAvailability)
        console.log('Available moves', availableMoves)
        const finalSquare = getFinalSquare(e)
        const [rank, file] = finalSquare
        const isKingMove = piece === 'K' || piece === 'k'
        console.log('Piece color:', getPieceColor(position[originalRankInt][originalFileInt]) === turn)
        console.log('Validity:', checkValidity(finalSquare, availableMoves, isKingMove))
        if(getPieceColor(position[originalRankInt][originalFileInt]) === turn &&
        checkValidity(finalSquare, availableMoves, isKingMove)) {
            updatePosition(piece, originalRankInt, originalFileInt, rank, file)
        }
    }
    // console.log('Total moves', getTotalMoves(position, 'w', enPassantTarget, castlingAvailability))
    // console.log('Is 4, 7 attacked?', isSquareAttacked(position, [4, 7], Player.WHITE, castlingAvailability))
    // console.log('Is piece Pinned', isPiecePinned(position, 1, 3))
    let pieceAttacks = new Array(8)
    let pawnAttacks = new Array(8)
    for(let i = 0; i < 8; i++) {
        pieceAttacks[i] = new Array(8).fill(false)
        pawnAttacks[i] = new Array(8).fill(false)
    }
    const pieceAttackedSquares = getPieceAttacks(position, Player.WHITE)
    const pawnAttackedSquares = getPawnAttacks(position, Player.WHITE)
    pieceAttackedSquares.forEach(([rank, file]) => {
        pieceAttacks[rank][file] = true
    })
    pawnAttackedSquares.forEach(([rank, file]) => {
        pawnAttacks[rank][file] = true
    })
    // console.log('Pawn attacks', getPawnAttacks(position, Player.WHITE))
    // console.log('Piece moves', getPieceMoves(position, 2, 5, castlingAvailability))
    // console.log(getKingMoves(position, 0, 4, castlingAvailability))
    // console.log(isSquareAttacked(position, [1, 6], Player.WHITE, castlingAvailability))
    // console.log(position[1][6] === '')

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }
    console.log(turn)
    return (
        <div 
        ref={ref}
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="pieces">
            {position.map((r, rank) => 
                r.map((f, file) => 
                    // position[rank][file] ?
                    // <Piece key={`${rank}-${file}`} rank={7-rank} file={file} piece={position[rank][file]} isAttacked={isAttackedArray[rank][file]} />
                    // : null
                    <Piece key={`${rank}-${file}`} rank={7-rank} file={file} piece={position[rank][file]} pieceAttack={pieceAttacks[rank][file]} pawnAttack={pawnAttacks[rank][file]}/>
                )
            )}
        </div>
    )
}

export default Pieces
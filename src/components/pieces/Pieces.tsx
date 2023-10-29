import React, { useState } from 'react'
import Piece from './Piece'
import './Pieces.css'
import { getPieceMoves } from '../../arbiter/getMoves'
import { parseFEN, startingFEN } from '../../utils/UtililtyFns'

const Pieces = () => {
    const puzzleFEN = 'r5rk/5p1p/5R2/4B3/8/8/7P/7K w'
    const [position, setPosition] = useState<string[][]>(
        parseFEN(startingFEN).position
    )
    console.log(getPieceMoves(position, "pawn", "w", 1, 0))


    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        console.log(e.dataTransfer.getData('text/plain'))
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    return (
        <div 
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
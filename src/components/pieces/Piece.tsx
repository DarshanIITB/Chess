import "./Pieces.css"

interface Props {
  rank: number
  file: number
  piece: string
  pieceAttack: boolean
  pawnAttack: boolean
}

const Piece = ({ rank, file, piece, pieceAttack, pawnAttack }: Props) => {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", `${piece}-${7-rank}-${file}`)
    // using timeout so that the piece is attached to drag before being removed
    setTimeout(() => {
      const target = e.target as HTMLElement
      target.style.display = "none"
    }, 0)
  }
  
  const onDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.display = "block"
  }

  let className = `piece ${piece} p-${file}${rank}`
  className += pieceAttack ? " PA" : ""
  className += pawnAttack ? " pA" : ""

  return (
    <div
      className={className}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{}}
    />
  )
}

export default Piece

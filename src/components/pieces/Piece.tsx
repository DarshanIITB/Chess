import "./Pieces.css"

interface Props {
  rank: number
  file: number
  piece: string
}

const Piece = ({ rank, file, piece }: Props) => {
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

  return (
    <div
      className={`piece ${piece} p-${file}${rank}`}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{}}
    />
  )
}

export default Piece

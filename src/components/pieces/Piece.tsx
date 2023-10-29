import "./Pieces.css"

interface Props {
  rank: number
  file: number
  piece: string
}

const Piece = ({ rank, file, piece }: Props) => {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", `${piece}-${rank}-${file}`)
    // using timeout so that the piece is attached to drag before being removed
    setTimeout(() => {
      const target = e.target as HTMLElement
      target.style.display = "none"
    }, 0)
  }
  return (
    <div
      className={`piece ${piece} p-${file}${rank}`}
      draggable={true}
      onDragStart={onDragStart}
      style={{}}
    />
  )
}

export default Piece

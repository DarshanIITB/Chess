import './Ranks.css'

interface Props {
    ranks: number[]
}

const Ranks = ({ranks}: Props) => {
    return (
        <div className="ranks">
            {ranks.map(rank => <span key={rank}>{rank}</span>)}
        </div>
    )
}

export default Ranks
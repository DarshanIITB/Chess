import Board from "../components/Board/Board"
import {store} from "./Store"

const PlayScreen = () => {
  const moveHistory = store.getState().moveHistory
  const playMove = store(state => state.playMove)
  const goBack = store(state => state.goBack)
  return (
    <Board />
  )
}

export default PlayScreen
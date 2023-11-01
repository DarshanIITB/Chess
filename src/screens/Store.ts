import {create} from 'zustand'
import { startingFEN } from '../utils/UtililtyFns'

export interface State {
  startingFEN: string
  moveHistory: string[]
  playMove: (move: string) => void
  goBack: () => void
}
export const store = create<State>(set => ({
  startingFEN: startingFEN,
  moveHistory: [],
  playMove: move => set(state => ({moveHistory: [...state.moveHistory, move]})),
  goBack: () => set(state => ({moveHistory: state.moveHistory.slice(0, -1)})),
}))

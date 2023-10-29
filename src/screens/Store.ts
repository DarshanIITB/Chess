import {create} from 'zustand'

export interface State {
  moveHistory: string[]
  playMove: (move: string) => void
  goBack: () => void
}
export const store = create<State>(set => ({
  moveHistory: [],
  playMove: move => set(state => ({moveHistory: [...state.moveHistory, move]})),
  goBack: () => set(state => ({moveHistory: state.moveHistory.slice(0, -1)})),
}))

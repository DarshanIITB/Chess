interface State {
    moveHistory: string[]
}

interface Action {
    type: string
    move?: string
}

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'playMove':
            return { ...state, moveHistory: [...state.moveHistory, action.move] };
        case 'goBack':
            return { ...state, moveHistory: state.moveHistory.slice(0, -1) };
        default:
            return state;
    }
}
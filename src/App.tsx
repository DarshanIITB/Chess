import "./App.css"
import PlayScreen from "./screens/PlayScreen"
import AppContext from "./contexts/Context"
import { useReducer } from "react"
import { reducer } from "./reducer/reducer"

function App() {
  // const [appState, dispatch] = useReducer(reducer, {})
  return (
    <AppContext.Provider value={{}}>
      <div className="App">
        <PlayScreen />
      </div>
    </AppContext.Provider>
  );
}

export default App;

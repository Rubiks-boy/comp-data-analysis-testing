import "./App.css";
import { FetchContextProvider } from "./fetchingHooks/FetchContextProvider";

function App() {
  return (
    <FetchContextProvider>
      <h1>Vite + React</h1>
    </FetchContextProvider>
  );
}

export default App;

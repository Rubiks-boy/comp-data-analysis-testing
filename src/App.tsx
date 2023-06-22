import "./App.css";
import { Dashboard } from "./Dashboard";
import { FetchContextProvider } from "./fetchingHooks/FetchContextProvider";

function App() {
  return (
    <FetchContextProvider>
      <Dashboard />
    </FetchContextProvider>
  );
}

export default App;

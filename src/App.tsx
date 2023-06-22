import "./App.css";
import { Dashboard } from "./Dashboard";
import { FetchContextProvider } from "./fetchingHooks/FetchContextProvider";
import { PickerContextProvider } from "./pickers/PickerContextProvider";

function App() {
  return (
    <FetchContextProvider>
      <PickerContextProvider>
        <Dashboard />
      </PickerContextProvider>
    </FetchContextProvider>
  );
}

export default App;

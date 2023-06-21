import "./App.css";
import { CompetitorLimitChart } from "./CompetitorLimitChart";
import { WeeklyCompetitorLimitChart } from "./WeeklyCompetitorLimitChart";
import { FetchContextProvider } from "./fetchingHooks/FetchContextProvider";

function App() {
  return (
    <FetchContextProvider>
      <h1>PNW charts</h1>
      <CompetitorLimitChart />
      <WeeklyCompetitorLimitChart />
    </FetchContextProvider>
  );
}

export default App;

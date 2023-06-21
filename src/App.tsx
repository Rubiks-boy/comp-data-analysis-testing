import "./App.css";
import { CompetitorLimitChart } from "./CompetitorLimitChart";
import { FetchContextProvider } from "./fetchingHooks/FetchContextProvider";
import { useFetchPNWComps } from "./fetchingHooks/useFetchPNWComps";

function App() {
  const nearbyComps = useFetchPNWComps();

  return (
    <FetchContextProvider>
      <h1>PNW charts</h1>
      <CompetitorLimitChart />
      {nearbyComps.map(({ id, city, competitor_limit, start_date }, idx) => (
        <div key={`${id}-${idx}`}>
          <h2>{id}</h2>
          <p>{city}</p>
          <p>{competitor_limit}</p>
          <p>{start_date}</p>
        </div>
      ))}
    </FetchContextProvider>
  );
}

export default App;

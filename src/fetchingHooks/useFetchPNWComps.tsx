import { useQueryComps } from "./useQueryComps";
import { has333, isPNWComp } from "../utils/competitionFilters";

const ONE_DAY = 24 * 60 * 60 * 1000;
const DAYS = ONE_DAY * 365 * 6;

export const useFetchPNWComps = () => {
  const usComps = useQueryComps(
    "US",
    new Date(Date.now() - DAYS),
    new Date(Date.now())
  );

  const caComps = useQueryComps(
    "CA",
    new Date(Date.now() - DAYS),
    new Date(Date.now())
  );

  const candidateComps = [...usComps, ...caComps].sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  return candidateComps.filter(has333).filter(isPNWComp);
};

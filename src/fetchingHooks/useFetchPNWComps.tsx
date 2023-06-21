import { useQueryComps } from "./useQueryComps";
import { has333, isPNWComp } from "../utils/competitionFilters";

const ONE_DAY = 24 * 60 * 60 * 1000;
const DAYS = ONE_DAY * 365 * 4;

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

  const candidateComps = [...usComps, ...caComps];

  return candidateComps.filter(has333).filter(isPNWComp);
};

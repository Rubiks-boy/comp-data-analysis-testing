import { useQueryComps } from "./useQueryComps";
import { FetchResponse } from "../types";

const DAYS_180 = 180 * 24 * 60 * 60 * 1000;

export const useFetchPNWComps = () => {
  const usComps =
    useQueryComps(
      "US",
      new Date(Date.now() - DAYS_180),
      new Date(Date.now())
    ) ?? [];

  const caComps =
    useQueryComps(
      "CA",
      new Date(Date.now() - DAYS_180),
      new Date(Date.now())
    ) ?? [];

  const isOROrWA = (competition: FetchResponse) =>
    competition.city.includes("Washington") ||
    competition.city.includes("Oregon");

  const isBC = (competition: FetchResponse) =>
    competition.city.includes("British Columbia");

  return [...usComps.filter(isOROrWA), ...caComps.filter(isBC)];
};

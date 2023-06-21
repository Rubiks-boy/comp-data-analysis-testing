import type { FetchResponse } from "../types";

export const isWA = (competition: FetchResponse) =>
  competition.country_iso2 === "US" &&
  competition.city.includes(", Washington");

export const isOR = (competition: FetchResponse) =>
  competition.country_iso2 === "US" && competition.city.includes(", Oregon");

export const isWAorOR = (competition: FetchResponse) =>
  isWA(competition) || isOR(competition);

export const isBC = (competition: FetchResponse) =>
  competition.country_iso2 === "CA" &&
  competition.city.includes(", British Columbia");

export const isPNWComp = (competition: FetchResponse) =>
  isBC(competition) || isWAorOR(competition);

export const has333 = (competition: FetchResponse) =>
  competition.event_ids.includes("333");

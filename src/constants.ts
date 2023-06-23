import { isBC, isOR, isWA } from "./utils/competitionFilters";
import type { DataSeries } from "./types";

export const SERIES: { [key: string]: DataSeries } = {
  wa: {
    id: "wa",
    label: "Washington",
    compFilter: isWA,
    color: "rgb(77,166,255)",
  },
  or: {
    id: "or",
    label: "Oregon",
    compFilter: isOR,
    color: "rgba(255, 99, 132, 1)",
  },
  bc: {
    id: "bc",
    label: "British Columbia",
    compFilter: isBC,
    color: "rgb(21,128,0)",
  },
  all: {
    id: "all",
    label: "All PNW competitions",
    compFilter: () => true,
    color: "rgb(40, 40, 40)",
  },
};

export const EVENT_IDS: Array<string> = [
  "333",
  "222",
  "pyram",
  "skewb",
  "sq1",
  "333bf",
  "333oh",
  "444",
  "555",
  "666",
  "777",
  "minx",
  "clock",
  // "333fm",
  // "444bf",
  // "555bf",
  // "333mbf",
];

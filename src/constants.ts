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

export const HISTORICAL_PNW_REGISTRATION: { [k: string]: number } = {
  "333": 0.972,
  "222": 0.817,
  "444": 0.579,
  "555": 0.397,
  "666": 0.264,
  "777": 0.224,
  "333bf": 0.235,
  "333fm": 0.238,
  "333oh": 0.503,
  clock: 0.252,
  pyram: 0.68,
  minx: 0.341,
  skewb: 0.519,
  sq1: 0.359,
  "444bf": 0.106,
  "555bf": 0.089,
  "333mbf": 0.141,
  // Deprecated events
  magic: 0,
  mmagic: 0,
  "333mbo": 0,
  "333ft": 0,
};

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

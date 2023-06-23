import { useQueryComps } from "./useQueryComps";
import { has333, isPNWComp } from "../utils/competitionFilters";
import { useBucket, useSpan } from "../pickers/hooks";
import type { Competition, Span } from "../types";
import { getNextBucket } from "../utils/bucketComps";

const ONE_DAY = 24 * 60 * 60 * 1000;
const SIX_MONTHS = ONE_DAY * 180;
const ONE_YEAR = ONE_DAY * 365;

const getEarliestDate = (span: Span) => {
  if (span === "6m") {
    return new Date(Date.now() - SIX_MONTHS);
  }
  if (span === "1y") {
    return new Date(Date.now() - ONE_YEAR);
  }

  return new Date("2017-07-01");
};

export const useFetchPNWComps = () => {
  const span = useSpan();
  const bucket = useBucket();
  const earliestDate = getEarliestDate(span);

  const usFetch = useQueryComps("US", earliestDate, new Date(Date.now()));

  const caFetch = useQueryComps("CA", earliestDate, new Date(Date.now()));

  const candidateComps = [...usFetch.comps, ...caFetch.comps].sort(
    (a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  const minCompletedPeriodStart = getNextBucket(earliestDate, bucket);

  const isInCompletedPeriod = ({ start_date }: Competition) =>
    new Date(start_date) > minCompletedPeriodStart;

  return {
    isFetching: usFetch.isFetching || caFetch.isFetching,
    comps: candidateComps
      .filter(has333)
      .filter(isPNWComp)
      .filter(isInCompletedPeriod),
  };
};

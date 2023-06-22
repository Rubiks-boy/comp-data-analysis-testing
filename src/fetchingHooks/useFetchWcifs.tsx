import { useContext, useEffect, useState } from "react";
import { FetchContext } from "./FetchContextProvider";
import { cachedFetch } from "./useCachedFetch";
import { useBucket, useSpan } from "../pickers/hooks";
import { usePrevious } from "../utils/usePrevious";

export const useFetchWcifs = (
  competitionIds: Array<string>,
  readyToFetch: boolean
) => {
  const fetchCache = useContext(FetchContext);

  const span = useSpan();
  const prevSpan = usePrevious(span);
  const bucket = useBucket();
  const prevBucket = usePrevious(bucket);

  const inputChanged = span !== prevSpan || bucket !== prevBucket;

  const [wcifs, setWcifs] = useState<{ [compId: string]: any }>({});

  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    if (!readyToFetch) {
      return;
    }

    const fetchWcif = (competitionId: string) => {
      const path = `/competitions/${competitionId}/wcif/public`;
      return cachedFetch(fetchCache, path);
    };

    const fetchAllWcifs = async (idx: number) => {
      const compId = competitionIds[idx];
      const wcif = await fetchWcif(compId);

      setWcifs((existingWcifs) => ({ ...existingWcifs, [compId]: wcif }));

      if (idx > 0) {
        fetchAllWcifs(idx - 1);
      }
    };

    setIsFetching(true);
    setWcifs({});

    fetchAllWcifs(competitionIds.length - 1);
  }, [inputChanged, readyToFetch]);

  return { isFetching, wcifs };
};

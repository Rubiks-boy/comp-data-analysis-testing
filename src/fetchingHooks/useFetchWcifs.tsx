import { useContext, useEffect, useState } from "react";
import { FetchContext } from "./FetchContextProvider";
import { cachedFetch } from "./useCachedFetch";
import { useRegions, useSpan } from "../pickers/hooks";
import { usePrevious } from "../utils/usePrevious";
import { FetchResponse } from "../types";

const BATCH_SIZE = 5;

export const useFetchWcifs = (
  competitionIds: Array<string>,
  readyToFetch: boolean
) => {
  const fetchCache = useContext(FetchContext);

  const span = useSpan();
  const prevSpan = usePrevious(span);
  const regions = useRegions();
  const prevRegions = usePrevious(regions);

  const inputChanged =
    span !== prevSpan ||
    JSON.stringify(regions) !== JSON.stringify(prevRegions);

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

    const fetchAllWcifs = async (compIdx: number) => {
      if (compIdx >= competitionIds.length) {
        return [];
      }

      const fetchPromises = [...Array(BATCH_SIZE).keys()].map(async (i) => {
        const compId = competitionIds[compIdx + i];
        if (!compId) {
          return Promise.resolve(null);
        }

        const wcif = await fetchWcif(compId);
        return { compId, wcif };
      });

      const wcifBatch = await Promise.all(fetchPromises);

      const wcifs = wcifBatch.reduce((obj, wcif) => {
        if (!wcif) {
          return obj;
        }

        return Object.assign(obj, { [wcif.compId]: wcif.wcif });
      }, {});

      const remainingBatches: Array<FetchResponse> = await fetchAllWcifs(
        compIdx + BATCH_SIZE
      );

      return { ...wcifs, ...remainingBatches };
    };

    setIsFetching(true);
    setWcifs({});

    setTimeout(async () => {
      const wcifs = await fetchAllWcifs(0);

      setIsFetching(false);
      setWcifs(wcifs);
    });
    // This data only changes whenone of the inputs change & when we're ready to fetch (as determined by the competitor IDs updating)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputChanged, readyToFetch]);

  return { isFetching, wcifs };
};

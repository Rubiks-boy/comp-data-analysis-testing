import { useContext, useEffect, useState } from "react";
import { FetchContext } from "./FetchContextProvider";
import { cachedFetch } from "./useCachedFetch";

export const useFetchWcifs = (competitionIds: Array<string>) => {
  const fetchCache = useContext(FetchContext);

  const [wcifs, setWcifs] = useState<{ [compId: string]: any }>([]);

  const compIdString = JSON.stringify(competitionIds);

  useEffect(() => {
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

    setWcifs({});
    fetchAllWcifs(competitionIds.length - 1);
  }, [compIdString, fetchCache]);

  return wcifs;
};

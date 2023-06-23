import { useContext, useEffect, useState } from "react";
import { FetchContext } from "./FetchContextProvider";
import type { FetchResponse } from "../types";
import { cachedFetch } from "./useCachedFetch";

export const useQueryComps = (
  countryIso2: string,
  startDate: Date,
  endDate: Date
) => {
  const fetchCache = useContext(FetchContext);

  const start = startDate.toISOString().split("T")[0];
  const end = endDate.toISOString().split("T")[0];

  const [comps, setComps] = useState<Array<FetchResponse>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchPage = (page: number) => {
      const path = `/competitions?country_iso2=${countryIso2}&start=${start}&end=${end}&page=${page}`;
      return cachedFetch(fetchCache, path);
    };

    const fetchAllPages = async (page = 1): Promise<Array<FetchResponse>> => {
      const comps = await fetchPage(page);

      const remainingComps: Array<FetchResponse> = comps.length
        ? await fetchAllPages(page + 1)
        : [];

      return [...comps, ...remainingComps];
    };

    setIsFetching(true);
    setComps([]);

    fetchAllPages().then((comps: Array<FetchResponse>) => {
      setIsFetching(false);
      setComps(comps);
    });
  }, [countryIso2, start, end, fetchCache]);

  return { isFetching, comps };
};

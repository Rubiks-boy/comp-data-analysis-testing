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

    const fetchAllPages = async (page = 1) => {
      const comps = await fetchPage(page);

      setComps((existingComps) => [...existingComps, ...comps]);

      if (comps.length) {
        fetchAllPages(page + 1);
      } else {
        setIsFetching(false);
      }
    };

    setIsFetching(true);
    setComps([]);
    setTimeout(() => {
      fetchAllPages();
    });
  }, [countryIso2, start, end, fetchCache]);

  return { isFetching, comps };
};

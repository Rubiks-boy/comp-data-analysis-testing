import { useContext, useEffect, useState } from "react";
import { wcaApiFetch } from "../utils/wcaApi";
import { FetchContext } from "./FetchContextProvider";
import type { FetchCache, FetchResponse } from "../types";

export const cachedFetch = (fetchCache: FetchCache, path: string) => {
  fetchCache[path] ||= wcaApiFetch({ path });

  return fetchCache[path];
};

export const useCachedFetch = (path: string): null | FetchResponse => {
  const [response, setResponse] = useState(null);
  const fetchCache = useContext(FetchContext);

  useEffect(() => {
    const performFetch = async () => {
      const resp = await cachedFetch(fetchCache, path);
      setResponse(resp);
    };

    performFetch();
  }, [fetchCache, path]);

  return response;
};

import { useContext, useEffect, useState } from "react";
import { wcaApiFetch } from "./utils/wcaApi";
import { FetchContext } from "./FetchContextProvider";
import type { FetchResponse } from "./types";

export const useCachedFetch = (path: string): null | FetchResponse => {
  const [response, setResponse] = useState(null);
  const fetchCache = useContext(FetchContext);

  useEffect(() => {
    setResponse(null);

    fetchCache[path] ||= wcaApiFetch({ path });

    const performFetch = async () => {
      const resp = await fetchCache[path];
      setResponse(resp);
    };

    performFetch();
  }, [fetchCache, path]);

  return response;
};

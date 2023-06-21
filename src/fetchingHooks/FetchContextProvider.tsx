import React, { ReactNode, useRef } from "react";
import type { FetchCache } from "../types";

export const FetchContext = React.createContext<FetchCache>({});

export const FetchContextProvider = ({ children }: { children: ReactNode }) => {
  const fetchCacheRef = useRef<FetchCache>({});
  return (
    <FetchContext.Provider value={fetchCacheRef.current}>
      {children}
    </FetchContext.Provider>
  );
};

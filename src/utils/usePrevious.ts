import { useEffect, useRef } from "react";

export const usePrevious = <A>(val: A) => {
  const prev = useRef<A>(val);

  useEffect(() => {
    prev.current = val;
  });

  return prev.current;
};

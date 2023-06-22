import { useContext } from "react";
import { PickerContext } from "./PickerContextProvider";
import type { Bucket, PickerData, Region, Span } from "../types";

export const useSpan = (): Span => {
  const { pickerData } = useContext(PickerContext);
  return pickerData.span;
};

export const useBucket = (): Bucket => {
  const { pickerData } = useContext(PickerContext);
  return pickerData.bucket;
};

export const useRegions = (): Array<Region> => {
  const { pickerData } = useContext(PickerContext);
  return pickerData.regions;
};

export const useSetPickerData = (): ((
  newPickerData: Partial<PickerData>
) => void) => {
  const { setPickerData } = useContext(PickerContext);

  return (newPickerData: Partial<PickerData>) => {
    setPickerData((prev) => ({ ...prev, ...newPickerData }));
  };
};

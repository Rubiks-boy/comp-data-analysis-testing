import React, { ReactNode, useState } from "react";
import type { PickerData } from "../types";

const initialPickerData: PickerData = {
  span: "1y",
  bucket: "weekly",
  regions: ["wa", "or", "bc"],
};

export const PickerContext = React.createContext<{
  pickerData: PickerData;
  setPickerData: React.Dispatch<React.SetStateAction<PickerData>>;
}>({
  pickerData: initialPickerData,
  setPickerData: () => {
    return;
  },
});

export const PickerContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [pickerData, setPickerData] = useState<PickerData>(initialPickerData);

  return (
    <PickerContext.Provider value={{ pickerData, setPickerData }}>
      {children}
    </PickerContext.Provider>
  );
};

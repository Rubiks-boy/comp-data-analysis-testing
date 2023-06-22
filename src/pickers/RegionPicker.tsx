import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useRegions, useSetPickerData } from "./hooks";
import type { Region } from "../types";

export const RegionPicker = () => {
  const regions = useRegions();
  const setPickerData = useSetPickerData();
  const setRegions = (regions: Array<Region>) => setPickerData({ regions });

  const handleChange = (event: any, value: Array<Region>) => {
    if (event.target.value === "all") {
      setRegions(["all"]);
      return;
    }

    if (regions.length === 1 && regions[0] === "all") {
      setRegions([event.target.value]);
      return;
    }

    setRegions(value);
  };

  return (
    <ToggleButtonGroup color="primary" value={regions} onChange={handleChange}>
      <ToggleButton value="wa">WA</ToggleButton>
      <ToggleButton value="or">OR</ToggleButton>
      <ToggleButton value="bc">BC</ToggleButton>
      <ToggleButton value="all">All</ToggleButton>
    </ToggleButtonGroup>
  );
};

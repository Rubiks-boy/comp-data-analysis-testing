import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useBucket, useSetPickerData } from "./hooks";
import type { Bucket } from "../types";

export const BucketPicker = () => {
  const bucket = useBucket();
  const setPickerData = useSetPickerData();
  const setTime = (bucket: Bucket) => setPickerData({ bucket });

  return (
    <ToggleButtonGroup
      color="primary"
      value={bucket}
      exclusive
      onChange={(_, value) => setTime(value)}
    >
      <ToggleButton value="daily">Daily</ToggleButton>
      <ToggleButton value="weekly">Weekly</ToggleButton>
      <ToggleButton value="monthly">Monthly</ToggleButton>
      <ToggleButton value="quarterly">Quarterly</ToggleButton>
      <ToggleButton value="halves">Halves</ToggleButton>
    </ToggleButtonGroup>
  );
};

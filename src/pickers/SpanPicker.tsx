import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useSetPickerData, useSpan } from "./hooks";
import type { Span } from "../types";

export const SpanPicker = () => {
  const span = useSpan();
  const setPickerData = useSetPickerData();
  const setSpan = (span: Span) => setPickerData({ span });

  return (
    <ToggleButtonGroup
      color="primary"
      value={span}
      exclusive
      onChange={(_, value) => setSpan(value)}
    >
      <ToggleButton value="6m">6 months</ToggleButton>
      <ToggleButton value="1y">1 year</ToggleButton>
      <ToggleButton value="all">All time</ToggleButton>
    </ToggleButtonGroup>
  );
};

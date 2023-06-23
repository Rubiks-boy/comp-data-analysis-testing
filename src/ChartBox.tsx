import { Grid, Paper } from "@mui/material";
import { ReactNode } from "react";

export const ChartBox = ({
  children,
  xs = 12,
  lg = 6,
  height = 400,
}: {
  children: ReactNode;
  xs?: number;
  lg?: number;
  height?: number | null;
}) => {
  return (
    <Grid item xs={xs} lg={lg}>
      <Paper
        sx={{
          p: 2,
          height,
        }}
      >
        {children}
      </Paper>
    </Grid>
  );
};

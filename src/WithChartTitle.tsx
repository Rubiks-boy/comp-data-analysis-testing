import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

export const WithChartTitle = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <Box
      sx={{ p: 1, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 300 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
};

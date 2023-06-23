import { Box, CircularProgress } from "@mui/material";
import { ReactNode } from "react";

export const WithLoaderOverlay = ({
  children,
  isLoading,
}: {
  children: ReactNode;
  isLoading: boolean;
}) => {
  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 2,
            inset: 0,
            margin: "auto",
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box sx={{ height: "100%", opacity: isLoading ? 0.5 : 1 }}>
        {children}
      </Box>
    </Box>
  );
};

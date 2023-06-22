import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";

export const Header = () => {
  return (
    <AppBar>
      <Toolbar>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          PNW Charts
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

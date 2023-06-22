import { CompetitorLimitChart } from "./CompetitorLimitChart";
import { WeeklyCompetitorLimitChart } from "./WeeklyCompetitorLimitChart";
import { Box, Container, Grid, Paper, Toolbar } from "@mui/material";
import { Header } from "./Header";

export const Dashboard = () => {
  return (
    <div>
      <Box>
        <Header />
        <Box
          component={"main"}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Toolbar />
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <CompetitorLimitChart />
                </Paper>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 400,
                  }}
                >
                  <WeeklyCompetitorLimitChart />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </div>
  );
};
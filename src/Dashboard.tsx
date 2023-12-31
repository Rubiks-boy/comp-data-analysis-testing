import { CompetitorLimitChart } from "./CompetitorLimitChart";
import { Box, Container, Grid, Paper, Toolbar } from "@mui/material";
import { Header } from "./Header";
import { BucketPicker } from "./pickers/BucketPicker";
import { RegionPicker } from "./pickers/RegionPicker";
import { SpanPicker } from "./pickers/SpanPicker";
import { NumberOfCompsChart } from "./NumberOfCompsChart";
import { RegisteredCompetitorsChart } from "./RegisteredCompetitorsChart";
import { SpotsRegisteredPercentageChart } from "./SpotsRegisteredPercentageChart";
import { EventCoverageChart } from "./EventCoverageChart";
import { EventPopularityTables } from "./EventPopularityTables";
import { ChartBox } from "./ChartBox";

export const Dashboard = () => {
  console.log("render", new Date().getMilliseconds());
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
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    gap: 3,
                  }}
                >
                  <SpanPicker />
                  <BucketPicker />
                  <RegionPicker />
                </Paper>
              </Grid>
              <ChartBox>
                <CompetitorLimitChart />
              </ChartBox>
              <ChartBox>
                <NumberOfCompsChart />
              </ChartBox>
              <ChartBox>
                <RegisteredCompetitorsChart />
              </ChartBox>
              <ChartBox>
                <SpotsRegisteredPercentageChart />
              </ChartBox>
              <ChartBox lg={12} height={900}>
                <EventCoverageChart />
              </ChartBox>
              <EventPopularityTables />
            </Grid>
          </Container>
        </Box>
      </Box>
    </div>
  );
};

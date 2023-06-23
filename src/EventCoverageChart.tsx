import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  ZAxis,
  Scatter,
  Cell,
} from "recharts";
import { useFetchPNWComps } from "./fetchingHooks/useFetchPNWComps";
import { useBucket, useRegions } from "./pickers/hooks";
import type { Competition } from "./types";
import { createBucketedComps } from "./utils/bucketComps";
import { EVENT_IDS, SERIES } from "./constants";
import { dateFormatter } from "./utils";
import { WithLoaderOverlay } from "./WithLoaderOverlay";
import { WithChartTitle } from "./WithChartTitle";
import { useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";

const getFill = (value: number) => {
  const hue = ((1 - (100 - value) / 100) * 120).toString(10);
  const sat = (-1 / 2) * value + 100;
  return `hsl(${hue}, ${sat}%, 50%)`;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #999",
          margin: 0,
          padding: 10,
        }}
      >
        <p>{dateFormatter(data.date)}</p>
        <p>
          <span>Total competitor limit: </span>
          {data.spotsForEvent}
        </p>
        <p>
          <span>Comps: </span>
          {data.comps.map(({ name }: any) => name).join(", ")}
        </p>
      </div>
    );
  }

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        {payload.map(({ dataKey, value }: any) => (
          <p>
            {SERIES[dataKey].label}: {value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const addSpotsForEvent =
  (eventId: string) =>
  ({ date, comps }: { date: number; comps: Array<Competition> }) => {
    const spotsForEvent = comps.reduce(
      (sum, comp) =>
        (sum += comp.event_ids.includes(eventId) ? comp.competitor_limit : 0),
      0
    );

    return {
      date,
      comps: comps.filter(({ event_ids }) => event_ids.includes(eventId)),
      spotsForEvent,
      index: 1,
    };
  };

export const EventCoverageChart = () => {
  const { isFetching, comps: pnwComps } = useFetchPNWComps();
  const regions = useRegions();
  const bucket = useBucket();
  const [isWeightedByCompLimit, setIsWeightedByCompLimit] =
    useState<boolean>(false);

  const series = regions.map((region) => SERIES[region]);

  const compsInOneOfTheSeries = series.flatMap(({ compFilter }) =>
    pnwComps.filter(compFilter)
  );

  const bucketedComps = createBucketedComps(bucket, compsInOneOfTheSeries);

  const dataByEvent = EVENT_IDS.map((eventId: string) => {
    const withSpotsForEvent = bucketedComps.map(addSpotsForEvent(eventId));

    const minVal = Math.min(
      Math.min.apply(
        null,
        withSpotsForEvent.map(({ spotsForEvent }) => spotsForEvent)
      )
    );

    const maxVal = Math.max(
      Math.max.apply(
        null,
        withSpotsForEvent.map(({ spotsForEvent }) => spotsForEvent)
      )
    );

    return { eventId, data: withSpotsForEvent, minVal, maxVal };
  });

  const data333 = dataByEvent[0].data;

  const dataByEventAsPercentOf333 = dataByEvent.map((dataForEvent) => {
    const newData = dataForEvent.data.map((d, i) => {
      if (!data333[i].spotsForEvent) {
        return { ...d, perc: 0 };
      }

      if (isWeightedByCompLimit) {
        return {
          ...d,
          perc: (d.spotsForEvent / data333[i].spotsForEvent) * 100,
        };
      } else {
        return {
          ...d,
          perc: (d.comps.length / data333[i].comps.length) * 100,
        };
      }
    });

    return {
      ...dataForEvent,
      data: newData,
    };
  });

  const domain = [0, 100];
  const range = [400, 150];

  return (
    <WithLoaderOverlay isLoading={isFetching}>
      <WithChartTitle title="Event coverage">
        <Box sx={{ pb: 2, display: "flex", justifyContent: "center" }}>
          <ToggleButtonGroup
            color="primary"
            value={isWeightedByCompLimit}
            exclusive
            onChange={(_, value) => setIsWeightedByCompLimit(value)}
          >
            <ToggleButton value={true}>
              Weighted by competitor limit
            </ToggleButton>
            <ToggleButton value={false}>
              Weighted by % comps with event
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {dataByEventAsPercentOf333.map(({ eventId, data }, i) => (
          <ResponsiveContainer width="100%" height={60}>
            <ScatterChart
              width={800}
              height={60}
              margin={{
                top: 15,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              {i === dataByEventAsPercentOf333.length - 1 ? (
                <XAxis
                  type="category"
                  dataKey="date"
                  name="Date"
                  tickLine={{ transform: "translate(0, -6)" }}
                  tickFormatter={dateFormatter}
                  domain={["dataMin", "dataMax"]}
                />
              ) : (
                <XAxis
                  type="category"
                  dataKey="date"
                  name="Date"
                  tick={{ fontSize: 0 }}
                  tickLine={{ transform: "translate(0, -6)" }}
                  tickFormatter={dateFormatter}
                  domain={["dataMin", "dataMax"]}
                />
              )}
              <YAxis
                type="number"
                dataKey="index"
                height={10}
                width={80}
                tick={false}
                tickLine={false}
                axisLine={false}
                label={{
                  value: eventId,
                  position: "insideRight",
                }}
              />
              <ZAxis
                type="number"
                dataKey="perc"
                domain={domain}
                range={range}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={CustomTooltip}
              />
              <Scatter data={data}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getFill(entry.perc)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        ))}
      </WithChartTitle>
    </WithLoaderOverlay>
  );
};

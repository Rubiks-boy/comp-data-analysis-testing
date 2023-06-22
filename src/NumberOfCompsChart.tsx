import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useFetchPNWComps } from "./fetchingHooks/useFetchPNWComps";
import { useBucket, useRegions } from "./pickers/hooks";
import type { DataSeries, BucketedComps } from "./types";
import { createBucketedComps } from "./utils/bucketComps";
import { SERIES } from "./constants";
import { dateFormatter } from "./utils";

const addCountsByRegion = (
  series: Array<DataSeries>,
  bucketedComps: BucketedComps
) => {
  return bucketedComps.map(({ date, comps }) => {
    const seriesCounts: { [seriesId: string]: number } = {};
    series.forEach(({ id, compFilter }) => {
      seriesCounts[id] = comps.filter(compFilter).length;
    });

    return {
      date,
      comps,
      ...seriesCounts,
    };
  });
};

export const NumberOfCompsChart = () => {
  const pnwComps = useFetchPNWComps();
  const regions = useRegions();
  const bucket = useBucket();

  const series = regions.map((region) => SERIES[region]);

  const bucketedComps = createBucketedComps(bucket, pnwComps);

  const data = addCountsByRegion(series, bucketedComps);

  return (
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="date"
          name="Date"
          tickFormatter={dateFormatter}
          domain={["dataMin", "dataMax"]}
        />
        <YAxis />
        {series.map(({ id, color }) => (
          <Bar key={id} dataKey={id} fill={color} stackId="a" />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

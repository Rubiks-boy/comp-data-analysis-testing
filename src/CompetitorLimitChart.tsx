import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFetchPNWComps } from "./fetchingHooks/useFetchPNWComps";
import { useBucket, useRegions } from "./pickers/hooks";
import { createBucketedComps } from "./utils/bucketComps";
import { SERIES } from "./constants";
import { dateFormatter } from "./utils";
import { WithLoaderOverlay } from "./WithLoaderOverlay";
import type { BucketedComps, CompetitionFilter } from "./types";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p>{payload[2].value}</p>
        <p>{dateFormatter(payload[0].value)}</p>
        <p>
          {payload[1].name}: {payload[1].value}
        </p>
      </div>
    );
  }

  return null;
};

const transformDataForASeries = (
  compFilter: CompetitionFilter,
  bucketedComps: BucketedComps
) => {
  return bucketedComps
    .map(({ date, comps }) => {
      const compsInSeries = comps.filter(compFilter);
      return {
        date,
        compNames: compsInSeries.map((c) => c.name),
        totalLimit: compsInSeries.reduce(
          (sum, comp) => (sum += comp.competitor_limit),
          0
        ),
      };
    })
    .filter(({ totalLimit }) => totalLimit > 0);
};

export const CompetitorLimitChart = () => {
  const { isFetching, comps: pnwComps } = useFetchPNWComps();
  const regions = useRegions();
  const bucket = useBucket();

  const series = regions.map((region) => SERIES[region]);

  const bucketedComps = createBucketedComps(bucket, pnwComps);

  const datasets = series.map(({ label, compFilter, color }) => ({
    label,
    data: transformDataForASeries(compFilter, bucketedComps),
    color,
  }));

  return (
    <WithLoaderOverlay isLoading={isFetching}>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="date"
            name="Date"
            tickFormatter={dateFormatter}
            domain={["dataMin", "dataMax"]}
          />
          <YAxis type="number" dataKey="totalLimit" name="Competitor Limit" />
          <ZAxis type="category" dataKey="compNames" name="Competition" />
          <Tooltip content={CustomTooltip} />
          {datasets.map(({ label, data, color }) => (
            <Scatter key={label} name={label} data={data} fill={color} line />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </WithLoaderOverlay>
  );
};

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
import { isBC, isOR, isWA } from "./utils/competitionFilters";
import { useBucket, useRegions } from "./pickers/hooks";
import type { Bucket } from "./types";
import { getCompMonth, getPreviousWednesday } from "./utils/bucketComps";

const SERIES = {
  wa: {
    label: "Washington",
    compFilter: isWA,
    color: "rgb(77,166,255)",
  },
  or: {
    label: "Oregon",
    compFilter: isOR,
    color: "rgba(255, 99, 132, 1)",
  },
  bc: {
    label: "British Columbia",
    compFilter: isBC,
    color: "rgb(21,128,0)",
  },
  all: {
    label: "All PNW competitions",
    compFilter: () => true,
    color: "rgb(40, 40, 40)",
  },
};

type Competition = any;

const dateFormatter = (d: number) => {
  return new Date(d).toLocaleDateString();
};

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

type BucketedComps = { [compMonth: string]: Array<Competition> };
type BucketFunction = (date: Date) => string;
const bucketComps = (
  comps: Array<Competition>,
  bucketFunction: BucketFunction
) => {
  return comps.reduce((bucketedComps: BucketedComps, comp: Competition) => {
    const compBucket = bucketFunction(new Date(comp.start_date));
    return {
      ...bucketedComps,
      [compBucket]: [...(bucketedComps[compBucket] ?? []), comp],
    };
  }, {} as BucketedComps);
};

const createData = (bucket: Bucket, comps: Array<Competition>) => {
  let bucketFunction: BucketFunction;

  if (bucket === "monthly") {
    bucketFunction = (date) => getCompMonth(date).toLocaleDateString();
  } else if (bucket === "weekly") {
    bucketFunction = (date) => getPreviousWednesday(date).toLocaleDateString();
  } else {
    bucketFunction = (date) => date.toLocaleDateString();
  }

  const bucketedComps = bucketComps(comps, bucketFunction);

  return Object.entries(bucketedComps).map(([dateKey, comps]) => {
    const compNames = comps.map((c) => c.name);
    const totalCompetitors = comps.reduce(
      (sum, comp) => (sum += comp.competitor_limit),
      0
    );

    console.log({
      compNames,
      x: new Date(dateKey).getTime(),
      y: totalCompetitors,
    });

    return {
      compNames,
      x: new Date(dateKey).getTime(),
      y: totalCompetitors,
    };
  });
};

export const CompetitorLimitChart = () => {
  const pnwComps = useFetchPNWComps();
  const regions = useRegions();
  const bucket = useBucket();

  const series = regions.map((region) => SERIES[region]);

  const datasets = series.map(({ label, compFilter, color }) => ({
    label,
    data: createData(bucket, pnwComps.filter(compFilter)),
    color,
  }));

  return (
    <ResponsiveContainer>
      <ScatterChart>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          name="Date"
          tickFormatter={dateFormatter}
          domain={["dataMin", "dataMax"]}
        />
        <YAxis type="number" dataKey="y" name="Competitor Limit" />
        <ZAxis type="category" dataKey="compNames" name="Competition" />
        <Tooltip content={CustomTooltip} />
        {datasets.map(({ label, data, color }) => (
          <Scatter name={label} data={data} fill={color} line />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

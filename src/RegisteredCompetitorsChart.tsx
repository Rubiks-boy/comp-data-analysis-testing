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
import type { BucketedComps, CompetitionFilter, DataSeries } from "./types";
import { useFetchWcifs } from "./fetchingHooks/useFetchWcifs";

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
  bucketedComps: BucketedComps,
  wcifs: { [compId: string]: any }
) => {
  return bucketedComps
    .map(({ date, comps }) => {
      const compsInSeries = comps.filter(compFilter);

      const numPersons = compsInSeries.reduce((sum, comp) => {
        const wcif = wcifs[comp.id];
        if (!wcif) {
          return sum;
        }

        const numRegistered = wcif.persons.filter(
          (person: any) => person.registration?.status === "accepted"
        ).length;

        return (sum += numRegistered);
      }, 0);

      return {
        date,
        compNames: compsInSeries.map((c) => c.name),
        numPersons,
      };
    })
    .filter(({ numPersons }) => numPersons > 0);
};

export const RegisteredCompetitorsChart = () => {
  const { isFetching: isFetchingPNWComps, comps: pnwComps } =
    useFetchPNWComps();
  const regions = useRegions();
  const bucket = useBucket();

  const series: Array<DataSeries> = regions.map((region) => SERIES[region]);

  const compIds = series
    .flatMap(({ compFilter }) => pnwComps.filter(compFilter))
    .map(({ id }) => id);

  const { wcifs } = useFetchWcifs(compIds, !isFetchingPNWComps);

  const bucketedComps = createBucketedComps(bucket, pnwComps);

  const datasets = series.map(({ label, compFilter, color }) => ({
    label,
    data: transformDataForASeries(compFilter, bucketedComps, wcifs),
    color,
  }));

  return (
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
        <YAxis type="number" dataKey="numPersons" name="Number registered" />
        <ZAxis type="category" dataKey="compNames" name="Competition" />
        <Tooltip content={CustomTooltip} />
        {datasets.map(({ label, data, color }) => (
          <Scatter key={label} name={label} data={data} fill={color} line />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

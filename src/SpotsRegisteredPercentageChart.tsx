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
    const rawData = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p>{rawData.compNames}</p>
        <p>{dateFormatter(rawData.date)}</p>
        <p>
          Spots registered: {rawData.numPersons} / {rawData.compLimit} (
          {Math.round(rawData.percentRegistered)}%)
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

      const numbersPerComp = compsInSeries.map((comp) => {
        const wcif = wcifs[comp.id];

        if (!wcif) {
          return { limit: 0, numReigstered: 0 };
        }

        const numRegistered = wcif.persons.filter(
          (person: any) => person.registration?.status === "accepted"
        ).length;

        return {
          name: comp.name,
          limit: comp.competitor_limit,
          numRegistered,
        };
      });

      const validDataInSeries = numbersPerComp.filter(
        ({ limit, numRegistered }) => numRegistered > 0 && limit > 0
      );

      const compLimit = validDataInSeries.reduce(
        (sum, { limit }) => (sum += limit),
        0
      );

      const numPersons = validDataInSeries.reduce(
        (sum, { numRegistered }) => (sum += numRegistered),
        0
      );

      return {
        date,
        compNames: validDataInSeries.map((c) => c.name),
        compLimit,
        numPersons,
        percentRegistered: (numPersons / compLimit) * 100,
      };
    })
    .filter(({ compNames }) => compNames.length > 0);
};

export const SpotsRegisteredPercentageChart = () => {
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
        <YAxis
          type="number"
          unit={"%"}
          dataKey="percentRegistered"
          name="Spots registered"
          domain={["dataMin", 100]}
          tickFormatter={(value: number) => `${Math.round(value)}`}
        />
        <ZAxis type="category" dataKey="compNames" name="Competition" />
        <Tooltip content={CustomTooltip} />
        {datasets.map(({ label, data, color }) => (
          <Scatter key={label} name={label} data={data} fill={color} line />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

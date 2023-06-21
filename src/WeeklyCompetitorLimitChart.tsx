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

type Competition = any;

const ONE_DAY = 24 * 60 * 60 * 1000;

const getPreviousWednesday = (date: Date) => {
  const day = date.getUTCDay();
  return new Date(date.getTime() - (day >= 3 ? day - 3 : day + 4) * ONE_DAY);
};

const dateFormatter = (d: number) => {
  return new Date(d).toLocaleDateString();
};

const compToDataPoint = (comp: Competition) => ({
  week: getPreviousWednesday(new Date(comp.start_date)).getTime(),
  limit: comp.competitor_limit,
});

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    console.log(payload);
    return (
      <div className="custom-tooltip">
        <p>{dateFormatter(payload[0].value)}</p>
        <p>
          {payload[1].name}: {payload[1].value}
        </p>
      </div>
    );
  }

  return null;
};

export const WeeklyCompetitorLimitChart = () => {
  const pnwComps = useFetchPNWComps();

  const series = [
    {
      label: "Washington",
      compFilter: isWA,
      color: "rgb(77,166,255)",
    },
    {
      label: "Oregon",
      compFilter: isOR,
      color: "rgba(255, 99, 132, 1)",
    },
    {
      label: "British Columbia",
      compFilter: isBC,
      color: "rgb(21,128,0)",
    },
  ];

  const datasets = series.map(({ label, compFilter, color }) => ({
    label,
    data: pnwComps
      .filter(compFilter)
      .map(compToDataPoint)
      .reduce((accumulator, { week, limit }) => {
        const idx = accumulator.findIndex((c: any) => c.week === week);
        if (idx !== -1) {
          const newArr = [...accumulator];
          newArr[idx] = {
            week,
            limit: limit + accumulator[idx].limit,
          };
          return newArr;
        }

        return accumulator.concat([{ week, limit }]);
      }, [] as any),
    color,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="week"
          name="Date"
          tickFormatter={dateFormatter}
          domain={["dataMin", "dataMax"]}
        />
        <YAxis type="number" dataKey="limit" name="Competitor Limit" />
        <Tooltip content={CustomTooltip} />
        {datasets.map(({ label, data, color }) => (
          <Scatter name={label} data={data} fill={color} line />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

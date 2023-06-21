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

const dateFormatter = (d: number) => {
  return new Date(d).toLocaleDateString();
};

const compToDataPoint = (comp: Competition) => ({
  comp: comp.name,
  x: new Date(comp.start_date).getTime(),
  y: comp.competitor_limit,
});

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    console.log(payload);
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

export const CompetitorLimitChart = () => {
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
    data: pnwComps.filter(compFilter).map(compToDataPoint),
    color,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
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
        <ZAxis type="category" dataKey="comp" name="Competition" />
        <Tooltip content={CustomTooltip} />
        {datasets.map(({ label, data, color }) => (
          <Scatter name={label} data={data} fill={color} line />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

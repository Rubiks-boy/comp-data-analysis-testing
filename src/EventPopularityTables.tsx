import { useRegions } from "./pickers/hooks";
import { EventPopularityTable } from "./EventPopularityTable";
import { ChartBox } from "./ChartBox";

export const EventPopularityTables = () => {
  const regions = useRegions();

  return (
    <>
      {regions.map((region) => (
        <ChartBox lg={12} height={null}>
          <EventPopularityTable region={region} />
        </ChartBox>
      ))}
    </>
  );
};

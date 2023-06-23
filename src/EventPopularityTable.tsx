import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useFetchPNWComps } from "./fetchingHooks/useFetchPNWComps";
import { useRegions } from "./pickers/hooks";
import { EVENT_IDS, HISTORICAL_PNW_REGISTRATION, SERIES } from "./constants";
import { WithLoaderOverlay } from "./WithLoaderOverlay";
import { WithChartTitle } from "./WithChartTitle";
import { useFetchWcifs } from "./fetchingHooks/useFetchWcifs";

export const EventPopularityTable = () => {
  const { isFetching: isFetchingPNWComps, comps: pnwComps } =
    useFetchPNWComps();
  const regions = useRegions();

  const series = regions.map((region) => SERIES[region]);

  const comps = series.flatMap(({ compFilter }) => pnwComps.filter(compFilter));

  const { isFetching: isFetchingWcifs, wcifs } = useFetchWcifs(
    comps.map(({ id }) => id),
    !isFetchingPNWComps
  );

  console.log(wcifs);

  const dataByEvent = EVENT_IDS.map((eventId: string) => {
    const compsWithEvent = comps.filter(({ event_ids }) =>
      event_ids.includes(eventId)
    );

    const numComps = compsWithEvent.length;

    const numRegisteredPerComp = compsWithEvent.map((comp) => {
      const wcif = wcifs[comp.id];

      if (!wcif) {
        return { numPeopleInEvent: 0, numPeopleAtComp: 0 };
      }

      const { persons } = wcif;

      const acceptedRegistrations = persons.filter(
        (person: any) => person.registration?.status === "accepted"
      );

      const numPeopleInEvent = acceptedRegistrations.filter(
        (person: any) => !!person.registration?.eventIds?.includes(eventId)
      ).length;

      const numPeopleAtComp = acceptedRegistrations.length;

      return { numPeopleInEvent, numPeopleAtComp };
    });

    const numRegisteredForEvent = numRegisteredPerComp.reduce(
      (sum, { numPeopleInEvent }) => sum + numPeopleInEvent,
      0
    );
    const numRegistrations = numRegisteredPerComp.reduce(
      (sum, { numPeopleAtComp }) => sum + numPeopleAtComp,
      0
    );

    return {
      eventId,
      numComps,
      numRegistered: numRegisteredForEvent,
      percentRegistered: (numRegisteredForEvent / numRegistrations) * 100,
    };
  });

  return (
    <WithLoaderOverlay isLoading={isFetchingWcifs || isFetchingPNWComps}>
      <WithChartTitle title="Event popularity">
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell align="right">Comps&nbsp;(#)</TableCell>
                <TableCell align="right">Registered&nbsp;(%)</TableCell>
                <TableCell align="right">Historical PNW&nbsp;(%)</TableCell>
                <TableCell align="right">Diff&nbsp;(%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataByEvent.map((row) => (
                <TableRow
                  key={row.eventId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.eventId}
                  </TableCell>
                  <TableCell align="right">{row.numComps}</TableCell>
                  <TableCell align="right">
                    {row.percentRegistered.toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    {(HISTORICAL_PNW_REGISTRATION[row.eventId] * 100).toFixed(
                      1
                    )}
                    %
                  </TableCell>
                  <TableCell align="right">
                    {(
                      row.percentRegistered -
                      HISTORICAL_PNW_REGISTRATION[row.eventId] * 100
                    ).toFixed(1)}
                    %
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </WithChartTitle>
    </WithLoaderOverlay>
  );
};

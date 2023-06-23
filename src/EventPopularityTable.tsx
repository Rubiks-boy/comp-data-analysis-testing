import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { useFetchPNWComps } from "./fetchingHooks/useFetchPNWComps";
import { EVENT_IDS, HISTORICAL_PNW_REGISTRATION, SERIES } from "./constants";
import { WithLoaderOverlay } from "./WithLoaderOverlay";
import { WithChartTitle } from "./WithChartTitle";
import { useFetchWcifs } from "./fetchingHooks/useFetchWcifs";
import type { Region } from "./types";
import { useMemo, useState } from "react";
import { visuallyHidden } from "@mui/utils";

type Order = "asc" | "desc";
type ColId =
  | "eventId"
  | "numComps"
  | "percentComps"
  | "diffVsComps"
  | "percentRegistered"
  | "historicalPNW"
  | "diffVsHistorical";

type HeadCell = {
  disablePadding: boolean;
  id: ColId;
  label: string;
  numeric: boolean;
};

const headCells: Array<HeadCell> = [
  {
    id: "eventId",
    numeric: false,
    disablePadding: true,
    label: "Event",
  },
  {
    id: "percentRegistered",
    numeric: true,
    disablePadding: false,
    label: "Registered (%)",
  },
  {
    id: "numComps",
    numeric: true,
    disablePadding: false,
    label: "Comps (#)",
  },
  {
    id: "percentComps",
    numeric: true,
    disablePadding: false,
    label: "Comps (%)",
  },
  {
    id: "diffVsComps",
    numeric: true,
    disablePadding: false,
    label: "Reg – Comps (%)",
  },
  {
    id: "historicalPNW",
    numeric: true,
    disablePadding: false,
    label: "Historical PNW (%)",
  },
  {
    id: "diffVsHistorical",
    numeric: true,
    disablePadding: false,
    label: "Reg – Hist. (%)",
  },
];

const descendingComparator = <T,>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = <Key extends keyof any>(
  order: Order,
  orderBy: Key
): ((
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const EventPopularityTable = ({ region }: { region: Region }) => {
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<ColId>("percentRegistered");

  const { isFetching: isFetchingPNWComps, comps: pnwComps } =
    useFetchPNWComps();

  const series = [SERIES[region]];

  const comps = series.flatMap(({ compFilter }) => pnwComps.filter(compFilter));

  const { isFetching: isFetchingWcifs, wcifs } = useFetchWcifs(
    comps.map(({ id }) => id),
    !isFetchingPNWComps
  );

  const dataByEvent = EVENT_IDS.map((eventId: string) => {
    const compsWithEvent = comps.filter(({ event_ids }) =>
      event_ids.includes(eventId)
    );

    const numComps = compsWithEvent.length;

    const percentComps = (numComps / comps.length) * 100;

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

    const percentRegistered = (numRegisteredForEvent / numRegistrations) * 100;

    const historicalPNW = HISTORICAL_PNW_REGISTRATION[eventId] * 100;

    const diffVsHistorical = percentRegistered - historicalPNW;
    const diffVsComps = percentRegistered - percentComps;

    return {
      eventId,
      numComps,
      percentComps,
      numRegistered: numRegisteredForEvent,
      percentRegistered,
      historicalPNW,
      diffVsHistorical,
      diffVsComps,
    };
  });

  const handleRequestSort = (property: ColId) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const rows = useMemo(
    () => dataByEvent.sort(getComparator(order, orderBy)),
    [order, orderBy, dataByEvent]
  );

  return (
    <WithLoaderOverlay isLoading={isFetchingWcifs || isFetchingPNWComps}>
      <WithChartTitle title={`Event popularity (${region.toUpperCase()})`}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {headCells.map((headCell: HeadCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => {
                        handleRequestSort(headCell.id);
                      }}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.eventId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.eventId}
                  </TableCell>
                  <TableCell align="right">
                    {row.percentRegistered.toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">{row.numComps}</TableCell>
                  <TableCell align="right">
                    {row.percentComps.toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    {row.diffVsComps.toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    {row.historicalPNW.toFixed(1)}%
                  </TableCell>
                  <TableCell align="right">
                    {row.diffVsHistorical.toFixed(1)}%
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

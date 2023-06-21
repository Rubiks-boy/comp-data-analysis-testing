type Competition = any;
const ONE_DAY = 24 * 60 * 60 * 1000;

const createWeeklyDates = (start: Date, end: Date) => {
  const dates = [] as Array<Date>;
  for (let d = start; d <= end; d = new Date(d.getTime() + ONE_DAY * 7)) {
    dates.push(d);
  }
  return dates;
};

const getPreviousWednesday = (date: Date) => {
  const day = date.getUTCDay();
  return new Date(date.getTime() - (day >= 3 ? day - 3 : day + 4) * ONE_DAY);
};

const getNextWednesday = (date: Date) => {
  const day = date.getUTCDay();
  return new Date(
    date.getTime() + (day >= 4 ? 6 - day + 4 : 3 - day) * ONE_DAY
  );
};

export const bucketCompsWeekly = (competitions: Array<Competition>) => {
  const sortedCompetitions = competitions.sort((a, b) =>
    ("" + a.start_date).localeCompare(b.start_date)
  );

  if (!sortedCompetitions.length) {
    return [];
  }

  const firstStartDate = new Date(sortedCompetitions[0].start_date);
  const lastStartDate = new Date(
    sortedCompetitions[sortedCompetitions.length - 1].start_date
  );

  const wednesdayBefore = getPreviousWednesday(firstStartDate);
  const wednesdayAfter = getNextWednesday(lastStartDate);

  const dateBuckets = createWeeklyDates(wednesdayBefore, wednesdayAfter);

  return dateBuckets.map((d) => d.toLocaleDateString());
};

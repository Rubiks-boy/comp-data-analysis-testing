import type {
  Bucket,
  BucketFunction,
  BucketedComps,
  BucketedCompsObj,
  Competition,
} from "../types";

const ONE_DAY = 24 * 60 * 60 * 1000;

const createWeeklyDates = (start: Date, end: Date) => {
  const dates = [] as Array<Date>;
  for (let d = start; d <= end; d = new Date(d.getTime() + ONE_DAY * 7)) {
    dates.push(d);
  }
  return dates;
};

export const getPreviousWednesday = (date: Date) => {
  const day = date.getUTCDay();
  return new Date(date.getTime() - (day >= 3 ? day - 3 : day + 4) * ONE_DAY);
};

const getNextWednesday = (date: Date) => {
  const day = date.getUTCDay();
  return new Date(
    date.getTime() + (day >= 4 ? 6 - day + 4 : 3 - day) * ONE_DAY
  );
};

export const getCompHalf = (date: Date) => {
  return new Date(date.getFullYear(), Math.floor(date.getMonth() / 6) * 6, 1);
};

export const getCompQuarter = (date: Date) => {
  return new Date(date.getFullYear(), Math.floor(date.getMonth() / 3) * 3, 1);
};

export const getCompMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getNextBucket = (date: Date, bucket: Bucket) => {
  if (bucket === "monthly") {
    return getCompMonth(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  }
  if (bucket === "quarterly") {
    return getCompQuarter(new Date(date.getFullYear(), date.getMonth() + 3, 1));
  }
  if (bucket === "halves") {
    return getCompHalf(new Date(date.getFullYear(), date.getMonth() + 6, 1));
  }
  if (bucket === "weekly") {
    return getNextWednesday(date);
  }
  return date;
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

const bucketComps = (
  comps: Array<Competition>,
  bucketFunction: BucketFunction
) => {
  return comps.reduce((bucketedComps: BucketedCompsObj, comp: Competition) => {
    const compBucket = bucketFunction(new Date(comp.start_date));
    return {
      ...bucketedComps,
      [compBucket]: [...(bucketedComps[compBucket] ?? []), comp],
    };
  }, {} as BucketedCompsObj);
};

export const createBucketedComps = (
  bucket: Bucket,
  comps: Array<Competition>
): BucketedComps => {
  let bucketFunction: BucketFunction;

  if (bucket === "halves") {
    bucketFunction = (date) => getCompHalf(date).toLocaleDateString();
  } else if (bucket === "quarterly") {
    bucketFunction = (date) => getCompQuarter(date).toLocaleDateString();
  } else if (bucket === "monthly") {
    bucketFunction = (date) => getCompMonth(date).toLocaleDateString();
  } else if (bucket === "weekly") {
    bucketFunction = (date) => getPreviousWednesday(date).toLocaleDateString();
  } else {
    bucketFunction = (date) => date.toLocaleDateString();
  }

  const bucketedComps = bucketComps(comps, bucketFunction);

  return Object.entries(bucketedComps).map(([dateKey, comps]) => {
    return {
      date: new Date(dateKey).getTime(),
      comps: comps,
    };
  });
};

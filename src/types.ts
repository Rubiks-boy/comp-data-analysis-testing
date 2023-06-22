// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchResponse = any;

export type FetchCache = { [path: string]: Promise<FetchResponse> };

export type Span = "6m" | "1y" | "all";

export type Bucket = "daily" | "monthly" | "weekly";

export type Region = "wa" | "or" | "bc" | "all";

export type PickerData = {
  span: Span;
  bucket: Bucket;
  regions: Array<Region>;
};

export type CompetitionFilter = (competition: Competition) => boolean;
export type DataSeries = {
  id: string;
  label: string;
  compFilter: CompetitionFilter;
  color: string;
};

export type Competition = any;

export type BucketFunction = (date: Date) => string;
export type BucketedCompsObj = { [compDate: string]: Array<Competition> };
export type BucketedComps = Array<{ date: number; comps: Array<Competition> }>;

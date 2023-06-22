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

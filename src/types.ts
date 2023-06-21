// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FetchResponse = any;

export type FetchCache = { [path: string]: Promise<FetchResponse> };

export type QueryOrderDirection = "asc" | "desc";

export interface QueryParams {
  fresh?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: QueryOrderDirection;
  select?: string[];
  status?: string;
  user?: string;
}

export interface SynthClientConfig {
  fetch?: typeof globalThis.fetch;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  transport?: "graphql"; // [TODO]: add rest adapter in later version
  url: string;
}

export interface SynthClient {
  config: SynthClientConfig;
  query: <TData = unknown>(
    resource: string,
    params?: QueryParams
  ) => Promise<TData>;
}

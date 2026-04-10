import type { QueryParams } from "../client/types";

export interface TransportRequest {
  params?: QueryParams;
  resource: string;
}

export interface Transport {
  request: <TData = unknown>(req: TransportRequest) => Promise<TData>;
}

import type { QueryParams, SynthClient } from "../client/types";

export function getIntents<TData = unknown>(
  client: SynthClient,
  params?: QueryParams
) {
  return client.query<TData>("userIntents", params);
}

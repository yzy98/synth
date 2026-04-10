import type { QueryParams } from "../client/types";

export function buildKey(resource: string, params?: QueryParams) {
  return ["synth", resource, params ?? {}] as const;
}

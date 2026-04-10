import { executeQuery } from "../query/execute-query";
import { createGraphQLTransport } from "../transport/graphql";
import type { SynthClient, SynthClientConfig } from "./types";

export function createClient(config: SynthClientConfig): SynthClient {
  const transport = config.transport ?? "graphql";

  const resolvedConfig = {
    ...config,
    transport,
    fetch: config.fetch ?? globalThis.fetch,
  };

  const adapter =
    transport === "graphql" ? createGraphQLTransport(resolvedConfig) : null;

  if (!adapter) {
    throw new Error(`Unsupported transport: ${transport}`);
  }

  return {
    config: resolvedConfig,
    query(resource, params) {
      return executeQuery({
        transport: adapter,
        resource,
        params,
      });
    },
  };
}

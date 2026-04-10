import { GraphQLClient } from "graphql-request";
import type { SynthClientConfig } from "../client/types";
import { TransportError } from "../errors";
import {
  buildGraphQLQuery,
  buildGraphQLVariables,
  getGraphQLDataPath,
} from "./graphql-builder";
import type { Transport, TransportRequest } from "./types";

export function createGraphQLTransport(config: SynthClientConfig): Transport {
  const client = new GraphQLClient(config.url, {
    fetch: config.fetch,
  });

  return {
    async request<TData>({ resource, params }: TransportRequest) {
      try {
        const query = buildGraphQLQuery(resource, params);
        const variables = buildGraphQLVariables(resource, params);

        const headers =
          typeof config.headers === "function"
            ? await config.headers()
            : config.headers;

        const response = await client.request<Record<string, TData>>({
          document: query,
          variables,
          requestHeaders: headers,
        });

        const dataPath = getGraphQLDataPath(resource);
        return response[dataPath];
      } catch (error: unknown) {
        console.log(error);
        throw new TransportError(
          `GraphQL request failed for resource "${resource}"`
        );
      }
    },
  };
}

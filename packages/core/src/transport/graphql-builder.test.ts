import { beforeEach, describe, expect, it } from "vitest";
import type { QueryParams } from "../client/types";
import { buildGraphQLQuery, buildGraphQLVariables } from "./graphql-builder";

const RESOURCE = "userIntents";

const PARAMS: QueryParams = {
  user: "0xabc",
  limit: 10,
  offset: 0,
  fresh: false,
};

let params: QueryParams;

beforeEach(() => {
  params = { ...PARAMS };
});

const compact = (s: string) => s.replace(/\s+/g, " ").trim();

describe("graphqlBuilder", () => {
  it("builds userIntents query", () => {
    const query = buildGraphQLQuery(RESOURCE, params) as string;

    expect(compact(query)).toContain(
      "query SynthQuery($user: EthAddress!, $limit: Int, $offset: Int, $fresh: Boolean)"
    );

    expect(compact(query)).toContain(
      "userIntents(user: $user, limit: $limit, offset: $offset, fresh: $fresh"
    );
  });

  it("builds userIntents variables", () => {
    const variables = buildGraphQLVariables(RESOURCE, params);

    expect(variables).toEqual(PARAMS);
  });
});

import { describe, expect, it } from "vitest";
import { createClient } from "./create-client";

const runE2E = process.env.RUN_E2E === "1";
const itE2E = runE2E ? it : it.skip;

describe("e2e userIntents", () => {
  itE2E("works against real server", async () => {
    const expectedUser = process.env.SYNTH_USER_ADDRESS;
    expect(expectedUser).toBeTruthy();

    const client = createClient({
      url: process.env.SYNTH_GRAPHQL_URL ?? "http://localhost:4000/graphql",
      headers: {
        cookie: process.env.SYNTH_AUTH_COOKIE ?? "",
      },
    });

    const data = await client.query<Record<string, unknown>[]>("userIntents", {
      user: expectedUser ?? "",
    });

    expect(Array.isArray(data)).toBe(true);

    for (const item of data) {
      expect(item).toHaveProperty("user", expectedUser?.toLocaleLowerCase());
    }
  });
});

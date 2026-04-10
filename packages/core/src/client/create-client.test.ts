import { describe, expect, it, vi } from "vitest";
import { createClient } from "./create-client";

describe("createClient", () => {
  it("sends graphql request and returns dataPath payload", async () => {
    // biome-ignore lint/suspicious/useAwait: ignore
    const fetchMock = vi.fn(async (_url, init) => {
      const body = JSON.parse(String(init?.body ?? "{}"));

      expect(body.query).toContain("userIntents");
      expect(body.variables.user).toBe("0xabc");

      return new Response(
        JSON.stringify({
          data: {
            userIntents: [{ id: "1", status: "OPEN" }],
          },
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    });

    const client = createClient({
      url: "http://localhost:8787/graphql",
      fetch: fetchMock as typeof fetch,
    });

    const data = await client.query<{ id: string; status: string }[]>(
      "userIntents",
      {
        user: "0xabc",
        limit: 1,
      }
    );

    expect(data).toEqual([{ id: "1", status: "OPEN" }]);
  });
});

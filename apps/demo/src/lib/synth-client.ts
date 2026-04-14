import { createClient } from "@synth/core";

const endpoint = new URL(
  import.meta.env.VITE_SYNTH_GRAPHQL_URL ?? "/graphql",
  window.location.origin
).toString(); // http://localhost:5173/graphql

export const synthClient = createClient({
  url: endpoint,
  fetch: (input, init) =>
    fetch(input, {
      ...init,
      credentials: "include",
    }),
});

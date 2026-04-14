# Synth

Synth is a React-first data access layer for indexed Web3 data (v0.1).

## v0.1 Scope

- `@synth/core`
  - `createClient`
  - GraphQL transport
  - Basic query execution
- `@synth/react`
  - `SynthProvider`
  - `useUserIntents`
- `@synth/demo`
  - Vite + React + TanStack Query demo
  - Request flow verified with Vite proxy

## Monorepo Structure

```txt
apps/
  demo/
packages/
  core/
  react/
```

## Install and Run

```bash
pnpm install
pnpm build
pnpm --filter @synth/demo dev
```

## Demo Environment Variables

Example `apps/demo/.env.local`:

```env
VITE_SYNTH_GRAPHQL_URL=/graphql
```

Notes:

- For local development, use Vite `server.proxy`
- Send session credentials with `credentials: "include"`
- Do not put sensitive cookie/token values in `VITE_` variables

## Minimal Usage

### `@synth/core`

```ts
import { createClient } from "@synth/core";

const client = createClient({
  url: "http://localhost:4000/graphql",
});

const data = await client.query("userIntents", {
  user: "0x...",
  limit: 10,
});
```

### `@synth/react`

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@synth/core";
import { SynthProvider, useUserIntents } from "@synth/react";

const queryClient = new QueryClient();
const synthClient = createClient({ url: "http://localhost:4000/graphql" });

function Intents() {
  const { data, isLoading, error } = useUserIntents({
    user: "0x...",
    limit: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SynthProvider client={synthClient}>
        <Intents />
      </SynthProvider>
    </QueryClientProvider>
  );
}
```

## Common Commands

```bash
pnpm build
pnpm typecheck
pnpm --filter @synth/core test
pnpm --filter @synth/demo dev
```

## Current Status

- v0.1 core flow is working
- Next suggested steps: add `executions/swaps` hooks, improve test coverage, and expand API docs

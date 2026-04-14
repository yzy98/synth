/** biome-ignore-all lint/style/noNestedTernary: ignore */
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { synthClient } from "@/lib/synth-client";

interface UserIntent {
  amount?: string;
  createdAt?: string;
  id: string;
  status?: string;
  tokenFrom?: string;
  tokenTo?: string;
  user: string;
}

export function App() {
  const [input, setInput] = useState("");
  const [user, setUser] = useState("");

  const normalizedUser = useMemo(() => user.trim(), [user]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userIntents", normalizedUser],
    queryFn: () =>
      synthClient.query<UserIntent[]>("userIntents", {
        user: normalizedUser,
      }),
    enabled: normalizedUser.length > 0,
    staleTime: 10_000,
  });

  const handleClick = () => {
    setUser(input);
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 font-semibold text-2xl">Synth Demo: userIntents</h1>
      <Input
        onChange={(e) => setInput(e.target.value)}
        type="text"
        value={input}
      />
      <Button onClick={handleClick}>Query</Button>

      {normalizedUser.length === 0 ? (
        <p className="text-gray-600">Enter user address to query</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-600">Error: {(error as Error).message}</p>
      ) : (data?.length ?? 0) === 0 ? (
        <p className="text-gray-600">No data</p>
      ) : (
        <div className="space-y-3">
          {data?.map((item) => (
            <article className="p- 3 rounded border" key={item.id}>
              <div className="font-medium">id: {item.id}</div>
              <div>user: {item.user}</div>
              <div>status: {item.status ?? "-"}</div>
              <div>
                pair: {item.tokenFrom ?? "-"} →{item.tokenTo ?? "-"}
              </div>
              <div>amount: {item.amount ?? "-"}</div>
              <div>createdAt: {item.createdAt ?? "-"}</div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

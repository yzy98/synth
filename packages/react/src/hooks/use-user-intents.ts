import type { QueryParams } from "@synth/core";
import { useQuery } from "@tanstack/react-query";
import { useSynthClient } from "../provider/use-synth-client";

export function useUserIntents<TData = unknown>(params: QueryParams) {
  const client = useSynthClient();

  return useQuery({
    queryKey: ["synth", "userIntents", params],
    queryFn: () => client.query<TData>("userIntents", params),
    enabled: Boolean(params?.user),
  });
}

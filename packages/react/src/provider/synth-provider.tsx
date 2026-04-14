import type { SynthClient } from "@synth/core";
import type { PropsWithChildren } from "react";
import { SynthClientContext } from "./context";

type SynthProviderProps = PropsWithChildren<{
  client: SynthClient;
}>;

export function SynthProvider({ client, children }: SynthProviderProps) {
  return <SynthClientContext value={client}>{children}</SynthClientContext>;
}

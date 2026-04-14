import { useContext } from "react";
import { SynthClientContext } from "./context";

export function useSynthClient() {
  const client = useContext(SynthClientContext);

  if (!client) {
    throw new Error("useSynthClient must be used within <SynthProvider>");
  }

  return client;
}

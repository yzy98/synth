import type { SynthClient } from "@synth/core";
import { createContext } from "react";

export const SynthClientContext = createContext<SynthClient | null>(null);

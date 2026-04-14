/** biome-ignore-all lint/style/noNonNullAssertion: ignore */
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { SynthProvider } from "@synth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { synthClient } from "@/lib/synth-client";
import { App } from "./app";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SynthProvider client={synthClient}>
        <App />
      </SynthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

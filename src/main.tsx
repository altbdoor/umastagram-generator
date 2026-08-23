import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// for some reason, tsconfig is not able to understand the mapping defined in
// kumo package json, that points this path to the standalone css file
// @ts-ignore
import "@cloudflare/kumo/styles/standalone";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

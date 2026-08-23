import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [react()],
  build: {
    reportCompressedSize: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react",
              test: /node_modules\/react(-dom)?\//,
            },
            {
              name: "kumo",
              test: /node_modules\/@cloudflare\/kumo\//,
            },
          ],
        },
      },
    },
  },
});

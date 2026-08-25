import react from "@vitejs/plugin-react";
import { existsSync, statSync, writeFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [
    react(),
    {
      name: "cache-umapyoi-char-list",
      async configResolved(config) {
        const logInfo = (msg: string) => config.logger.info(msg, { timestamp: true });

        const res = await fetch("https://umapyoi.net/api/v1/character/info");
        if (!res.ok) {
          throw new Error(`unable to get char list, ${res.status}`);
        }

        const data = await res.text();
        const jsonPath = resolve("public/char-list.json");

        if (existsSync(jsonPath)) {
          logInfo("cached char list already exists");
        } else {
          writeFileSync(jsonPath, data, "utf-8");

          const { size } = statSync(jsonPath);
          logInfo(`cached char list at ${(size / 1024).toFixed(2)}KB`);
        }
      },
    },
  ],
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

import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  functions: {
    history: {
      name: "Reading History API",
      source: "functions/history/index.ts",
      env: {
        WORKOS_CLIENT_ID: { value: process.env.WORKOS_CLIENT_ID, required: true },
        WORKOS_API_HOSTNAME: { value: process.env.WORKOS_API_HOSTNAME, required: false },
      },
    },
  },
});

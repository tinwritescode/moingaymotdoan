import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  functions: {
    history: {
      name: "Reading History API",
      source: "functions/history/index.ts",
    },
  },
});

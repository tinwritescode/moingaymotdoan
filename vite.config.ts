import solid from "@solidjs/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { fileRoutes } from "filesystem-routing/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Start mode with SSR: the plugin generates the entries around src/App.tsx inside src/Document.tsx.
  // `pnpm build` then prerenders every page and data file into dist/client (scripts/prerender.mjs),
  // so the deployed site stays fully static.
  plugins: [
    solid({
      start: { middleware: "./src/middleware.ts" },
      ssr: true,
      // `extensions` also compiles the `?pick=` route modules the fileRoutes plugin emits.
      extensions: [".jsx", ".tsx"],
    }),
    // httpMethods: route modules may export GET (the JSON data and the ebooks).
    fileRoutes({ httpMethods: true, types: true }),
    tailwindcss(),
  ],
  server: { port: 3000 },
  build: { target: "esnext" },
  test: {
    projects: [
      { extends: true, test: { name: "node", environment: "node", include: ["**/*.test.ts"], exclude: ["node_modules/**"] } },
      { extends: true, test: { name: "dom", environment: "jsdom", include: ["src/**/*.test.tsx"] } },
    ],
  },
});

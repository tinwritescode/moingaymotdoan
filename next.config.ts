import type { NextConfig } from "next";

// No cacheComponents: the site is fully static, and with it an empty
// generateStaticParams (no chapter approved yet) fails the build.
const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

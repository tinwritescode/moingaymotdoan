## Solid 2.0

This site is Solid 2.0 (solid-js, @solidjs/web, @solidjs/router 2) with file routes in `src/routes`. Solid 2 drops much of Solid 1 and shares little with React: before writing or changing a component, route or data read, read `node_modules/solid-js/skills/solid-2.0/SKILL.md`. A diagnostic code printed by `pnpm dev` or a test (`STRICT_READ_UNTRACKED`, `SSR_BOUNDARY_WATERFALL`, …) maps to its repair in `node_modules/solid-js/skills/reactivity-diagnostics/SKILL.md`.

## Static build

`pnpm build` renders the site to `dist/client` by crawling links from `/` (`scripts/prerender.mjs`). A page or file reaches the deploy only when a prerendered page links to it, or when the script lists it (as it does the `/data/*.json` the browser fetches).

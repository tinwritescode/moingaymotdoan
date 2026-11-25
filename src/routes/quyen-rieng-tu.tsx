import type { RouteDefinition } from "@solidjs/router";
import { getToc } from "../data";
import { LegalPage } from "../pages/legal-page";

export const route = { preload: () => void getToc("vi") } satisfies RouteDefinition;

export default () => <LegalPage kind="privacy" />;

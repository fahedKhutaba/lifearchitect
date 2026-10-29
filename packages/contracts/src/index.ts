import type { components, paths } from "./generated/api";

export type { components, paths, operations } from "./generated/api";

export type Health = components["schemas"]["Health"];
export type HealthResponse =
  paths["/health"]["get"]["responses"]["200"]["content"]["application/json"];

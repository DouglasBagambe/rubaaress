export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-01";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "replacewithsanityprojectid";
export const studioBasePath = "/studio";

export type SanityEnvStatus = {
  isConfigured: boolean;
  missing: ReadonlyArray<string>;
};

export function getSanityEnvStatus(): SanityEnvStatus {
  const requiredVariables: ReadonlyArray<readonly [string, string | undefined]> = [
    ["NEXT_PUBLIC_SANITY_PROJECT_ID", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID],
    ["NEXT_PUBLIC_SANITY_DATASET", process.env.NEXT_PUBLIC_SANITY_DATASET],
    ["NEXT_PUBLIC_SANITY_API_VERSION", process.env.NEXT_PUBLIC_SANITY_API_VERSION],
  ];

  const missing = requiredVariables
    .filter(([, value]) => !value)
    .map(([name]) => name);

  return {
    isConfigured: missing.length === 0,
    missing,
  };
}

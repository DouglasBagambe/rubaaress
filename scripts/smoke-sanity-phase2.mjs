import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-08-01" });
const documentId = "homepage";
const fieldName = "enrolmentSectionHeading";
const testValue = "CMS smoke test heading";

const document = await client.getDocument(documentId);
if (!document) {
  throw new Error(`Missing ${documentId}; run npm run sanity:seed:phase2 first.`);
}

const originalValue = typeof document[fieldName] === "string" ? document[fieldName] : "Rubaare SS at a Glance";

await client.patch(documentId).set({ [fieldName]: testValue }).commit();
const changed = await client.getDocument(documentId);
if (changed?.[fieldName] !== testValue) {
  throw new Error("Smoke test patch did not persist.");
}

await client.patch(documentId).set({ [fieldName]: originalValue }).commit();
const restored = await client.getDocument(documentId);
if (restored?.[fieldName] !== originalValue) {
  throw new Error("Smoke test restore did not persist.");
}

console.log(`Smoke test passed: ${fieldName} changed and restored.`);

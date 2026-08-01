import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioBasePath } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: {
    studioUrl: studioBasePath,
  },
});

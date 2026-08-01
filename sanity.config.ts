import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId, studioBasePath } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";
import { filterSingletonTemplates, structure } from "@/sanity/structure";

export default defineConfig({
  name: "rubaare-secondary-school",
  title: "Rubaare Secondary School Website",
  projectId,
  dataset,
  basePath: studioBasePath,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  schema: {
    types: schemaTypes,
    templates: (prev) => filterSingletonTemplates(prev),
  },
});

import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const notes = defineCollection({
  loader: glob({ base: "src/modules/content/notes", pattern: "**/*.mdx" }),
  schema: z.object({
    published: z.coerce.date(),
    modified: z.coerce.date(),
    related: z.array(reference("notes")),
    labels: z.array(z.string()),
    title: z.string(),
  }),
});

export const collections = { notes };

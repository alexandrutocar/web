// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

export default defineConfig({
	publicDir: "assets",
	outDir: ".build",
	site: "https://ueuie.earth",
	integrations: [mdx()],
});

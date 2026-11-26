// @ts-check

import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";

const site = process.env.SITE_URL;

if (!site && process.env.NODE_ENV === "production") {
	throw new Error("SITE_URL environment variable is not set!");
}

export default defineConfig({
	publicDir: "assets",
	outDir: ".build",
	site,
	integrations: [mdx()],
});

// @ts-check
import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";

const site = Deno.env.get("SITE_URL");

if (!site && Deno.env.get("NODE_ENV") == "production") {
    throw new Error("SITE_URL environment variable is not set!");
}

export default defineConfig({
    publicDir: "assets",
    outDir: ".build",
    site,
    integrations: [mdx()],
});

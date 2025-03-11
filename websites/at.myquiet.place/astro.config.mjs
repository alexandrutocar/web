import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://at.myquiet.place/',
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
    runtime: {
      mode: 'local',
      type: 'pages',
    }
  }),
  integrations: [partytown(), mdx()],
  cacheDir: '.astro'
});
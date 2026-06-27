// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://slim.tf",

  // Pure static build, ideal for Cloudflare Pages.
  // No adapter needed unless you add server routes / Workers functions later.
  output: "static",

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      // Code-block theme for MDX posts. Swap for any Shiki theme you like.
      theme: "github-light",
      wrap: true,
    },
  },
});

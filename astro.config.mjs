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
    build: {
      // Lightning CSS is prefix-aware: it adds -webkit-backdrop-filter for
      // Safari while keeping the standard form for Firefox/Chrome. esbuild (the
      // default) drops the standard property, breaking backdrop blur in Firefox.
      cssMinify: "lightningcss",
      // Targets must include a Safari that still needs the -webkit- prefix.
      cssTarget: ["chrome90", "firefox103", "safari15", "edge90"],
    },
  },

  markdown: {
    shikiConfig: {
      // Dual code-block themes for MDX posts; prose.css switches to the
      // dark one under [data-theme="dark"] via the --shiki-dark variables.
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
});

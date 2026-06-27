# slim.tf: portfolio & blog

Astro + Tailwind v4 + MDX, styled with the slim.tf design system (light theme,
single teal accent). Built as a static site, deploys to Cloudflare Pages.

## Stack

- **Astro 5**: static site generator, ships zero JS by default
- **Tailwind v4**: via `@tailwindcss/vite`; tokens live in `src/styles/global.css` under `@theme`
- **MDX**: Markdown + JSX for blog posts, via Astro content collections
- **Cloudflare Pages**: static hosting

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
  styles/
    global.css       Design tokens (@theme) + components. Edit colors here.
    prose.css        Styles for MDX blog-post body content (.sl-prose)
  layouts/
    BaseLayout.astro Head, fonts, nav, footer
    BlogPost.astro   Wraps MDX posts in themed prose
  components/
    Nav.astro        Sticky pill navbar
    Hero.astro       Hero band + animated teal grid (canvas)
    Card.astro, PostCard.astro
  content/
    blog/            Your .mdx posts live here
  content.config.ts  Blog frontmatter schema (title, description, pubDate, tags, draft)
  pages/
    index.astro      Home (hero, work, latest posts, about)
    blog/index.astro Post list
    blog/[...slug].astro  Renders each post
    rss.xml.ts       RSS feed
public/
  favicon.svg
```

## Writing a post

Create `src/content/blog/my-post.mdx`:

```mdx
---
title: "My post title"
description: "One-line summary for cards and SEO."
pubDate: 2025-06-27
tags: ["tag-one", "tag-two"]
draft: false
---

Markdown content here. Import and use components when you need them:

import Card from "../../components/Card.astro";

<Card title="Inline component">Works inside MDX.</Card>
```

The frontmatter is type-checked against the schema in `content.config.ts`.
Set `draft: true` to hide a post from listings, the RSS feed, and builds.

## Customizing the look

All design decisions are tokens in `src/styles/global.css`:

- **Colors**: the `@theme` block (`--color-sl-*`) generates Tailwind utilities
  like `bg-sl-accent`, `text-sl-accent-ink`, `border-sl-border`.
- **Component classes**: `.sl-btn`, `.sl-card`, `.sl-nav`, `.sl-hero`, etc.
  read plain CSS vars (`--sl-*`) defined in the `:root` block below `@theme`.
- **Blog typography**: `src/styles/prose.css`.

Change `--color-sl-accent` (and its `--sl-accent` mirror) in one place and the
whole site follows.

## Deploying to Cloudflare Pages

This is a **static** build (`output: "static"` in `astro.config.mjs`), so no
adapter is required.

1. Push the repo to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Cloudflare gives you a `*.pages.dev` URL.

Before going live, set your real domain in `astro.config.mjs` (`site:`), which
feeds the sitemap, RSS, and canonical URLs.

> If you later add server-rendered routes or Cloudflare Workers functions,
> install `@astrojs/cloudflare`, set `output: "server"`, and add the adapter.
> For a portfolio/blog you almost certainly don't need this.

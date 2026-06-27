# CLAUDE.md — slim.tf portfolio & blog

Guidance for Claude Code when working in this repo. Read this before making changes.

## What this is

A static **portfolio + blog** built with **Astro 5 + Tailwind v4 + MDX**, deployed
to **Cloudflare Pages**. It uses the in-house **design system**: a light
theme with a single light-teal accent and a subtle single-hue teal gradient. No
purple, no rainbow gradients, no dark theme.

## Golden rules

1. **Never hardcode colors, radii, shadows, or fonts.** Use design tokens. If a
   value is genuinely missing, add a token in `src/styles/global.css` — don't
   inline a hex value in a component.
2. **Reuse the existing `.sl-*` component classes** before writing new CSS.
   The catalog is below.
3. **Stay on-brand:** one teal accent. The gradient is for emphasis only
   (headings' accent word, primary buttons, stat numbers) — don't spread it
   across the page.
4. **Keep it static and zero-JS by default.** This is `output: "static"`. Only
   add client `<script>` when an interaction truly needs it (like the hero
   canvas). Don't add a UI framework (React/Vue/Svelte) unless explicitly asked.
5. **Respect `prefers-reduced-motion`** on anything animated.
6. **Verify before declaring done:** run `npm run build` and make sure it passes.

## Source of truth: the design system

All design decisions live in two files. Read them before styling anything.

- `src/styles/global.css` — tokens + component classes
- `src/styles/prose.css` — blog post (MDX) body typography (`.sl-prose`)

### Tokens (Tailwind v4 `@theme`)

The `@theme` block generates utilities automatically. Prefer these utilities in
markup; use the mirrored `var(--sl-*)` custom properties only inside component
CSS or scripts.

Colors → `bg-*`, `text-*`, `border-*`:
`sl-base`, `sl-surface`, `sl-surface-2`, `sl-accent`, `sl-accent-hover`,
`sl-accent-soft`, `sl-accent-ink`, `sl-text`, `sl-text-secondary`,
`sl-text-muted`, `sl-border`, `sl-border-accent`, `sl-success`, `sl-warning`,
`sl-error`, plus header-band colors `sl-header-base/deep/text/muted`.

Other utilities: `font-display`, `font-body`; `rounded-sl-sm|md|lg|pill`;
`shadow-sl-sm|md|lg`.

Values not exposed as utilities (gradients, type scale, spacing, `--sl-nav-height`)
exist as `--sl-*` CSS variables in the `:root` block — reference with `var()`.

Key gradients (use sparingly): `--sl-gradient-accent` (buttons),
`--sl-gradient-text` (accent text / stats), `--sl-gradient-header` (hero band),
`--sl-gradient-soft` (tinted sections).

### Component classes

Layout: `.sl-container`, `.sl-section`, `.sl-section-tint`, `.sl-eyebrow`
Nav (sticky pill): `.sl-nav-wrap`, `.sl-nav`, `.sl-nav-brand`, `.sl-nav-links`
Hero band: `.sl-band`, `.sl-hero`, `.sl-hero-inner`, `.sl-hero-canvas`, `.sl-hero-cta`
Components: `.sl-btn` + `.sl-btn-primary` / `.sl-btn-secondary`, `.sl-card`,
`.sl-badge`, `.sl-stat-number`, `.sl-stat-label`, `.sl-accent-text`

When you need a new component, add its class to `global.css` following the same
token-driven pattern, and prefer composing existing classes in markup.

## Project structure

```
src/
  styles/global.css        Tokens (@theme) + components — EDIT COLORS HERE
  styles/prose.css         MDX body styling (.sl-prose)
  layouts/
    BaseLayout.astro       <head>, fonts, Nav, footer. Has a `padForNav` prop.
    BlogPost.astro         Wraps MDX in .sl-prose + post header
  components/
    Nav.astro              Sticky pill nav (edit nav links here)
    Hero.astro             Hero + animated teal grid canvas (props: eyebrow/title/accent/subtitle)
    Card.astro             Generic card (title + icon + slot)
    PostCard.astro         Blog preview card
  content/blog/*.mdx       Blog posts
  content.config.ts        Blog frontmatter schema
  pages/
    index.astro            Home: hero band + work + latest posts + about
    blog/index.astro       Post list
    blog/[...slug].astro   Renders one post
    rss.xml.ts             RSS feed
public/favicon.svg
astro.config.mjs           site URL, integrations, static output, Shiki theme
```

## Conventions & gotchas

- **The home page is special.** Its hero sits in a `.sl-band` that visually
  extends *behind and above* the sticky nav. The band uses
  `margin-top: calc(-1 * var(--sl-nav-height))`, and the home page passes
  `padForNav={false}` to `BaseLayout`. Every *other* page uses the default
  `padForNav={true}` so content clears the floating nav. Preserve this when
  adding pages: only a full-bleed hero page sets `padForNav={false}`.
- **`--sl-nav-height` (88px)** ties together the nav height, the band overlap,
  and `scroll-padding-top` for anchor links. If you resize the nav, update this
  one token, not the individual rules.
- **Astro 5 content collections** use the glob loader. Post URLs come from
  `post.id`; render bodies with `const { Content } = await render(post)`.
  Don't use the old `post.slug` / `post.render()` API.
- **MDX can import components.** To use one in a post, import it with a relative
  path inside the `.mdx` file (see the sample post). Body styling comes from
  `.sl-prose` automatically — don't add inline styles to post content.
- **Adding a post:** create `src/content/blog/<name>.mdx` with frontmatter
  matching `content.config.ts` (title, description, pubDate, tags, draft).
  `draft: true` hides it from listings, RSS, and the build.
- **Tailwind is v4** (via `@tailwindcss/vite`, configured in `global.css` with
  `@import "tailwindcss"` + `@theme`). There is no `tailwind.config.js`. Don't
  add one or assume v3 behavior (no `@apply`-heavy patterns, no JS config).

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/  — run this to verify changes
npm run preview  # serve the production build
```

## Deploy (Cloudflare Pages)

Static build, no adapter. Build command `npm run build`, output dir `dist`.
Set the real domain in `astro.config.mjs` (`site:`) before launch — sitemap,
RSS, and canonical URLs depend on it. Only add `@astrojs/cloudflare` +
`output: "server"` if server routes or Workers functions are later required.

## Good tasks to ask for (and how they should be done)

- **New section/page** → reuse `.sl-section` / `.sl-container` / `.sl-card`;
  default `padForNav` stays true.
- **New component** → add a token-driven `.sl-*` class in `global.css`, build an
  `.astro` component, compose existing classes.
- **Tags or projects collection** → mirror the blog: new collection in
  `content.config.ts`, a list page, and a `[...slug]` route.
- **Color/brand tweak** → change the token in `global.css` (`@theme` + the
  `:root` mirror); never touch hex values in components.

## Out of scope unless asked

Dark mode, a second accent color, a CSS framework swap, a UI runtime
(React/Vue), or moving off static rendering. If a request seems to need one of
these, flag it and propose a token-driven or static alternative first.
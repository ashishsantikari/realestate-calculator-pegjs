# AGENTS.md

## Project
Real Estate PEG.js Calculator — a domain-specific expression evaluator built with PEG.js, Astro, and Tailwind CSS. The grammar is pre-compiled at build time; no PEG.js dependency at runtime.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start Astro dev server (localhost:4321) |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Preview the built `dist/` |
| `node src/compile.js` | Rebuild `generated/parser.js` from `src/grammar.pegjs` |

## Architecture

- **Build-time**: `src/pages/index.astro` frontmatter imports PEG.js and pre-compiles the grammar into `public/parser.js` (standalone, sets `window.PEGParser`)
- **Runtime**: The page loads `parser.js`, then an inline script uses `PEGParser.parse(input, { context })` — no PEG.js in the browser
- **Styling**: Tailwind CSS via `@astrojs/tailwind` integration — light/markdown theme, no custom CSS

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Main page (demo panel + docs panel) |
| `src/grammar.pegjs` | PEG.js grammar source (24 rules) |
| `public/parser.js` | Pre-compiled parser (auto-generated at build) |
| `src/calculator.js` | Calculator class (Node.js reference) |
| `src/compile.js` | Standalone grammar compiler |

## Grammar

The PEG.js grammar lives in `src/grammar.pegjs` and is duplicated in the Astro frontmatter. When modifying the grammar, update BOTH locations:

1. `src/grammar.pegjs` — source of truth for reference
2. Frontmatter `const GRAMMAR` string in `src/pages/index.astro`

## Code Conventions

- **No semicolons** in the inline `<script>` block
- **Tailwind classes only** — no custom CSS
- Short variable names in client JS (`p` for parser, `c` for context, `e` for expression, etc.)
- Async evaluation pipeline with generation counter for cancelation
- Error messages use single quotes in PEG.js action code to avoid escaping issues

## Layout

- Desktop: two-column grid (demo left, docs right)
- Mobile (<900px): single column, docs first, demo second
- The docs panel includes: What Is This, Background, Why PEG.js, Quick Start, Syntax Reference, Definitions, Walkthrough, Error Handling, Grammar, How It Works

## Build Output

```
dist/
├── index.html          (self-contained page)
├── parser.js           (pre-compiled PEG.js parser, ~35KB)
├── grammar.pegjs       (reference copy)
└── _astro/index.*.css  (Tailwind CSS, ~13KB)
```

# Real Estate PEG.js Calculator

A domain-specific expression evaluator powered by [PEG.js](https://pegjs.org/).  
Write formulas using natural real-estate terminology — square meters, thousands, rates per unit — and get instant numeric results with live error feedback.

Built during a brief stint at a real estate tech company in Berlin.

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:4321
```

## Features

- **Domain-specific grammar** — understands `400000 K SQ MTR`, `5 PER SQ MTR`, `@SHOP.space`, etc.
- **Real-time evaluation** — results and errors update as you type
- **Async pipeline** — non-blocking evaluation with cancelation for rapid input
- **Smart error suggestions** — typo detection via Levenshtein distance
- **Pre-compiled parser** — PEG.js runs at build time only; zero runtime dependency

## Usage

The page has two panels:

**Demo** (left) — Define references and write an expression:

```
GROUND_FLOOR - 400000 K SQ MTR
HEIGHT - 10 MTR
APARTMENT_1 = 30 SQ MTR
SHOP = {space: 100 SQ MTR, cost: 5 PER SQ MTR}
```

```
(@GROUND_FLOOR + @APARTMENT_1 + @SHOP.space) * @SHOP.cost
```

**Docs** (right) — Syntax reference, definitions format, walkthrough, and grammar.

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start Astro dev server |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Preview the build |
| `node src/compile.js` | Recompile grammar |

## Project Structure

```
├── src/
│   ├── pages/index.astro    Main page (demo + docs)
│   ├── grammar.pegjs        PEG.js grammar source
│   ├── calculator.js        Calculator class (Node.js reference)
│   └── compile.js           Grammar compiler script
├── public/
│   └── parser.js            Pre-compiled parser (auto-generated)
├── astro.config.mjs
├── tailwind.config.mjs
└── AGENTS.md
```

## Adapting to Other Domains

The same approach works for any domain — expense splitting, unit conversions, invoice math.  
Edit `src/grammar.pegjs` to define your own terminology and rebuild.

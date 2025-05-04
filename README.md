# MermaidUI Monorepo

A framework-agnostic Mermaid diagram auto-renderer for

- **Browser** via UMD/ESM
- **SSR** in Node.js
- **CLI** for batch SVG export

## Workspace Packages

- **mermaidui-core** – Core rendering library (ESM/CJS/UMD, SSR, DOM observer).
- **mermaidui-cli** – Command-line tool to convert Mermaid code to SVG.
- **mermaidui** – Vite-powered browser demo and playground.

---

## Prerequisites

- Node.js v20+ (LTS)
- pnpm v9+ (or npm/yarn with equivalent commands)

---

## Setup

```bash
# From monorepo root
pnpm install        # install dependencies
pnpm bootstrap      # bootstrap with Lerna & pnpm workspaces
```

## Development

```bash
# Build all packages
pnpm build

# Run tests across all packages
pnpm test

## (Optional) Lint core package
# (if ESLint configured)
# pnpm --filter mermaidui-core lint
```

### Development per package

```bash
# Core package
cd packages/core
pnpm build
pnpm test

# CLI package
cd ../cli
pnpm build
pnpm test

# UI demo
cd ../ui
pnpm dev       # start Vite server on http://localhost:5173
pnpm build     # produce static demo in dist/
```

---

## Usage

### Core Library

```ts
import { initMermaidUI, renderAll, renderOne } from "mermaidui-core";

// Auto-render all .mermaid blocks on page
initMermaidUI({ selector: ".mermaid", observer: true });

// Render a single code string
const svg = await renderOne("graph TD; A-->B;", "myId");
```

### CLI Tool

```bash
# install CLI globally
yarn global add mermaid-ui-cli
# or install globally with pnpm
pnpm add -g mermaid-ui-cli

# Convert file.mmd to file.svg
mermaidui -i file.mmd -o file.svg

# Read from STDIN
cat file.mmd | mermaidui > file.svg

# Pass custom Mermaid config
mermaidui -i chart.mmd -o chart.svg -c '{"theme":"forest"}'
```

### UI Demo

```bash
cd packages/ui
pnpm dev
# open http://localhost:5173 in browser
```

The UI lets you:

- Edit Mermaid code in a live textarea
- Load a local .mmd/.md/.txt file via the file picker
- See instant SVG render on the right panel

---

## Publishing Packages

1. Bump version in each `packages/*/package.json`.
2. Run `pnpm build` at monorepo root.
3. `cd packages/<name> && npm publish --access public`.

---

## Contributing

Feel free to open issues or pull requests. We follow the standard GitHub flow:

1. Fork the repository.
2. Create a feature branch.
3. Commit and push changes.
4. Open a PR against `main`.

Please include tests and update documentation.

---

## License

[MIT License](LICENSE)

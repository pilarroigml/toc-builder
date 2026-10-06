# Project log

## Step 0 — Setup (in progress, 6 October 2026)

### 1. What now exists and where
- Node.js v24.21.0 (LTS) and Git 2.56.0 installed on Pilar's computer.
- Project folder `toc-builder/` with Vite + React + TypeScript + Tailwind.
- A hello-world page. Its text lives in `content/ui.en.json`.
- Empty folders from the brief (`content/examples`, `src/components`, `src/pages`, `src/lib`, `src/schema`, `public`).
- `docs/BRIEF.md` (the full brief), `CLAUDE.md` (working rules for Claude Code), `README.md`.
- Not yet done: GitHub repository, automatic deploy, live URL.

### 2. How to run or open it
- In a terminal in `toc-builder/`, run `npm run dev` and open `http://localhost:5173/toc-builder/`.

### 3. How I'd know it broke
- `npm run build` shows red errors instead of "built in".
- The page is blank. On the live site this usually means the `base` setting in `vite.config.ts` doesn't match the repository name.

### 4. How to fix or change it
- Change the hello text in `content/ui.en.json`.
- Change the accent colour at the top of `src/index.css`.
- Repository renamed? Update `REPO_NAME` at the top of `vite.config.ts`.

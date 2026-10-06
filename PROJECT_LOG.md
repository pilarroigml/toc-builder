# Project log

## Step 2 — Guided form with autosave (done locally, 6 October 2026, waiting for Pilar's test)

### 1. What now exists and where
- Design chosen (mix of A and B, green accent), recorded in `docs/DESIGN.md`. Colours at the top of `src/index.css`.
- One screen per level, with numbered steps at the top (`src/components/ProgressSteps.tsx`). A step shows as filled once something is written in it.
- The form for each level (`src/components/LevelForm.tsx`) has the main answer, assumptions (one per line) and indicators (indicator, baseline, target, how we'll know). Indicators can be added and removed.
- Autosave to the browser's own storage on this device (`src/lib/draft.ts`). It also remembers which step you were on.
- "Clear my data" with a confirmation (`src/components/ClearDataButton.tsx`).
- All new wording in `content/ui.en.json`, including the question and hint for each level (`levelPrompts`). These are draft wording for review.
- The Step 1 plain-text page is gone. The guidance comes back beside the form in Step 3.

### 2. How to run or open it
- `npm run dev`, then open `http://localhost:5173/toc-builder/`.

### 3. How I'd know it broke
- Text disappears after refreshing the page. Saving may be blocked, and a red message under the form says so.
- A blank page means a code error. Press F12 and look at the "Console" tab for red messages.

### 4. How to fix or change it
- Questions, hints, button labels are all in `content/ui.en.json`.
- Colours at the top of `src/index.css`.
- Blank page in the local preview after edits? Stop and restart the preview (`npm run dev`). On Windows the preview occasionally misses a quick change.

### Noted for later
- Add a friendly "something went wrong" message instead of a blank page if the app ever crashes (Step 8).

## Step 1 — Content schema (done locally, 6 October 2026, waiting for Pilar's test)

### 1. What now exists and where
- Content rules in `src/schema/content.ts`. Allowed values (levels, statuses, sectors, user types) in `src/schema/lists.ts`.
- A content checker in `src/schema/validateContentPlugin.ts`, connected in `vite.config.ts`.
- `content/fields.en.json` with the Problem guidance (status draft).
- `content/examples/girls-secondary-school.json`, Example 1 (status needs-review).
- `content/ui.en.json` with all labels for this page.
- `content/sources.md` logging the sources used and checked.
- New dependencies. `zod` checks the content format during builds and isn't shipped to visitors. `@types/node` describes Node's built-in tools for the code spell-checker and contains no code that runs.

### 2. How to run or open it
- `npm run dev`, then open `http://localhost:5173/toc-builder/`. The page shows the Problem guidance, then Example 1 in full, as plain text.

### 3. How I'd know it broke
- A red box saying "CONTENT CHECK FAILED" in the preview, naming the file and the field.
- `npm run build` stops with the same message, and on GitHub the deploy fails and you get an email. The live site keeps the last good version.

### 4. How to fix or change it
- Edit wording in the `content/` files and save. The preview updates by itself.
- Read the red message. It says which file and which field. Common causes are a missing comma or quote, a misspelt key, or a value that isn't allowed.
- To allow a new sector or user type, add it in `src/schema/lists.ts`.

## Step 0 — Setup (done, 6 October 2026)

### 1. What now exists and where
- Node.js v24.21.0 (LTS) and Git 2.56.0 installed on Pilar's computer.
- Project folder `toc-builder/` with Vite + React + TypeScript + Tailwind.
- A hello-world page. Its text lives in `content/ui.en.json`.
- Empty folders from the brief (`content/examples`, `src/components`, `src/pages`, `src/lib`, `src/schema`, `public`).
- `docs/BRIEF.md` (the full brief), `CLAUDE.md` (working rules for Claude Code), `README.md`.
- GitHub repository at https://github.com/pilarroigml/toc-builder (public).
- Automatic deploy in `.github/workflows/deploy.yml`. Every push to `main` rebuilds and republishes the site.
- Live site at https://pilarroigml.github.io/toc-builder/

### 2. How to run or open it
- Live: open https://pilarroigml.github.io/toc-builder/
- On your computer: in a terminal in `toc-builder/`, run `npm run dev` and open `http://localhost:5173/toc-builder/`.

### 3. How I'd know it broke
- GitHub emails you that a workflow run failed. The repository's Actions tab shows a red cross.
- `npm run build` shows red errors instead of "built in".
- The live page is blank. This usually means the `base` setting in `vite.config.ts` doesn't match the repository name.
- If a build fails, the live site keeps the last working version, so visitors aren't affected.

### 4. How to fix or change it
- Change the hello text in `content/ui.en.json`.
- Change the accent colour at the top of `src/index.css`.
- Repository renamed? Update `REPO_NAME` at the top of `vite.config.ts`.
- Failed deploy? Open the failed run in the Actions tab and read the red step. It's usually the same error `npm run build` shows locally. Fix it, commit, and push again.
- Re-run a deploy by hand from Actions → "Deploy to GitHub Pages" → "Run workflow".

# Project log

## Step 5 — Quality checklist (done locally, 6 October 2026, waiting for Pilar's test)

### 1. What now exists and where
- `content/checklist.en.json` holds the eight rules: wording, words to look for, thresholds, sources and status. This is the official version for checkers to review.
- `src/lib/checklist.ts` runs the checks. It knows seven kinds of check (words in statements, no assumptions, no indicators, missing baseline or target, missing source of evidence, too many statements, long statement).
- `src/components/ChecklistBox.tsx` shows "Things to check" under the form for the current level. It only appears once something is written. Suggestions never block moving on.
- The content checker now also validates `checklist.en.json`, so a typo in a rule stops the build.
- Tested: Example 1 is clean on all six levels, and each of the eight rules triggers on a deliberate mistake.

### 2. How to run or open it
- `npm run dev`, open `http://localhost:5173/toc-builder/`, go to Outputs, and type "Improved attendance of girls".

### 3. How I'd know it broke
- No "Things to check" box appears after typing at a level.
- A rule flags things that are clearly fine. Adjust its words or threshold.

### 4. How to fix or change it
- To change a rule's wording, words or threshold, edit `content/checklist.en.json`. For example, change `"max": 6` for activities.
- To remove a rule, delete its block. To add a rule of an existing kind, copy a block and give it a new `id`.
- A new kind of check needs code in `src/lib/checklist.ts` and `src/schema/content.ts`.

## Step 4 — Diagram and logframe views (done, 6 October 2026)

### Part 2: the logframe
- `src/components/LogframeView.tsx` shows the logframe. Rows run top-down from long-term impact to activities, the usual donor order. The problem appears in a line above the table.
- Columns: level, description, indicator, baseline, target, source of evidence (means of verification), assumptions. Each indicator gets its own line within its level.
- On phones (narrower than 768 pixels), each level becomes a card with labelled fields, because the full table can't fit.
- `src/lib/logframe.ts` builds the rows. The CSV export (Step 7) will reuse it so both always match. Row order is set by `LOGFRAME_ORDER` at the top of that file.
- A third tab, "Logframe", sits next to "Build" and "Diagram".

### Part 1: the diagram

### 1. What now exists and where
- Chosen layout: a mix of option A and option B. Item cards in columns, problem and impact as coloured banners at each end, and each level's assumptions in a dashed box under it. Left to right on desktop, top to bottom on phones.
- `src/components/DiagramView.tsx` draws the diagram from whatever the user has typed. Each line becomes one card.
- `src/components/ViewTabs.tsx` switches between "Build" and "Diagram".
- `src/components/BuildView.tsx` holds the form, moved out of `App.tsx` to keep it readable.
- When nothing has been written, the diagram offers "See it with the worked example", which loads Example 1 into the user's own work. It only appears when the work is empty, so it never overwrites anything.
- Example 1's statements are now medium length (about 6 to 12 words) so they read well as cards. The form hint now says "One short line per statement, about 6 to 12 words. Put detail in the indicators."
- Not yet done: the logframe table (part 2).

### 2. How to run or open it
- `npm run dev`, open `http://localhost:5173/toc-builder/`, click "Diagram".

### 3. How I'd know it broke
- The Diagram tab is blank or shows an error. Press F12 and check the Console.
- On a phone, the page scrolls sideways.

### 4. How to fix or change it
- Colours come from the top of `src/index.css`. Wording ("Your theory of change", "Assumes", "Nothing yet") is in `content/ui.en.json`.
- To change which example is offered when the diagram is empty, edit `STARTER_EXAMPLE_ID` at the top of `src/App.tsx`.

## Step 3 — Guidance panel (done, 6 October 2026)

### Part 2: guidance content
- All six levels have draft guidance in `content/fields.en.json`, written as one running story (keeping girls in secondary school).
- Examples are invented but modelled on evaluated programmes (J-PAL, NBER, Population Council, World Bank Gender Innovation Labs, World Bank Economic Review). Evidence on household work comes from UNICEF and the World Bank.
- Every card ends with a note that evidence is context-specific.
- `docs/SOURCE-MAP.md` shows which source each part comes from, and which parts are own writing.
- `content/sources.md` logs every source, those checked and not used, open gaps, and why the 2016 Liberia blog was removed.
- Example 1 moved from "needs-review" to "draft".
- Next: Pilar's expert review after v1 (she worked with the Africa Gender Innovation Lab in 2026).

### Part 1: the panel

### 1. What now exists and where
- `src/components/GuidancePanel.tsx` shows the guidance for the current level: definition, strong example (green tint), weak example with what's wrong and an improved version (warm tint), tip, sources (open in a new tab) and content status.
- On a computer it sits beside the form and stays in view while scrolling. On a phone it appears just below the main answer box.
- Levels without guidance yet show "Guidance for this level is being written…" (text in `content/ui.en.json`).
- Only Problem has guidance so far. Part 2 adds guidance for the other five levels.
- The local preview now checks for file changes every 0.3 seconds (`vite.config.ts`), which fixes the "preview missed an edit" problem.

### 2. How to run or open it
- `npm run dev`, then open `http://localhost:5173/toc-builder/`. Go to step 1 to see the guidance.

### 3. How I'd know it broke
- The guidance card is empty or missing on step 1.
- A source link doesn't open. The monthly link check (Step 8) will catch dead links.

### 4. How to fix or change it
- Guidance text is in `content/fields.en.json`, one block per level.
- Wording such as "Guidance" or "Strong example" is in `content/ui.en.json`.

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

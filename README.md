# Theory of Change Builder (working name)

A free, browser-based tool that guides you through building a Theory of Change and a logframe. Everything runs in your browser. Nothing you type leaves your device.

Status: early setup. See `PROJECT_LOG.md` for progress and `docs/BRIEF.md` for the full brief.

## Run it on your computer

You need Node.js (LTS) and Git installed. Open a terminal in this folder, then:

```bash
npm install
```

Downloads the building blocks listed in `package.json`. You only need it once, or after the list changes.

```bash
npm run dev
```

Starts a local preview. Open the `localhost` address it prints. Press Ctrl+C in the terminal to stop it.

```bash
npm run build
```

Checks the code and builds the final site into `dist/`. If this fails, the live site won't update.

## Where things live

- `content/` holds all text, guidance, examples and sources. Most edits happen here.
- `src/` holds the app code.
- `.github/workflows/` holds the automatic deploy to GitHub Pages.

## Editing content

All text lives in `content/`.

- `ui.en.json` holds interface labels and buttons.
- `fields.en.json` holds the guidance for each level.
- `examples/` holds the worked examples, one file each. To add an example, copy an existing file, give it a new name, and set `"id"` to the same name (without `.json`).
- `sources.md` logs every source used.

Every file is checked against the rules in `src/schema/content.ts` (allowed values live in `src/schema/lists.ts`). If something is wrong, for example a missing comma, a misspelt key or a status that isn't allowed, you get a red "CONTENT CHECK FAILED" message naming the file and the field. It appears in the preview while editing, and the build stops on GitHub, so the live site is never broken.

Allowed `status` values are `draft`, `needs-review` and `reviewed-by-practitioner`.

## Maintenance reminder

Review the content by hand every quarter (January, April, July, October).

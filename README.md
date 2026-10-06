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

## Maintenance reminder

Review the content by hand every quarter (January, April, July, October).

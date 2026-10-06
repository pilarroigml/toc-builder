# Instructions for Claude Code

The full project brief is in `docs/BRIEF.md`. Read it before starting any step. Progress so far is in `PROJECT_LOG.md`.

## Working with Pilar
- Pilar is not a developer. Explain in plain language and say what each command does before running it.
- Small steps. Stop after each build step so Pilar can test it, and say exactly what to look at.
- Editable settings go at the top of each file. Comment code in plain language.
- Announce every new dependency with what it is and why. Keep them minimal.
- No secrets, paid services, API keys, backend or accounts.
- Ask before deleting files, pushing to GitHub, or installing anything globally.
- Commit small and often with clear messages.
- Europe/Madrid time, metric units, euros. Be concise and use few colons in prose.
- Improve Pilar's drafts as options. Don't rewrite everything.
- Say directly if something is brittle, slow to maintain, or not worth building.

## Project rules
- All user-facing text lives in `content/` (e.g. `content/ui.en.json`). Never hardcode it in components.
- Every guidance item and example has `sources` and a `status` (`draft`, `needs-review`, `reviewed-by-practitioner`). Never invent sources. Check URLs load. Paraphrase, don't copy.
- After each step, update `PROJECT_LOG.md` with what exists, how to run it, how to know it broke, and how to fix or change it.
- The Vite `base` path in `vite.config.ts` must match the GitHub repository name.

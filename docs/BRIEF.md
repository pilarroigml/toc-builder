# Project brief — Theory of Change Builder (working name, to be decided)

Read this whole file before doing anything. Then propose a plan for Step 0 and wait for my go-ahead.

---

## 1. Who I am and how to work with me

- I'm Pilar. I work in policy, strategy and partnerships. I follow logic well but I'm not a developer and I'm starting from zero in programming.
- Explain what you're doing in plain language. Say what each command does before I run it.
- Work in small steps. Stop after every step so I can test it. Tell me exactly what to look at and what "working" looks like.
- Put all editable settings at the top of each file. Comment code in plain language.
- Don't add a dependency without telling me what it is and why. Keep dependencies minimal.
- Never hardcode secrets. No paid services, no API keys, no backend, no accounts.
- Don't delete files, push to GitHub, or install anything globally without asking first.
- Commit small and often with clear messages. Ask before pushing.
- Times Europe/Madrid, metric units, euros. Be concise. Use fewer colons in written text.
- When I give you a draft of something (a design, a text), improve it as options. Don't rewrite everything.
- Tell me directly if something is brittle, slow to maintain, or not worth building.

---

## 2. What we're building

A free, browser-based tool that guides someone through building a Theory of Change and a logframe, with good guidance and worked examples inside it. It exports a one-page diagram and a logframe table.

The value is the quality of the guidance and examples. The code is the easy part. A generic form would just be a worse version of existing tools, so content quality comes first.

### Users
Primary user — a small NGO programme officer writing a grant application.

Other users, served through a "mode" selector that changes wording, prompts and which examples are shown, but never the structure of the tool.
- Students doing a case study or capstone project
- Researchers planning an impact pathway for a funding application
- Early-stage social entrepreneurs
- Community groups and volunteer projects
- Individuals planning their own project (learning, career, creative or civic)
- Reviewers or funders using it as a checklist to assess an application (stretch)

Design for the primary user first. Don't let the other modes bloat v1.

### Sectors covered
Research, international development, sustainability, and social impact in general.

### Language
English only for v1. Build it so adding languages later is easy. Every piece of text shown to users lives in `content/ui.en.json` or the content files, never hardcoded in components.

### What "working well" means
- Someone can complete a basic Theory of Change in 20 to 30 minutes.
- They can export a PDF of the diagram plus logframe, a PNG, and a CSV of the logframe.
- Everything runs in the browser. Nothing the user types ever leaves their device.
- It works on phone and desktop, and loads in under 3 seconds on a normal connection.
- Every piece of guidance has a source. Every example is labelled illustrative.
- A practitioner has reviewed the content before it's shared widely.

---

## 3. Scope

### In v1
1. Guided flow with these levels: Problem, Activities, Outputs, Outcomes (short and medium term), Long-term impact. Assumptions and Indicators attach to each level. (The practitioner may adjust this structure after review.)
2. Guidance panel beside each field with a definition, a strong example, a weak example with a fix, a tip, and source links.
3. Rule-based quality checklist ("common mistakes") that flags simple issues. Examples: outputs written with outcome language like "improved" or "increased", a level with no assumptions, an indicator with no baseline or target mentioned, too many activities, a problem statement that is really a solution.
4. Examples gallery, filterable by sector and by user type, with a button to load an example into the user's own canvas.
5. Diagram view using a fixed template. Left to right on desktop, top to bottom on mobile.
6. Logframe table view.
7. Export to PDF (print stylesheet), PNG, CSV. Save and load as a JSON file.
8. Autosave in the browser (localStorage) with a visible "clear my data" button.

### Out of v1 (do not build)
Accounts, backend, any AI or LLM calls, drag-and-drop editing, DOCX export, indicator library, other languages, analytics, collaboration features.

---

## 4. Architecture and why

- Vite + React + TypeScript + Tailwind CSS. Reason — Claude Code works reliably with this stack, and it stays maintainable as the app grows beyond a simple form.
- Static site only. Output is plain files, so hosting is free and there's nothing to run or secure.
- Hosting on GitHub Pages, deployed by a GitHub Action on every push to main. (Watch for the Vite `base` path setting, a common gotcha.)
- All content lives in `/content` as JSON and Markdown files, validated at build time with a schema (zod). A typo in content must fail the build, not break the live site.
- PDF export through a print stylesheet (CSS `@media print`). PNG through `html-to-image`. CSV generated in code. These are the most reliable client-side options.
- No analytics in v1.

### Suggested folder structure
```
/content
  ui.en.json            all interface text
  fields.en.json        guidance per level (definition, strong/weak examples, tips, sources)
  checklist.en.json     rules for the quality checklist
  examples/             one file per worked example
  sources.md            every source used, see section 5
/src
  components/ pages/ lib/ schema/
/public
.github/workflows/      deploy + monthly link check
PROJECT_LOG.md          kept up to date by Claude Code
README.md
```

---

## 5. Content rules (the most important part)

### Research protocol
- Draft guidance from credible, authoritative sources only. Prefer official or institutional pages over blogs.
- Every guidance item and example carries `sources` (title, organisation, URL, date accessed) and a `status` field with one of: `draft`, `needs-review`, `reviewed-by-practitioner`.
- Log every source in `content/sources.md` with the URL, date accessed, and what it was used for.
- If you can't verify a claim, mark it `needs-review` and tell me. Don't invent sources or attributions.
- Check every URL actually loads before adding it.

### Copyright and reuse
- Paraphrase everything in original words. Do not copy passages, diagrams, templates or tables from any source.
- At most one short quote (under 15 words) per source, only when exact wording matters.
- Link out to sources so users can read the originals.
- Check reuse terms before using any list, taxonomy or framework structure, and tell me what you find.
- My original content will be licensed separately. I'll decide the licence (candidates are CC BY 4.0 for content and MIT for code).

### Starting list of source types (verify each, this list is a starting point and not authoritative)
- Evaluation methods and guidance — BetterEvaluation, 3ie, J-PAL, IPA, OECD DAC evaluation criteria, UN Evaluation Group, World Bank Independent Evaluation Group
- Theory of Change specifically — Center for Theory of Change, NPC (New Philanthropy Capital), Kellogg Foundation logic model guidance
- Research uptake and impact pathways — ODI, IDRC, UKRI/ESRC impact guidance, European Commission guidance on Horizon Europe impact pathways
- Indicators — UN SDG indicator framework, IRIS+ (check terms before reuse)
- Donor logframe guidance — European Commission international partnerships guidance, other official donor pages that are currently live
- Be careful with agencies that have been dismantled or archived. Don't present their material as current guidance.

### Avoid
Content farms, SEO blogs, AI-written guides, paywalled material, and anything where I can't see who stands behind it.

### Examples
- All examples are invented and illustrative. Label each one clearly. No real clients, organisations or data.
- Each example has every field filled in, a short "why this works" annotation, and two "weak first draft → improved" pairs.
- Launch with the first four. Examples 5 and 6 are stretch goals. Make adding an example a matter of dropping in one file.

| # | Example | Sector | User type |
|---|---------|--------|-----------|
| 1 | Keeping girls in secondary school | Development, education, gender | Small NGO |
| 2 | Mobile savings groups for smallholder farmers | Development, financial inclusion | Small NGO |
| 3 | Community waste sorting and a small recycling enterprise | Sustainability | Small NGO or entrepreneur |
| 4 | Getting a policy research project into the hands of decision makers | Research | Researcher or think tank |
| 5 | A student-run food redistribution project (annotated for learning) | Social impact | Student |
| 6 | A neighbourhood community garden, or a personal learning project | Social impact | Community or individual |

---

## 6. Design

- Simple, calm and readable. Generous white space, one accent colour, one typeface (system fonts are fine).
- Mobile first. WCAG AA contrast. Fully keyboard navigable. Visible focus states.
- A clear progress indicator through the levels. One main action per screen. No clutter.
- Before building the diagram view, show me two layout options as simple mock-ups so I can choose.

---

## 7. Build steps (stop after each one)

**Step 0 — Setup**
Check what's installed (Node, Git). Tell me what's missing and how to install it. Create the repo structure and a "hello world" page that deploys to GitHub Pages.
Done when — I can open the live URL and see the page.

**Step 1 — Content schema**
Define the content schema. Add the Problem field's guidance and Example 1 as a first test, shown as plain text on screen.
Done when — I can edit a content file, see the change, and see the build fail if I break the format on purpose.

**Step 2 — Guided form with autosave**
One screen per level, a progress bar, autosave, "clear my data".
Done when — I can fill in two levels, refresh the page, and my text is still there.

**Step 3 — Guidance panel**
Show the guidance beside each field with sources.
Done when — every field shows definition, strong and weak example, tip, and links that open.

**Step 4 — Diagram and logframe views**
Show me the layout options first. Then build the chosen one.
Done when — a completed example renders cleanly on phone and desktop.

**Step 5 — Quality checklist**
Implement the rules from `checklist.en.json`.
Done when — I can type a bad output on purpose and see it flagged with an explanation.

**Step 6 — Examples gallery**
Filters by sector and user type, plus "load into my canvas".
Done when — loading an example fills the whole canvas and I can edit it.

**Step 7 — Exports**
PDF, PNG, CSV, JSON save and load.
Done when — I can export an example and open each file correctly.

**Step 8 — Polish and release**
Accessibility check, mobile check, README, footer with "content last reviewed" date, feedback link, monthly link-check GitHub Action.
Done when — the live site passes my checklist and the README explains how to update content.

---

## 8. After each step, tell me

1. What now exists and where.
2. How to run or open it.
3. How I'd know it broke.
4. How to fix it or change it.

Keep `PROJECT_LOG.md` updated after every step with those four points.

---

## 9. Maintenance and "how I know it broke"

- GitHub emails me if the build or deploy fails.
- A monthly link-check action reports dead source links.
- The footer shows the date the content was last reviewed.
- I review the content by hand every quarter. Put a reminder note in the README.

---

## 10. Final project log (fill in at the end)

- What exists
- Where it runs
- What it connects to
- What to check if it fails
- Open questions for the practitioner review

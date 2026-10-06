// The "shape" every content file must follow.
// When the site builds, each file in /content is checked against these rules.
// If a file breaks a rule (missing field, misspelt key, wrong status...), the build stops
// and tells you which file and which line is wrong. The live site is never touched.
//
// To add a new allowed value (a new sector, for example), edit src/schema/lists.ts.

import { z } from 'zod'
import { LEVEL_IDS, SECTORS, STATUSES, USER_TYPES } from './lists.ts'

const text = z.string().trim().min(1, 'This text cannot be empty')

// A source we relied on. Every guidance item and example needs at least one.
export const SourceSchema = z.strictObject({
  title: text,
  organisation: text,
  url: z.url({ message: 'This must be a full web address starting with https://' }),
  accessed: z.iso.date({ message: 'Date accessed must look like 2026-10-06' }),
})

const LevelId = z.enum(LEVEL_IDS)
const Status = z.enum(STATUSES)
const Sources = z.array(SourceSchema).min(1, 'Add at least one source')

// ---------- Interface text (content/ui.en.json) ----------

const levelNames = z.strictObject(
  Object.fromEntries(LEVEL_IDS.map((id) => [id, text])) as Record<(typeof LEVEL_IDS)[number], typeof text>,
)
const statusNames = z.strictObject({
  draft: text,
  'needs-review': text,
  'reviewed-by-practitioner': text,
})

const levelPrompts = z.strictObject(
  Object.fromEntries(
    LEVEL_IDS.map((id) => [id, z.strictObject({ question: text, hint: text })]),
  ) as Record<(typeof LEVEL_IDS)[number], z.ZodObject<{ question: typeof text; hint: typeof text }>>,
)

export const UiSchema = z.strictObject({
  appTitle: text,
  intro: text,
  themeLabel: text,
  themeAuto: text,
  themeLight: text,
  themeDark: text,
  viewsLabel: text,
  viewBuild: text,
  viewDiagram: text,
  viewLogframe: text,
  viewExamples: text,
  galleryTitle: text,
  galleryIntro: text,
  filterSector: text,
  filterUserType: text,
  filterAll: text,
  galleryNone: text,
  galleryMore: text,
  loadIntoCanvas: text,
  loadConfirm: text,
  loadConfirmYes: text,
  loadedNotice: text,
  sectorNames: z.strictObject(
    Object.fromEntries(SECTORS.map((id) => [id, text])) as Record<(typeof SECTORS)[number], typeof text>,
  ),
  userTypeNames: z.strictObject(
    Object.fromEntries(USER_TYPES.map((id) => [id, text])) as Record<(typeof USER_TYPES)[number], typeof text>,
  ),
  logframeTitle: text,
  logframeProblem: text,
  logframeColLevel: text,
  logframeColDescription: text,
  diagramTitle: text,
  diagramEmpty: text,
  diagramLoadExample: text,
  diagramNothingYet: text,
  assumesLabel: text,
  modeLabel: text,
  modeNotSure: text,
  tailoredFor: text,
  seeExampleInFull: text,
  progressLabel: text,
  stepOf: text,
  goToStep: text,
  stepDone: text,
  stepCurrent: text,
  back: text,
  nextTo: text,
  lastStepNotice: text,
  statementsLabel: text,
  onePerLine: text,
  assumptionsHint: text,
  indicatorsHint: text,
  indicatorLabel: text,
  indicatorNumber: text,
  addIndicator: text,
  removeIndicator: text,
  checklistHeading: text,
  checklistNone: text,
  checklistFound: text,
  checklistIndicators: text,
  checklistCount: text,
  checklistHowToFix: text,
  savedNotice: text,
  saveFailed: text,
  clearData: text,
  clearConfirm: text,
  clearConfirmYes: text,
  cancel: text,
  levelPrompts,
  guidanceComingSoon: text,
  evidenceContextNote: text,
  guidanceHeading: text,
  definitionLabel: text,
  strongExampleLabel: text,
  weakExampleLabel: text,
  whatIsWrongLabel: text,
  improvedLabel: text,
  tipLabel: text,
  sourcesLabel: text,
  accessedLabel: text,
  statusLabel: text,
  exampleHeading: text,
  illustrativeNotice: text,
  summaryLabel: text,
  whyThisWorksLabel: text,
  assumptionsLabel: text,
  indicatorsLabel: text,
  baselineLabel: text,
  targetLabel: text,
  meansOfVerificationLabel: text,
  draftPairsLabel: text,
  weakDraftLabel: text,
  improvedDraftLabel: text,
  whyLabel: text,
  levelNames,
  statusNames,
})

// ---------- Guidance per level (content/fields.en.json) ----------

const WeakExampleSchema = z.strictObject({
  text,
  whatIsWrong: text,
  improved: text,
})

// A version of the guidance tailored to one user type (e.g. social entrepreneur).
// The definition stays shared; examples, tip and sources change.
const GuidanceVariantSchema = z.strictObject({
  strongExample: text,
  weakExample: WeakExampleSchema,
  tip: text,
  sources: Sources,
  status: Status,
})

export const FieldGuidanceSchema = z.strictObject({
  level: LevelId,
  definition: text,
  // The main version (written for NGOs, using the girls' secondary school story).
  strongExample: text,
  weakExample: WeakExampleSchema,
  tip: text,
  sources: Sources,
  status: Status,
  // Optional tailored versions, keyed by user type. Missing ones fall back to the main version.
  variants: z.partialRecord(z.enum(USER_TYPES), GuidanceVariantSchema).optional(),
})

export const FieldsSchema = z.strictObject({
  fields: z.array(FieldGuidanceSchema).min(1),
})

// ---------- Worked examples (content/examples/*.json) ----------

// An indicator, as it would appear in a logframe.
const IndicatorSchema = z.strictObject({
  text,
  baseline: text,
  target: text,
  meansOfVerification: text,
})

// What one level of the Theory of Change contains.
const LevelContentSchema = z.strictObject({
  items: z.array(text).min(1, 'Each level needs at least one statement'),
  assumptions: z.array(text),
  indicators: z.array(IndicatorSchema),
})

export const ExampleSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only'),
  // Position in the gallery: 1 comes first.
  order: z.number().int().min(1),
  title: text,
  illustrative: z.literal(true, { message: 'Every example must be marked "illustrative": true' }),
  sectors: z.array(z.enum(SECTORS)).min(1),
  userTypes: z.array(z.enum(USER_TYPES)).min(1),
  summary: text,
  whyThisWorks: text,
  levels: z.strictObject(
    Object.fromEntries(LEVEL_IDS.map((id) => [id, LevelContentSchema])) as Record<
      (typeof LEVEL_IDS)[number],
      typeof LevelContentSchema
    >,
  ),
  draftPairs: z
    .array(
      z.strictObject({
        level: LevelId,
        weak: text,
        improved: text,
        why: text,
      }),
    )
    .length(2, 'Each example needs exactly two "weak first draft → improved" pairs'),
  sources: Sources,
  status: Status,
})

// ---------- Quality checklist (content/checklist.en.json) ----------
// Each rule names a "check": one of the kinds of check the app knows how to run
// (see src/lib/checklist.ts). The wording, levels and thresholds are all editable here.

const ruleBase = {
  id: z.string().regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only'),
  levels: z.array(LevelId).min(1),
  title: text,
  explanation: text,
  fix: text,
  sources: Sources,
  status: Status,
}

export const ChecklistRuleSchema = z.discriminatedUnion('check', [
  z.strictObject({ ...ruleBase, check: z.literal('wordsInStatements'), words: z.array(text).min(1) }),
  z.strictObject({ ...ruleBase, check: z.literal('noAssumptions') }),
  z.strictObject({ ...ruleBase, check: z.literal('noIndicators') }),
  z.strictObject({ ...ruleBase, check: z.literal('indicatorMissingBaselineOrTarget') }),
  z.strictObject({ ...ruleBase, check: z.literal('indicatorMissingSource') }),
  z.strictObject({ ...ruleBase, check: z.literal('tooManyStatements'), max: z.number().int().min(1) }),
  z.strictObject({ ...ruleBase, check: z.literal('longStatement'), maxWords: z.number().int().min(1) }),
])

export const ChecklistSchema = z.strictObject({
  rules: z.array(ChecklistRuleSchema).min(1),
})

// Types the app code uses, derived from the rules above so they never drift apart.
export type ChecklistRule = z.infer<typeof ChecklistRuleSchema>
export type Ui = z.infer<typeof UiSchema>
export type FieldGuidance = z.infer<typeof FieldGuidanceSchema>
export type Example = z.infer<typeof ExampleSchema>
export type LevelId = z.infer<typeof LevelId>
export type Source = z.infer<typeof SourceSchema>

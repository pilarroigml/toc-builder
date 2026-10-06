// "Things to check": the quality checklist results for the current level.
// Shown under the form while the user types. Suggestions only, never errors.

import type { LevelId } from '../schema/content'
import { fill, ui } from '../lib/content'
import { runChecks } from '../lib/checklist'
import { levelHasContent, type LevelDraft } from '../lib/draft'

// Which label to put in front of the extra detail, per kind of check.
const detailLabel = (check: string) => {
  if (check === 'indicatorMissingBaselineOrTarget' || check === 'indicatorMissingSource') return ui.checklistIndicators
  if (check === 'tooManyStatements') return ui.checklistCount
  return ui.checklistFound
}

export default function ChecklistBox({ level, value }: { level: LevelId; value: LevelDraft }) {
  // Nothing written yet: stay quiet.
  if (!levelHasContent(value)) return null
  const findings = runChecks(level, value)

  return (
    <section aria-labelledby="checklist-title" className="rounded-lg border border-line-soft bg-white p-4">
      <h3 id="checklist-title" className="font-semibold">
        {ui.checklistHeading}
      </h3>

      {findings.length === 0 ? (
        <p className="mt-1 text-sm text-accent">✓ {ui.checklistNone}</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">{fill(ui.checklistCountIntro, { count: findings.length })}</p>
          <ul className="mt-3 space-y-3">
            {findings.map(({ rule, detail }) => (
              <li key={rule.id} className="border-l-4 border-warn bg-weak-tint/60 py-2 pl-3 pr-2 text-sm">
                <p className="font-semibold">{rule.title}</p>
                {detail && (
                  <p className="mt-0.5 text-muted">
                    {detailLabel(rule.check)}: {detail}
                  </p>
                )}
                <p className="mt-1">{rule.explanation}</p>
                <p className="mt-1">
                  <span className="font-semibold">{ui.checklistHowToFix}.</span> {rule.fix}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

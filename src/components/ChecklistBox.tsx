// Quality checklist suggestions, shown right under the box they are about
// (the answer, the assumptions or the indicators). Suggestions only, never errors.

import { ui } from '../lib/content'
import type { Finding } from '../lib/checklist'

// Which label to put in front of the extra detail, per kind of check.
const detailLabel = (check: string) => {
  if (check === 'indicatorMissingBaselineOrTarget' || check === 'indicatorMissingSource') return ui.checklistIndicators
  if (check === 'tooManyStatements') return ui.checklistCount
  return ui.checklistFound
}

type Props = {
  findings: Finding[]
  // The id lets the box above point to these suggestions, so screen readers read them out.
  id: string
}

export default function ChecklistBox({ findings, id }: Props) {
  if (findings.length === 0) return null
  return (
    <div id={id} className="mt-2 space-y-2" aria-label={ui.checklistHeading}>
      {findings.map(({ rule, detail }) => (
        <div key={rule.id} className="border-l-4 border-warn bg-weak-tint/60 py-2 pl-3 pr-2 text-sm">
          <p className="font-semibold">
            <span className="sr-only">{ui.checklistHeading}: </span>
            {rule.title}
          </p>
          {detail && (
            <p className="mt-0.5 text-muted">
              {detailLabel(rule.check)}: {detail}
            </p>
          )}
          <p className="mt-1">{rule.explanation}</p>
          <p className="mt-1">
            <span className="font-semibold">{ui.checklistHowToFix}.</span> {rule.fix}
          </p>
        </div>
      ))}
    </div>
  )
}

// The form for one level: the main answer, its assumptions, and its indicators.
// Quality checklist suggestions appear right under the box they are about.

import { useId, type ReactNode } from 'react'
import type { LevelId } from '../schema/content'
import { emptyIndicator, levelHasContent, type IndicatorDraft, type LevelDraft } from '../lib/draft'
import { fill, ui } from '../lib/content'
import { fieldFor, runChecks, type FormField } from '../lib/checklist'
import ChecklistBox from './ChecklistBox'

type Props = {
  level: LevelId
  value: LevelDraft
  onChange: (value: LevelDraft) => void
  // Guidance shown right after the main answer on phones and small screens.
  // (On wide screens it sits beside the form instead, see App.tsx.)
  guidanceOnSmallScreens?: ReactNode
}

// Shared look for text boxes.
const boxClass =
  'mt-1 block w-full rounded-md border border-line bg-white px-3 py-2 text-base text-ink placeholder:text-muted'

export default function LevelForm({ level, value, onChange, guidanceOnSmallScreens }: Props) {
  const id = useId()
  const prompt = ui.levelPrompts[level]

  // Run the checklist and sort its suggestions by the box they belong under.
  const findings = runChecks(level, value)
  const findingsFor = (field: FormField) => findings.filter((f) => fieldFor(f.rule.check) === field)
  const statementFindings = findingsFor('statements')
  const assumptionFindings = findingsFor('assumptions')
  const indicatorFindings = findingsFor('indicators')
  // Screen readers read a box's hint, then any suggestions about it.
  const describedBy = (field: FormField, hasFindings: boolean) =>
    `${id}-${field}-hint${hasFindings ? ` ${id}-${field}-checks` : ''}`

  const updateIndicator = (index: number, changes: Partial<IndicatorDraft>) =>
    onChange({
      ...value,
      indicators: value.indicators.map((ind, i) => (i === index ? { ...ind, ...changes } : ind)),
    })

  return (
    <div className="space-y-8">
      {/* Main answer */}
      <div>
        <label htmlFor={`${id}-statements`} className="block text-lg font-medium">
          {prompt.question}
        </label>
        <p id={`${id}-statements-hint`} className="text-sm text-muted">
          {prompt.hint} {level !== 'problem' && ui.onePerLine}
        </p>
        <textarea
          id={`${id}-statements`}
          aria-describedby={describedBy('statements', statementFindings.length > 0)}
          rows={5}
          value={value.statements}
          onChange={(e) => onChange({ ...value, statements: e.target.value })}
          className={boxClass}
        />
        <ChecklistBox id={`${id}-statements-checks`} findings={statementFindings} />
        {/* Something written and nothing to flag anywhere at this level: say so */}
        {levelHasContent(value) && findings.length === 0 && (
          <p className="mt-2 text-sm text-accent">✓ {ui.checklistNone}</p>
        )}
      </div>

      {guidanceOnSmallScreens && <div className="lg:hidden">{guidanceOnSmallScreens}</div>}

      {/* Assumptions */}
      <div>
        <label htmlFor={`${id}-assumptions`} className="block font-medium">
          {ui.assumptionsLabel}
        </label>
        <p id={`${id}-assumptions-hint`} className="text-sm text-muted">
          {ui.assumptionsHint}
        </p>
        <textarea
          id={`${id}-assumptions`}
          aria-describedby={describedBy('assumptions', assumptionFindings.length > 0)}
          rows={3}
          value={value.assumptions}
          onChange={(e) => onChange({ ...value, assumptions: e.target.value })}
          className={boxClass}
        />
        <ChecklistBox id={`${id}-assumptions-checks`} findings={assumptionFindings} />
      </div>

      {/* Indicators */}
      <fieldset>
        <legend className="font-medium">{ui.indicatorsLabel}</legend>
        <p id={`${id}-indicators-hint`} className="text-sm text-muted">{ui.indicatorsHint}</p>

        {value.indicators.map((indicator, index) => {
          const number = index + 1
          const fields: { key: keyof IndicatorDraft; label: string }[] = [
            { key: 'text', label: ui.indicatorLabel },
            { key: 'baseline', label: ui.baselineLabel },
            { key: 'target', label: ui.targetLabel },
            { key: 'meansOfVerification', label: ui.meansOfVerificationLabel },
          ]
          return (
            <div key={index} className="mt-3 rounded-lg border border-line-soft bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted">{fill(ui.indicatorNumber, { number })}</p>
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...value, indicators: value.indicators.filter((_, i) => i !== index) })
                  }
                  aria-label={fill(ui.removeIndicator, { number })}
                  className="flex h-11 w-11 items-center justify-center rounded-md text-xl text-muted hover:bg-paper"
                >
                  ×
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.key} className={field.key === 'text' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={`${id}-ind-${index}-${field.key}`} className="block text-sm">
                      {field.label}
                    </label>
                    <input
                      id={`${id}-ind-${index}-${field.key}`}
                      type="text"
                      value={indicator[field.key]}
                      onChange={(e) => updateIndicator(index, { [field.key]: e.target.value })}
                      className={boxClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <button
          type="button"
          onClick={() => onChange({ ...value, indicators: [...value.indicators, emptyIndicator()] })}
          className="mt-3 min-h-11 rounded-md border border-accent px-4 text-accent hover:bg-accent-tint"
        >
          + {ui.addIndicator}
        </button>
        <ChecklistBox id={`${id}-indicators-checks`} findings={indicatorFindings} />
      </fieldset>
    </div>
  )
}

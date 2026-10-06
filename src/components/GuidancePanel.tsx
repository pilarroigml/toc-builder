// The guidance card for one level: definition, strong example, weak example with a fix,
// a tip, a similar project matching the user's type, and sources.
// The text comes from content/fields.en.json and content/examples.

import type { LevelId } from '../schema/content'
import { fields, ui } from '../lib/content'
import type { Mode } from '../lib/mode'
import SourceList from './SourceList'
import SimilarProject from './SimilarProject'

type Props = {
  level: LevelId
  mode: Mode
  onSeeExamples: () => void
}

export default function GuidancePanel({ level, mode, onSeeExamples }: Props) {
  const guidance = fields.find((field) => field.level === level)

  return (
    <aside
      aria-label={`${ui.guidanceHeading}, ${ui.levelNames[level]}`}
      className="rounded-xl border border-line-soft bg-surface p-5 text-[0.95rem] leading-relaxed"
    >
      <h3 className="font-semibold text-accent">{ui.guidanceHeading}</h3>

      {!guidance ? (
        <p className="mt-2 text-muted">{ui.guidanceComingSoon}</p>
      ) : (
        <>
          <h4 className="mt-3 text-sm font-semibold">{ui.definitionLabel}</h4>
          <p>{guidance.definition}</p>

          <div className="mt-4 rounded-md bg-accent-tint p-3">
            <h4 className="text-sm font-semibold text-accent">{ui.strongExampleLabel}</h4>
            <p>{guidance.strongExample}</p>
          </div>

          <div className="mt-3 rounded-md bg-weak-tint p-3">
            <h4 className="text-sm font-semibold">{ui.weakExampleLabel}</h4>
            <p>{guidance.weakExample.text}</p>
            <p className="mt-2">
              <span className="font-semibold">{ui.whatIsWrongLabel}.</span> {guidance.weakExample.whatIsWrong}
            </p>
            <p className="mt-2">
              <span className="font-semibold">{ui.improvedLabel}.</span> {guidance.weakExample.improved}
            </p>
          </div>

          <h4 className="mt-4 text-sm font-semibold">{ui.tipLabel}</h4>
          <p>{guidance.tip}</p>

          {/* "key" starts again at the best match whenever the user type changes */}
          <SimilarProject key={mode} level={level} mode={mode} onSeeExamples={onSeeExamples} />

          <SourceList sources={guidance.sources} />

          <p className="mt-4 text-sm text-muted">{ui.evidenceContextNote}</p>

          <p className="mt-4 text-xs text-muted">
            {ui.statusLabel}. {ui.statusNames[guidance.status]}
          </p>
        </>
      )}
    </aside>
  )
}

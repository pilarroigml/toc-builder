// The guidance card for one level: definition, strong example, weak example with a fix,
// a tip, and sources. The text comes from content/fields.en.json.
//
// The definition is shared by everyone. The examples, tip and sources are tailored to the
// user type chosen in "Who are you building this for?" when a tailored version exists
// (the "variants" in fields.en.json); otherwise the main version is shown.

import type { LevelId } from '../schema/content'
import { fields, ui } from '../lib/content'
import type { Mode } from '../lib/mode'
import SourceList from './SourceList'

type Props = {
  level: LevelId
  mode: Mode
  onSeeExamples: () => void
}

export default function GuidancePanel({ level, mode, onSeeExamples }: Props) {
  const guidance = fields.find((field) => field.level === level)
  const variant = guidance && mode !== '' ? guidance.variants?.[mode] : undefined
  // Tailored parts if there is a version for this user type, otherwise the main version.
  const shown = variant ?? guidance

  return (
    <aside
      aria-label={`${ui.guidanceHeading}, ${ui.levelNames[level]}`}
      className="rounded-xl border border-line-soft bg-surface p-5 text-[0.95rem] leading-relaxed"
    >
      <h3 className="font-semibold text-accent">{ui.guidanceHeading}</h3>
      {variant && mode !== '' && (
        <p className="mt-0.5 text-xs text-muted">{`${ui.tailoredFor} ${ui.userTypeNames[mode]}`}</p>
      )}

      {!guidance || !shown ? (
        <p className="mt-2 text-muted">{ui.guidanceComingSoon}</p>
      ) : (
        <>
          <h4 className="mt-3 text-sm font-semibold">{ui.definitionLabel}</h4>
          <p>{guidance.definition}</p>

          <div className="mt-4 rounded-md bg-accent-tint p-3">
            <h4 className="text-sm font-semibold text-accent">{ui.strongExampleLabel}</h4>
            <p>{shown.strongExample}</p>
          </div>

          <div className="mt-3 rounded-md bg-weak-tint p-3">
            <h4 className="text-sm font-semibold">{ui.weakExampleLabel}</h4>
            <p>{shown.weakExample.text}</p>
            <p className="mt-2">
              <span className="font-semibold">{ui.whatIsWrongLabel}.</span> {shown.weakExample.whatIsWrong}
            </p>
            <p className="mt-2">
              <span className="font-semibold">{ui.improvedLabel}.</span> {shown.weakExample.improved}
            </p>
          </div>

          <h4 className="mt-4 text-sm font-semibold">{ui.tipLabel}</h4>
          <p>{shown.tip}</p>

          <button type="button" onClick={onSeeExamples} className="mt-3 min-h-11 text-sm text-accent underline">
            {ui.seeExampleInFull}
          </button>

          <SourceList sources={shown.sources} />

          <p className="mt-4 text-sm text-muted">{ui.evidenceContextNote}</p>

          <p className="mt-4 text-xs text-muted">
            {ui.statusLabel}. {ui.statusNames[shown.status]}
          </p>
        </>
      )}
    </aside>
  )
}

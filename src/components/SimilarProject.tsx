// "In a similar project": how a worked example matching the user's type handled this level.
// Shown at the bottom of the guidance panel. Users can flick to another matching example
// or go to the gallery to see it in full.

import { useState } from 'react'
import type { LevelId } from '../schema/content'
import { ui } from '../lib/content'
import { examplesForMode, type Mode } from '../lib/mode'

type Props = {
  level: LevelId
  mode: Mode
  onSeeExamples: () => void
}

export default function SimilarProject({ level, mode, onSeeExamples }: Props) {
  const candidates = examplesForMode(mode)
  const [index, setIndex] = useState(0)
  if (candidates.length === 0) return null
  const example = candidates[index % candidates.length]
  const content = example.levels[level]

  return (
    <div className="mt-5 border-t border-line-soft pt-4">
      <h4 className="text-sm font-semibold text-accent">{ui.similarHeading}</h4>
      <p className="mt-0.5 font-medium">{example.title}</p>
      <ul className="mt-2 space-y-1.5">
        {content.items.map((item) => (
          <li key={item} className="rounded-md border border-line-soft bg-paper px-2 py-1.5 text-sm">
            {item}
          </li>
        ))}
      </ul>
      {content.assumptions.length > 0 && (
        <p className="mt-2 text-sm text-muted">
          <span className="font-semibold text-ink">{ui.assumesLabel}</span> {content.assumptions.join('. ')}
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-x-4">
        {candidates.length > 1 && (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="min-h-11 text-sm text-accent underline"
          >
            {ui.similarAnother}
          </button>
        )}
        <button type="button" onClick={onSeeExamples} className="min-h-11 text-sm text-accent underline">
          {ui.similarSeeAll}
        </button>
      </div>
    </div>
  )
}

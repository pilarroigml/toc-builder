// The numbered steps at the top (1 to 6). Each number is a button that jumps to that level.
// Steps with something written in them are filled, the current step is outlined,
// empty steps are pale.

import { LEVEL_IDS } from '../schema/lists'
import { fill, ui } from '../lib/content'

type Props = {
  current: number
  // For each level, whether the user has written anything in it yet.
  hasContent: boolean[]
  onSelect: (step: number) => void
}

export default function ProgressSteps({ current, hasContent, onSelect }: Props) {
  const total = LEVEL_IDS.length
  return (
    <nav aria-label={ui.progressLabel}>
      <ol className="flex items-center">
        {LEVEL_IDS.map((id, index) => {
          const state = index === current ? 'current' : hasContent[index] ? 'done' : 'todo'
          const label = fill(ui.goToStep, { number: index + 1, level: ui.levelNames[id] })
          return (
            <li key={id} className="flex items-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={`h-0.5 w-2.5 sm:w-6 ${state === 'todo' ? 'bg-line-soft' : 'bg-accent'}`}
                />
              )}
              {/* The button is 44px for easy tapping; the visible circle inside is smaller. */}
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={state === 'current' ? 'step' : undefined}
                aria-label={
                  state === 'done' ? `${label} (${ui.stepDone})` : state === 'current' ? `${label} (${ui.stepCurrent})` : label
                }
                className="group flex h-11 w-11 items-center justify-center rounded-full"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm group-hover:ring-2 group-hover:ring-accent/40 ${
                    state === 'done'
                      ? 'bg-accent text-on-accent'
                      : state === 'current'
                        ? 'border-2 border-accent bg-surface font-semibold text-accent'
                        : 'bg-line-soft text-muted'
                  }`}
                >
                  {index + 1}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="mt-1 text-sm text-muted">
        {fill(ui.stepOf, { current: current + 1, total, level: ui.levelNames[LEVEL_IDS[current]] })}
      </p>
    </nav>
  )
}

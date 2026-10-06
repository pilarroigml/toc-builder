// The one-page diagram of the user's theory of change.
// Desktop: left to right, with the problem and impact as coloured banners at each end.
// Phone: the same pieces stacked top to bottom.
// Each line the user typed becomes one card. Each level's assumptions sit underneath it.
// Design decisions are in docs/DESIGN.md.

import { LEVEL_IDS } from '../schema/lists'
import type { LevelId } from '../schema/content'
import { ui } from '../lib/content'
import { toLines, type Draft } from '../lib/draft'

type Props = {
  draft: Draft
  // The id lets the PNG export (Step 7) find the diagram on the page.
  id?: string
}

// Problem and impact are drawn as banners; the levels in between as columns of cards.
const BANNER_LEVELS: LevelId[] = ['problem', 'impact']

export default function DiagramView({ draft, id = 'toc-diagram' }: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="rounded-xl border border-line-soft bg-paper p-4 sm:p-6">
      <h2 id={`${id}-title`} className="text-lg font-semibold">
        {ui.diagramTitle}
      </h2>

      {/* One list of levels. Stacked on phones, a row of columns on wide screens. */}
      <ol className="mt-4 flex flex-col lg:flex-row lg:items-start">
        {LEVEL_IDS.map((levelId, index) => {
          const statements = toLines(draft.levels[levelId].statements)
          const assumptions = toLines(draft.levels[levelId].assumptions)
          const isBanner = BANNER_LEVELS.includes(levelId)
          const isImpact = levelId === 'impact'

          return (
            <li key={levelId} className="flex flex-col lg:flex-1 lg:flex-row lg:min-w-0">
              {/* Arrow from the previous level: down on phones, right on wide screens */}
              {index > 0 && (
                <span aria-hidden="true" className="py-1 text-center text-lg text-accent lg:px-1 lg:pt-8">
                  <span className="lg:hidden">↓</span>
                  <span className="hidden lg:inline">›</span>
                </span>
              )}

              <div className="min-w-0 flex-1">
                {isBanner ? (
                  <div
                    className={`rounded-lg p-3 text-sm leading-snug lg:text-xs ${
                      isImpact ? 'bg-accent text-on-accent' : 'bg-weak-tint text-ink'
                    }`}
                  >
                    <h3 className={`mb-1 text-xs font-semibold ${isImpact ? 'text-accent-tint' : 'text-problem'}`}>
                      {ui.levelNames[levelId]}
                    </h3>
                    {statements.length > 0 ? (
                      statements.map((line) => <p key={line}>{line}</p>)
                    ) : (
                      <p className="italic opacity-80">{ui.diagramNothingYet}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <h3 className="mb-1 text-xs font-semibold text-accent">{ui.levelNames[levelId]}</h3>
                    {statements.length > 0 ? (
                      <ul className="space-y-1.5">
                        {statements.map((line) => (
                          <li
                            key={line}
                            className="rounded-md border border-line-soft bg-surface px-2 py-1.5 text-sm leading-snug lg:text-xs"
                          >
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm italic text-muted lg:text-xs">{ui.diagramNothingYet}</p>
                    )}
                  </>
                )}

                {assumptions.length > 0 && (
                  <div className="mt-2 rounded-md border border-dashed border-line px-2 py-1.5 text-xs leading-snug text-muted">
                    <span className="font-semibold text-ink">{ui.assumesLabel}</span>{' '}
                    {assumptions.join('. ')}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

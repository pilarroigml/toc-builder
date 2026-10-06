// The "Build" view: progress steps, the form for the current level, and guidance beside it.

import { useEffect, useRef } from 'react'
import { LEVEL_IDS } from '../schema/lists'
import { fill, ui } from '../lib/content'
import { levelHasContent, type Draft, type LevelDraft } from '../lib/draft'
import ProgressSteps from './ProgressSteps'
import LevelForm from './LevelForm'
import GuidancePanel from './GuidancePanel'
import ChecklistBox from './ChecklistBox'

type Props = {
  draft: Draft
  onChange: (update: (draft: Draft) => Draft) => void
  saveWorks: boolean
}

export default function BuildView({ draft, onChange, saveWorks }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  const step = draft.currentStep
  const level = LEVEL_IDS[step]
  const isLast = step === LEVEL_IDS.length - 1

  // When moving to another level, go back to the top and move keyboard focus to the new heading.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    headingRef.current?.focus()
  }, [step])

  const goTo = (target: number) => onChange((d) => ({ ...d, currentStep: target }))
  const updateLevel = (value: LevelDraft) =>
    onChange((d) => ({ ...d, levels: { ...d.levels, [level]: value } }))

  return (
    <>
      <div className="mt-6">
        <ProgressSteps
          current={step}
          hasContent={LEVEL_IDS.map((id) => levelHasContent(draft.levels[id]))}
          onSelect={goTo}
        />
      </div>

      {/* Two columns on wide screens: the form on the left, guidance on the right.
          On phones everything is one column and the guidance sits inside the form. */}
      <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10">
        <main>
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold text-accent">
            {ui.levelNames[level]}
          </h2>
          <div className="mt-4">
            {/* "key" makes the form start fresh for each level */}
            <LevelForm
              key={level}
              level={level}
              value={draft.levels[level]}
              onChange={updateLevel}
              guidanceOnSmallScreens={<GuidancePanel level={level} />}
            />
          </div>

          <div className="mt-8">
            <ChecklistBox level={level} value={draft.levels[level]} />
          </div>

          {saveWorks ? (
            <p className="mt-6 text-sm text-muted">{ui.savedNotice}</p>
          ) : (
            <p role="alert" className="mt-6 text-sm text-danger">
              {ui.saveFailed}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="min-h-11 rounded-md px-3 text-accent hover:bg-accent-tint"
              >
                ← {ui.back}
              </button>
            ) : (
              <span />
            )}
            {isLast ? (
              <p className="text-sm text-muted">{ui.lastStepNotice}</p>
            ) : (
              <button
                type="button"
                onClick={() => goTo(step + 1)}
                className="min-h-11 rounded-md bg-accent px-5 font-medium text-white hover:bg-accent/90"
              >
                {fill(ui.nextTo, { level: ui.levelNames[LEVEL_IDS[step + 1]] })}
              </button>
            )}
          </div>
        </main>

        {/* Guidance beside the form, wide screens only. It stays in view while scrolling. */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <GuidancePanel level={level} />
          </div>
        </div>
      </div>
    </>
  )
}

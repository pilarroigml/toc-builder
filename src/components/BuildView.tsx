// The "Build" view: progress steps, the form for the current level, and guidance beside it.

import { useEffect, useRef } from 'react'
import { LEVEL_IDS } from '../schema/lists'
import { fill, ui } from '../lib/content'
import { levelHasContent, type Draft, type LevelDraft } from '../lib/draft'
import ProgressSteps from './ProgressSteps'
import LevelForm from './LevelForm'
import GuidancePanel from './GuidancePanel'
import ModeSelect from './ModeSelect'
import type { Mode } from '../lib/mode'

type Props = {
  draft: Draft
  onChange: (update: (draft: Draft) => Draft) => void
  saveWorks: boolean
  // Who the user is building this for, and a way to change it
  mode: Mode
  onModeChange: (mode: Mode) => void
  // Go to the examples gallery
  onSeeExamples: () => void
}

export default function BuildView({ draft, onChange, saveWorks, mode, onModeChange, onSeeExamples }: Props) {
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
        <ModeSelect mode={mode} onChange={onModeChange} />
      </div>

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
              guidanceOnSmallScreens={<GuidancePanel level={level} mode={mode} onSeeExamples={onSeeExamples} />}
            />
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
                className="min-h-11 rounded-md bg-accent px-5 font-medium text-on-accent hover:bg-accent/90"
              >
                {fill(ui.nextTo, { level: ui.levelNames[LEVEL_IDS[step + 1]] })}
              </button>
            )}
          </div>
        </main>

        {/* Guidance beside the form, wide screens only. It stays in view while scrolling,
            and scrolls on its own if it is taller than the screen (tabIndex lets keyboard users scroll it). */}
        <div className="hidden lg:block">
          <div tabIndex={0} className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl">
            <GuidancePanel level={level} mode={mode} onSeeExamples={onSeeExamples} />
          </div>
        </div>
      </div>
    </>
  )
}

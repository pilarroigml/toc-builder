// The main screen: the guided form, one level per screen.
// Everything the user types is saved on this device as they type (see src/lib/draft.ts).
// All words shown to users come from /content, never typed here.

import { useEffect, useRef, useState } from 'react'
import { LEVEL_IDS } from './schema/lists'
import { fill, ui } from './lib/content'
import { clearDraft, emptyDraft, levelHasContent, loadDraft, saveDraft, type LevelDraft } from './lib/draft'
import ProgressSteps from './components/ProgressSteps'
import LevelForm from './components/LevelForm'
import ClearDataButton from './components/ClearDataButton'

export default function App() {
  // Start from whatever was saved last time on this device.
  const [draft, setDraft] = useState(loadDraft)
  const [saveWorks, setSaveWorks] = useState(true)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  const step = draft.currentStep
  const level = LEVEL_IDS[step]
  const isLast = step === LEVEL_IDS.length - 1

  // Autosave: every change is saved straight away.
  useEffect(() => {
    setSaveWorks(saveDraft(draft))
  }, [draft])

  // When moving to another level, go back to the top and move keyboard focus to the new heading.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    headingRef.current?.focus()
  }, [step])

  const goTo = (target: number) => setDraft((d) => ({ ...d, currentStep: target }))
  const updateLevel = (value: LevelDraft) =>
    setDraft((d) => ({ ...d, levels: { ...d.levels, [level]: value } }))
  const clearAll = () => {
    clearDraft()
    setDraft(emptyDraft())
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">{ui.appTitle}</h1>
          <p className="mt-1 text-muted">{ui.intro}</p>
        </div>
        <ClearDataButton onClear={clearAll} />
      </header>

      <div className="mt-8">
        <ProgressSteps current={step} hasContent={LEVEL_IDS.map((id) => levelHasContent(draft.levels[id]))} onSelect={goTo} />
      </div>

      <main className="mt-6">
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold text-accent">
          {ui.levelNames[level]}
        </h2>
        <div className="mt-4">
          {/* "key" makes the form start fresh for each level */}
          <LevelForm key={level} level={level} value={draft.levels[level]} onChange={updateLevel} />
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
    </div>
  )
}

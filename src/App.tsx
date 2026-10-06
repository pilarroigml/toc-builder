// The main screen. It holds the user's work and switches between views:
// "Build" (the guided form) and "Diagram" (the one-page picture).
// Everything the user types is saved on this device as they type (see src/lib/draft.ts).
// All words shown to users come from /content, never typed here.

import { useEffect, useState } from 'react'
import { examples, ui } from './lib/content'
import { clearDraft, draftIsEmpty, emptyDraft, exampleToDraft, loadDraft, saveDraft } from './lib/draft'
import ClearDataButton from './components/ClearDataButton'
import ViewTabs, { type View } from './components/ViewTabs'
import BuildView from './components/BuildView'
import DiagramView from './components/DiagramView'

// ===== EDITABLE SETTINGS =====
// The worked example offered when the diagram is still empty.
const STARTER_EXAMPLE_ID = 'girls-secondary-school'
// =============================

export default function App() {
  // Start from whatever was saved last time on this device.
  const [draft, setDraft] = useState(loadDraft)
  const [saveWorks, setSaveWorks] = useState(true)
  const [view, setView] = useState<View>('build')

  // Autosave: every change is saved straight away.
  useEffect(() => {
    setSaveWorks(saveDraft(draft))
  }, [draft])

  const clearAll = () => {
    clearDraft()
    setDraft(emptyDraft())
  }

  // Only offered while nothing has been written, so it never overwrites the user's work.
  const starterExample = examples.find((ex) => ex.id === STARTER_EXAMPLE_ID)
  const loadStarterExample = () => {
    if (starterExample && draftIsEmpty(draft)) setDraft(exampleToDraft(starterExample))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">{ui.appTitle}</h1>
          <p className="mt-1 text-muted">{ui.intro}</p>
        </div>
        <ClearDataButton onClear={clearAll} />
      </header>

      <div className="mt-6">
        <ViewTabs current={view} onChange={setView} />
      </div>

      {view === 'build' && <BuildView draft={draft} onChange={setDraft} saveWorks={saveWorks} />}

      {view === 'diagram' && (
        <div className="mt-6">
          {draftIsEmpty(draft) ? (
            <div className="rounded-xl border border-line-soft bg-white p-6 text-center">
              <p className="text-muted">{ui.diagramEmpty}</p>
              {starterExample && (
                <button
                  type="button"
                  onClick={loadStarterExample}
                  className="mt-4 min-h-11 rounded-md border border-accent px-4 text-accent hover:bg-accent-tint"
                >
                  {ui.diagramLoadExample}
                </button>
              )}
            </div>
          ) : (
            <DiagramView draft={draft} />
          )}
        </div>
      )}
    </div>
  )
}

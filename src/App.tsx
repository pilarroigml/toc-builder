// The main screen. It holds the user's work and switches between views:
// "Build" (the guided form), "Diagram" (the one-page picture), "Logframe" (the table)
// and "Examples" (the gallery of worked examples).
// Everything the user types is saved on this device as they type (see src/lib/draft.ts).
// All words shown to users come from /content, never typed here.

import { useEffect, useState } from 'react'
import { examples, ui } from './lib/content'
import { clearDraft, draftIsEmpty, emptyDraft, exampleToDraft, loadDraft, saveDraft } from './lib/draft'
import ClearDataButton from './components/ClearDataButton'
import ThemeSwitch from './components/ThemeSwitch'
import ViewTabs, { type View } from './components/ViewTabs'
import BuildView from './components/BuildView'
import DiagramView from './components/DiagramView'
import LogframeView from './components/LogframeView'
import Gallery from './components/Gallery'
import type { Example } from './schema/content'

// ===== EDITABLE SETTINGS =====
// The worked example offered when the diagram is still empty.
const STARTER_EXAMPLE_ID = 'girls-secondary-school'
// =============================

export default function App() {
  // Start from whatever was saved last time on this device.
  const [draft, setDraft] = useState(loadDraft)
  const [saveWorks, setSaveWorks] = useState(true)
  const [view, setView] = useState<View>('build')
  // Shown once after loading an example; cleared when the user switches view.
  const [justLoaded, setJustLoaded] = useState(false)
  const changeView = (next: View) => {
    setJustLoaded(false)
    setView(next)
  }

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

  // From the gallery: replace the user's work with the example (the gallery asks first),
  // then go to Build so they can start editing.
  const loadExample = (example: Example) => {
    setDraft(exampleToDraft(example))
    setView('build')
    setJustLoaded(true)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold">{ui.appTitle}</h1>
          <p className="mt-1 text-muted">{ui.intro}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ThemeSwitch />
          <ClearDataButton onClear={clearAll} />
        </div>
      </header>

      <div className="mt-6">
        <ViewTabs current={view} onChange={changeView} />
      </div>

      {justLoaded && view === 'build' && (
        <p role="status" className="mt-4 rounded-md bg-accent-tint px-4 py-2 text-accent">
          {ui.loadedNotice}
        </p>
      )}

      {view === 'build' && <BuildView draft={draft} onChange={setDraft} saveWorks={saveWorks} />}

      {view === 'examples' && (
        <div className="mt-6">
          <Gallery examples={examples} hasWork={!draftIsEmpty(draft)} onLoad={loadExample} />
        </div>
      )}

      {(view === 'diagram' || view === 'logframe') && (
        <div className="mt-6">
          {draftIsEmpty(draft) ? (
            // Nothing written yet: explain, and offer the worked example.
            <div className="rounded-xl border border-line-soft bg-surface p-6 text-center">
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
          ) : view === 'diagram' ? (
            <DiagramView draft={draft} />
          ) : (
            <LogframeView draft={draft} />
          )}
        </div>
      )}
    </div>
  )
}

// The examples gallery: worked examples filtered by sector and by who they are for,
// each with a "Load into my canvas" button.
// Examples are files in content/examples. Adding one = dropping in one new file.

import { useState } from 'react'
import type { Example } from '../schema/content'
import { SECTORS, USER_TYPES } from '../schema/lists'
import { ui } from '../lib/content'
import SourceList from './SourceList'

type Props = {
  examples: Example[]
  // Whether the user has written anything, so loading would replace their work.
  hasWork: boolean
  onLoad: (example: Example) => void
  // The user type chosen in "Who are you building this for?", used as the starting filter.
  initialUserType?: string
}

export default function Gallery({ examples, hasWork, onLoad, initialUserType = '' }: Props) {
  const [sector, setSector] = useState('')
  // Start filtered to the user's type, but only if at least one example matches it.
  const [userType, setUserType] = useState(() =>
    examples.some((ex) => ex.userTypes.includes(initialUserType as Example['userTypes'][number])) ? initialUserType : '',
  )
  // The example waiting for "Yes, replace my work", if any.
  const [confirming, setConfirming] = useState<string | null>(null)

  // Only offer filter options that at least one example uses.
  const sectorsInUse = SECTORS.filter((s) => examples.some((ex) => ex.sectors.includes(s)))
  const userTypesInUse = USER_TYPES.filter((u) => examples.some((ex) => ex.userTypes.includes(u)))

  const shown = examples.filter(
    (ex) =>
      (sector === '' || ex.sectors.includes(sector as Example['sectors'][number])) &&
      (userType === '' || ex.userTypes.includes(userType as Example['userTypes'][number])),
  )

  const load = (example: Example) => {
    if (hasWork && confirming !== example.id) {
      setConfirming(example.id)
      return
    }
    setConfirming(null)
    onLoad(example)
  }

  const selectClass = 'mt-1 block min-h-11 w-full rounded-md border border-field bg-surface px-3 text-base'

  return (
    <section aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="text-2xl font-semibold text-accent">
        {ui.galleryTitle}
      </h2>
      <p className="mt-1 max-w-2xl text-muted">{ui.galleryIntro}</p>

      {/* Filters */}
      <div className="mt-5 grid gap-4 sm:max-w-xl sm:grid-cols-2">
        <label className="block text-sm font-medium">
          {ui.filterSector}
          <select value={sector} onChange={(e) => setSector(e.target.value)} className={selectClass}>
            <option value="">{ui.filterAll}</option>
            {sectorsInUse.map((s) => (
              <option key={s} value={s}>{ui.sectorNames[s]}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          {ui.filterUserType}
          <select value={userType} onChange={(e) => setUserType(e.target.value)} className={selectClass}>
            <option value="">{ui.filterAll}</option>
            {userTypesInUse.map((u) => (
              <option key={u} value={u}>{ui.userTypeNames[u]}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Example cards */}
      {shown.length === 0 ? (
        <p className="mt-6 text-muted">{ui.galleryNone}</p>
      ) : (
        <ul className="mt-6 grid gap-5 lg:grid-cols-2">
          {shown.map((ex) => (
            <li key={ex.id} className="flex flex-col rounded-xl border border-line-soft bg-surface p-5">
              <h3 className="text-lg font-semibold">{ex.title}</h3>
              <p className="mt-1 flex flex-wrap gap-1.5 text-xs">
                {[...ex.sectors.map((s) => ui.sectorNames[s]), ...ex.userTypes.map((u) => ui.userTypeNames[u])].map(
                  (tag) => (
                    <span key={tag} className="rounded-full bg-accent-tint px-2 py-0.5 text-accent">
                      {tag}
                    </span>
                  ),
                )}
              </p>
              <p className="mt-3 rounded bg-weak-tint px-3 py-1.5 text-xs">{ui.illustrativeNotice}</p>
              <p className="mt-3">{ex.summary}</p>

              <details className="mt-3 text-sm">
                <summary className="min-h-11 cursor-pointer py-2 font-medium text-accent">{ui.galleryMore}</summary>
                <h4 className="mt-2 font-semibold">{ui.whyThisWorksLabel}</h4>
                <p>{ex.whyThisWorks}</p>
                <h4 className="mt-3 font-semibold">{ui.draftPairsLabel}</h4>
                {ex.draftPairs.map((pair) => (
                  <div key={pair.weak} className="mt-2">
                    <p className="text-muted">{ui.levelNames[pair.level]}</p>
                    <p><span className="font-semibold">{ui.weakDraftLabel}.</span> {pair.weak}</p>
                    <p><span className="font-semibold">{ui.improvedDraftLabel}.</span> {pair.improved}</p>
                    <p><span className="font-semibold">{ui.whyLabel}.</span> {pair.why}</p>
                  </div>
                ))}
                <SourceList sources={ex.sources} />
                <p className="mt-3 text-xs text-muted">
                  {ui.statusLabel}. {ui.statusNames[ex.status]}
                </p>
              </details>

              {/* Loading replaces the user's work, so ask first if they have any */}
              <div className="mt-4">
                {confirming === ex.id && (
                  <p role="alert" className="mb-2 text-sm text-danger">
                    {ui.loadConfirm}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => load(ex)}
                    className={`min-h-11 rounded-md px-4 font-medium ${
                      confirming === ex.id ? 'bg-danger text-on-danger' : 'bg-accent text-on-accent hover:bg-accent/90'
                    }`}
                  >
                    {confirming === ex.id ? ui.loadConfirmYes : ui.loadIntoCanvas}
                  </button>
                  {confirming === ex.id && (
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="min-h-11 rounded-md border border-field px-4"
                    >
                      {ui.cancel}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// The logframe: a table with one block of rows per level, from impact down to activities.
// Wide screens: a full table. Phones: one card per level, with labelled fields,
// because a seven-column table can't fit on a small screen.

import { ui } from '../lib/content'
import { buildLogframe } from '../lib/logframe'
import type { Draft } from '../lib/draft'

const EMPTY = '—'

// Lines shown as a short list, or a dash when there are none.
function Lines({ lines }: { lines: string[] }) {
  if (lines.length === 0) return <span className="text-muted">{EMPTY}</span>
  if (lines.length === 1) return <>{lines[0]}</>
  return (
    <ul className="list-disc space-y-1 pl-4">
      {lines.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  )
}

const orDash = (text: string) => (text.trim() === '' ? <span className="text-muted">{EMPTY}</span> : text)

export default function LogframeView({ draft }: { draft: Draft }) {
  const { problem, rows } = buildLogframe(draft)
  const cell = 'border border-line-soft px-3 py-2 align-top'

  return (
    <section aria-labelledby="logframe-title" className="rounded-xl border border-line-soft bg-surface p-4 sm:p-6">
      <h2 id="logframe-title" className="text-lg font-semibold">
        {ui.logframeTitle}
      </h2>

      <div className="mt-3 rounded-lg bg-weak-tint p-3 text-sm">
        <span className="font-semibold">{ui.logframeProblem}.</span> <Lines lines={problem} />
      </div>

      {/* Wide screens: the full table */}
      <table className="mt-4 hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="bg-paper text-left">
            <th scope="col" className={cell}>{ui.logframeColLevel}</th>
            <th scope="col" className={cell}>{ui.logframeColDescription}</th>
            <th scope="col" className={cell}>{ui.indicatorLabel}</th>
            <th scope="col" className={cell}>{ui.baselineLabel}</th>
            <th scope="col" className={cell}>{ui.targetLabel}</th>
            <th scope="col" className={cell}>{ui.meansOfVerificationLabel}</th>
            <th scope="col" className={cell}>{ui.assumptionsLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            // Each indicator gets its own line; level, description and assumptions span them all.
            const span = Math.max(row.indicators.length, 1)
            const first = row.indicators[0]
            return [
              <tr key={`${row.level}-0`}>
                <th scope="row" rowSpan={span} className={`${cell} w-28 bg-paper text-left font-semibold text-accent`}>
                  {ui.levelNames[row.level]}
                </th>
                <td rowSpan={span} className={cell}><Lines lines={row.statements} /></td>
                <td className={cell}>{first ? orDash(first.text) : orDash('')}</td>
                <td className={cell}>{first ? orDash(first.baseline) : orDash('')}</td>
                <td className={cell}>{first ? orDash(first.target) : orDash('')}</td>
                <td className={cell}>{first ? orDash(first.meansOfVerification) : orDash('')}</td>
                <td rowSpan={span} className={cell}><Lines lines={row.assumptions} /></td>
              </tr>,
              ...row.indicators.slice(1).map((ind, i) => (
                <tr key={`${row.level}-${i + 1}`}>
                  <td className={cell}>{orDash(ind.text)}</td>
                  <td className={cell}>{orDash(ind.baseline)}</td>
                  <td className={cell}>{orDash(ind.target)}</td>
                  <td className={cell}>{orDash(ind.meansOfVerification)}</td>
                </tr>
              )),
            ]
          })}
        </tbody>
      </table>

      {/* Phones: one card per level */}
      <div className="mt-4 space-y-4 md:hidden">
        {rows.map((row) => (
          <div key={row.level} className="rounded-lg border border-line-soft p-3 text-sm">
            <h3 className="font-semibold text-accent">{ui.levelNames[row.level]}</h3>
            <div className="mt-2"><Lines lines={row.statements} /></div>

            <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{ui.indicatorsLabel}</h4>
            {row.indicators.length === 0 ? (
              <p className="text-muted">{EMPTY}</p>
            ) : (
              row.indicators.map((ind, i) => (
                <dl key={i} className="mt-1 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 rounded-md bg-paper p-2">
                  <dt className="font-semibold">{ui.indicatorLabel}</dt><dd>{orDash(ind.text)}</dd>
                  <dt className="font-semibold">{ui.baselineLabel}</dt><dd>{orDash(ind.baseline)}</dd>
                  <dt className="font-semibold">{ui.targetLabel}</dt><dd>{orDash(ind.target)}</dd>
                  <dt className="col-span-2 font-semibold">{ui.meansOfVerificationLabel}</dt>
                  <dd className="col-span-2">{orDash(ind.meansOfVerification)}</dd>
                </dl>
              ))
            )}

            <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{ui.assumptionsLabel}</h4>
            <Lines lines={row.assumptions} />
          </div>
        ))}
      </div>
    </section>
  )
}

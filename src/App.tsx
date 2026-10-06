// The main screen. For Step 1 it shows the content as plain text,
// so we can check that the content files load and display correctly.
// All words shown to users come from /content, never typed here.

import { LEVEL_IDS } from './schema/lists'
import { examples, fields, ui } from './lib/content'
import SourceList from './components/SourceList'

export default function App() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 font-sans leading-relaxed text-gray-900">
      <h1 className="text-3xl font-semibold text-accent">{ui.appTitle}</h1>
      <p className="mt-2 text-gray-700">{ui.intro}</p>

      {/* Guidance for each level that has some */}
      {fields.map((field) => (
        <section key={field.level} className="mt-10">
          <h2 className="text-2xl font-semibold">
            {ui.guidanceHeading}: {ui.levelNames[field.level]}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {ui.statusLabel}: {ui.statusNames[field.status]}
          </p>

          <h3 className="mt-4 font-semibold">{ui.definitionLabel}</h3>
          <p>{field.definition}</p>

          <h3 className="mt-4 font-semibold">{ui.strongExampleLabel}</h3>
          <p>{field.strongExample}</p>

          <h3 className="mt-4 font-semibold">{ui.weakExampleLabel}</h3>
          <p>{field.weakExample.text}</p>
          <p className="mt-1">
            <strong>{ui.whatIsWrongLabel}:</strong> {field.weakExample.whatIsWrong}
          </p>
          <p className="mt-1">
            <strong>{ui.improvedLabel}:</strong> {field.weakExample.improved}
          </p>

          <h3 className="mt-4 font-semibold">{ui.tipLabel}</h3>
          <p>{field.tip}</p>

          <SourceList sources={field.sources} />
        </section>
      ))}

      {/* Every worked example */}
      {examples.map((example) => (
        <section key={example.id} className="mt-12 border-t border-gray-300 pt-8">
          <p className="text-sm uppercase tracking-wide text-gray-600">{ui.exampleHeading}</p>
          <h2 className="text-2xl font-semibold">{example.title}</h2>
          <p className="mt-2 rounded bg-amber-50 px-3 py-2 text-sm text-amber-900">
            {ui.illustrativeNotice}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {ui.statusLabel}: {ui.statusNames[example.status]}
          </p>

          <h3 className="mt-4 font-semibold">{ui.summaryLabel}</h3>
          <p>{example.summary}</p>

          {LEVEL_IDS.map((levelId) => {
            const level = example.levels[levelId]
            return (
              <div key={levelId} className="mt-6">
                <h3 className="text-lg font-semibold">{ui.levelNames[levelId]}</h3>
                <ul className="list-disc pl-5">
                  {level.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {level.assumptions.length > 0 && (
                  <>
                    <h4 className="mt-2 font-semibold">{ui.assumptionsLabel}</h4>
                    <ul className="list-disc pl-5">
                      {level.assumptions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </>
                )}
                {level.indicators.length > 0 && (
                  <>
                    <h4 className="mt-2 font-semibold">{ui.indicatorsLabel}</h4>
                    <ul className="list-disc pl-5">
                      {level.indicators.map((ind) => (
                        <li key={ind.text}>
                          {ind.text}
                          <br />
                          {ui.baselineLabel}: {ind.baseline}
                          <br />
                          {ui.targetLabel}: {ind.target}
                          <br />
                          {ui.meansOfVerificationLabel}: {ind.meansOfVerification}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )
          })}

          <h3 className="mt-6 font-semibold">{ui.whyThisWorksLabel}</h3>
          <p>{example.whyThisWorks}</p>

          <h3 className="mt-6 font-semibold">{ui.draftPairsLabel}</h3>
          {example.draftPairs.map((pair) => (
            <div key={pair.weak} className="mt-3">
              <p className="text-sm text-gray-600">{ui.levelNames[pair.level]}</p>
              <p>
                <strong>{ui.weakDraftLabel}:</strong> {pair.weak}
              </p>
              <p>
                <strong>{ui.improvedDraftLabel}:</strong> {pair.improved}
              </p>
              <p>
                <strong>{ui.whyLabel}:</strong> {pair.why}
              </p>
            </div>
          ))}

          <SourceList sources={example.sources} />
        </section>
      ))}
    </main>
  )
}

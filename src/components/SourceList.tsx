// A list of sources with links that open in a new tab.

import type { Source } from '../schema/content'
import { ui } from '../lib/content'

export default function SourceList({ sources }: { sources: Source[] }) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold">{ui.sourcesLabel}</h4>
      <ul className="mt-1 list-disc pl-5">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              {source.title}
            </a>
            , {source.organisation} ({ui.accessedLabel} {source.accessed})
          </li>
        ))}
      </ul>
    </div>
  )
}

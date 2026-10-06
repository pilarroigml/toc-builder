// The switch between views: building the theory of change, seeing it as a diagram,
// seeing it as a logframe table, and browsing worked examples.

import { ui } from '../lib/content'

export type View = 'build' | 'diagram' | 'logframe' | 'examples'

type Props = {
  current: View
  onChange: (view: View) => void
}

export default function ViewTabs({ current, onChange }: Props) {
  const views: { id: View; label: string }[] = [
    { id: 'build', label: ui.viewBuild },
    { id: 'diagram', label: ui.viewDiagram },
    { id: 'logframe', label: ui.viewLogframe },
    { id: 'examples', label: ui.viewExamples },
  ]
  return (
    <nav aria-label={ui.viewsLabel} className="flex gap-1 rounded-lg border border-line-soft bg-surface p-1">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          onClick={() => onChange(view.id)}
          aria-current={current === view.id ? 'page' : undefined}
          className={`min-h-11 flex-1 rounded-md px-3 text-sm font-medium sm:flex-none sm:px-4 ${
            current === view.id ? 'bg-accent text-on-accent' : 'text-ink hover:bg-paper'
          }`}
        >
          {view.label}
        </button>
      ))}
    </nav>
  )
}

// The switch between views: building the theory of change, and seeing it as a diagram.
// (The logframe view will be added here next.)

import { ui } from '../lib/content'

export type View = 'build' | 'diagram'

type Props = {
  current: View
  onChange: (view: View) => void
}

export default function ViewTabs({ current, onChange }: Props) {
  const views: { id: View; label: string }[] = [
    { id: 'build', label: ui.viewBuild },
    { id: 'diagram', label: ui.viewDiagram },
  ]
  return (
    <nav aria-label={ui.viewsLabel} className="flex gap-1 rounded-lg border border-line-soft bg-white p-1">
      {views.map((view) => (
        <button
          key={view.id}
          type="button"
          onClick={() => onChange(view.id)}
          aria-current={current === view.id ? 'page' : undefined}
          className={`min-h-11 flex-1 rounded-md px-4 text-sm font-medium sm:flex-none ${
            current === view.id ? 'bg-accent text-white' : 'text-ink hover:bg-paper'
          }`}
        >
          {view.label}
        </button>
      ))}
    </nav>
  )
}

// The "Who are you building this for?" dropdown, shown above the progress steps.

import { useId } from 'react'
import { ui } from '../lib/content'
import { MODE_OPTIONS, type Mode } from '../lib/mode'

type Props = {
  mode: Mode
  onChange: (mode: Mode) => void
}

export default function ModeSelect({ mode, onChange }: Props) {
  const id = useId()
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {ui.modeLabel}
      </label>
      <select
        id={id}
        value={mode}
        onChange={(e) => onChange(e.target.value as Mode)}
        className="min-h-11 rounded-md border border-field bg-surface px-3 text-base"
      >
        <option value="">{ui.modeNotSure}</option>
        {MODE_OPTIONS.map((type) => (
          <option key={type} value={type}>
            {ui.userTypeNames[type]}
          </option>
        ))}
      </select>
    </div>
  )
}

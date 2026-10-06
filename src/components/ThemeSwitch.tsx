// The Auto / Light / Dark switch in the header.

import { useEffect, useState } from 'react'
import { ui } from '../lib/content'
import { applyTheme, followDevice, loadThemeChoice, saveThemeChoice, type ThemeChoice } from '../lib/theme'

export default function ThemeSwitch() {
  const [choice, setChoice] = useState<ThemeChoice>(loadThemeChoice)

  // Apply and remember the choice; on Auto, keep following the device.
  useEffect(() => {
    applyTheme(choice)
    saveThemeChoice(choice)
    if (choice !== 'auto') return
    return followDevice(() => applyTheme('auto'))
  }, [choice])

  const options: { id: ThemeChoice; label: string }[] = [
    { id: 'auto', label: ui.themeAuto },
    { id: 'light', label: ui.themeLight },
    { id: 'dark', label: ui.themeDark },
  ]

  return (
    <div role="group" aria-label={ui.themeLabel} className="flex rounded-md border border-line-soft bg-surface p-0.5 text-sm">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setChoice(option.id)}
          aria-pressed={choice === option.id}
          className={`min-h-11 rounded px-3 ${
            choice === option.id ? 'bg-accent-tint font-semibold text-accent' : 'text-muted hover:text-ink'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

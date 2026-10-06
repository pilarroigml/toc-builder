// "Clear my data" button. It asks for confirmation first, right where you clicked,
// because clearing can't be undone.

import { useState } from 'react'
import { ui } from '../lib/content'

export default function ClearDataButton({ onClear }: { onClear: () => void }) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="-ml-3 min-h-11 rounded-md px-3 text-sm text-muted underline hover:text-ink sm:ml-0"
      >
        {ui.clearData}
      </button>
    )
  }

  return (
    <div role="alert" className="rounded-lg border border-danger bg-surface p-3 text-sm">
      <p>{ui.clearConfirm}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            onClear()
            setConfirming(false)
          }}
          className="min-h-11 rounded-md bg-danger px-4 text-on-danger"
        >
          {ui.clearConfirmYes}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="min-h-11 rounded-md border border-field px-4"
        >
          {ui.cancel}
        </button>
      </div>
    </div>
  )
}

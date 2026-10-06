// "Who are you building this for?": the user's type (NGO, social entrepreneur, researcher...).
// It decides which tailored version of the guidance is shown (see "variants" in
// content/fields.en.json) and which filter the gallery starts with.
// It never changes the structure of the tool. The choice is remembered on this device.

import { USER_TYPES } from '../schema/lists'

// ===== EDITABLE SETTINGS =====
const STORAGE_KEY = 'toc-builder:mode'
// The example the main guidance is based on (the running story).
// It is also offered when the diagram is still empty.
export const RUNNING_STORY_EXAMPLE_ID = 'girls-secondary-school'
// User types offered in the "Who are you building this for?" list.
// ("funder" is left out for now: reviewing applications is a later feature.)
export const MODE_OPTIONS = USER_TYPES.filter((t) => t !== 'funder')
// =============================

export type Mode = (typeof USER_TYPES)[number] | ''

export function loadMode(): Mode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) ?? ''
    return (MODE_OPTIONS as readonly string[]).includes(saved) ? (saved as Mode) : ''
  } catch {
    return ''
  }
}

export function saveMode(mode: Mode): void {
  try {
    if (mode === '') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // Storage blocked: the choice simply won't be remembered.
  }
}

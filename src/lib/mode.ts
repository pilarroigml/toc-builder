// "Who are you building this for?": the user's type (NGO, social entrepreneur, researcher...).
// It decides which worked example the guidance panel shows as "a similar project",
// and which filter the gallery starts with. It never changes the structure of the tool.
// The choice is remembered on this device.

import type { Example } from '../schema/content'
import { USER_TYPES } from '../schema/lists'
import { examples } from './content'

// ===== EDITABLE SETTINGS =====
const STORAGE_KEY = 'toc-builder:mode'
// The example the guidance panel's main examples are already based on (the running story).
// It is shown last for matching user types, since its story is already on screen.
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

// The examples to show as "a similar project", best match first.
// Matching examples come first, with the running story last. With no match, the running story.
export function examplesForMode(mode: Mode): Example[] {
  const running = examples.filter((ex) => ex.id === RUNNING_STORY_EXAMPLE_ID)
  if (mode === '') return running
  const matching = examples.filter((ex) => ex.userTypes.includes(mode as Example['userTypes'][number]))
  if (matching.length === 0) return running
  return [
    ...matching.filter((ex) => ex.id !== RUNNING_STORY_EXAMPLE_ID),
    ...matching.filter((ex) => ex.id === RUNNING_STORY_EXAMPLE_ID),
  ]
}

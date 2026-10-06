// The user's own Theory of Change while they work on it (their "draft"),
// and how it is saved in the browser.
//
// Saving uses the browser's localStorage: a small storage area that belongs to this site
// on this device. Nothing is sent anywhere. Clearing it deletes the user's work.

import { LEVEL_IDS } from '../schema/lists'
import type { LevelId } from '../schema/content'

// ===== EDITABLE SETTINGS =====
// The name under which work is saved in the browser. Change the version number
// only if the saved format changes in a way old saves can't be read.
const STORAGE_KEY = 'toc-builder:draft:v1'
// =============================

export type IndicatorDraft = {
  text: string
  baseline: string
  target: string
  meansOfVerification: string
}

// What the user has typed for one level. Statements and assumptions are kept
// exactly as typed (one per line), so typing feels natural.
export type LevelDraft = {
  statements: string
  assumptions: string
  indicators: IndicatorDraft[]
}

export type Draft = {
  currentStep: number
  levels: Record<LevelId, LevelDraft>
}

export const emptyIndicator = (): IndicatorDraft => ({
  text: '',
  baseline: '',
  target: '',
  meansOfVerification: '',
})

const emptyLevel = (): LevelDraft => ({ statements: '', assumptions: '', indicators: [] })

export const emptyDraft = (): Draft => ({
  currentStep: 0,
  levels: Object.fromEntries(LEVEL_IDS.map((id) => [id, emptyLevel()])) as Record<LevelId, LevelDraft>,
})

// Whether the user has written anything at all in a level.
export const levelHasContent = (level: LevelDraft): boolean =>
  level.statements.trim() !== '' ||
  level.assumptions.trim() !== '' ||
  level.indicators.some((ind) => Object.values(ind).some((v) => v.trim() !== ''))

// Read saved work. If there is none, or it can't be read, start fresh.
// Missing levels are filled in, so older saves keep working if a level is added.
export function loadDraft(): Draft {
  const fresh = emptyDraft()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh
    const saved = JSON.parse(raw) as Partial<Draft>
    for (const id of LEVEL_IDS) {
      const level = saved.levels?.[id]
      if (level) fresh.levels[id] = { ...emptyLevel(), ...level }
    }
    const step = Number(saved.currentStep)
    if (Number.isInteger(step) && step >= 0 && step < LEVEL_IDS.length) fresh.currentStep = step
    return fresh
  } catch {
    return fresh
  }
}

// Save work. Returns false if the browser refuses (private mode, storage blocked or full).
export function saveDraft(draft: Draft): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

// Delete saved work from this device.
export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to clear if storage is blocked.
  }
}

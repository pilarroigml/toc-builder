// Turns the user's work into logframe rows. Used by the logframe view,
// and later by the CSV export (Step 7), so both always match.

import type { LevelId } from '../schema/content'
import { toLines, type Draft, type IndicatorDraft } from './draft'

// ===== EDITABLE SETTINGS =====
// The order of rows in the logframe. Standard donor logframes run top-down,
// from long-term impact to activities. The problem is shown above the table, not as a row.
export const LOGFRAME_ORDER: LevelId[] = ['impact', 'outcomesMedium', 'outcomesShort', 'outputs', 'activities']
// =============================

export type LogframeRow = {
  level: LevelId
  statements: string[]
  indicators: IndicatorDraft[]
  assumptions: string[]
}

// Indicators where every box is empty are left out.
const hasText = (ind: IndicatorDraft) => Object.values(ind).some((v) => v.trim() !== '')

export function buildLogframe(draft: Draft): { problem: string[]; rows: LogframeRow[] } {
  return {
    problem: toLines(draft.levels.problem.statements),
    rows: LOGFRAME_ORDER.map((level) => ({
      level,
      statements: toLines(draft.levels[level].statements),
      indicators: draft.levels[level].indicators.filter(hasText),
      assumptions: toLines(draft.levels[level].assumptions),
    })),
  }
}

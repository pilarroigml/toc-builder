// Runs the quality checklist on one level of the user's work.
// The rules themselves (wording, words to look for, thresholds) live in content/checklist.en.json.
// This file only knows HOW to run each kind of check.
//
// Checks are gentle suggestions. They never stop the user from moving on.

import type { ChecklistRule, LevelId } from '../schema/content'
import checklistJson from '../../content/checklist.en.json'
import { levelHasContent, toLines, type LevelDraft } from './draft'

export const rules = (checklistJson as unknown as { rules: ChecklistRule[] }).rules

export type Finding = {
  rule: ChecklistRule
  // Extra detail to show, such as the words found or the start of a long statement.
  detail?: string
}

// Which box on the form each kind of check is about, so its suggestion appears right under that box.
export type FormField = 'statements' | 'assumptions' | 'indicators'
export function fieldFor(check: ChecklistRule['check']): FormField {
  if (check === 'noAssumptions') return 'assumptions'
  if (check === 'noIndicators' || check === 'indicatorMissingBaselineOrTarget' || check === 'indicatorMissingSource') {
    return 'indicators'
  }
  return 'statements'
}

const wordCount =(text: string) => text.split(/\s+/).filter(Boolean).length

// Find whole words or phrases, ignoring capital letters ("Improved" matches "improved").
function findWords(text: string, words: string[]): string[] {
  return words.filter((word) => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
  })
}

const shorten = (text: string, words = 8) => {
  const parts = text.split(/\s+/)
  return parts.length > words ? `${parts.slice(0, words).join(' ')}…` : text
}

export function runChecks(level: LevelId, value: LevelDraft): Finding[] {
  // Nothing written at this level yet: nothing to check.
  if (!levelHasContent(value)) return []

  const statements = toLines(value.statements)
  const assumptions = toLines(value.assumptions)
  const indicators = value.indicators.filter((ind) => Object.values(ind).some((v) => v.trim() !== ''))
  const findings: Finding[] = []

  for (const rule of rules) {
    if (!rule.levels.includes(level)) continue

    switch (rule.check) {
      case 'wordsInStatements': {
        const found = findWords(statements.join(' '), rule.words)
        if (found.length > 0) findings.push({ rule, detail: found.map((w) => `"${w}"`).join(', ') })
        break
      }
      case 'noAssumptions':
        if (statements.length > 0 && assumptions.length === 0) findings.push({ rule })
        break
      case 'noIndicators':
        if (statements.length > 0 && indicators.length === 0) findings.push({ rule })
        break
      case 'indicatorMissingBaselineOrTarget': {
        const numbers = indicators
          .map((ind, i) => (ind.baseline.trim() === '' || ind.target.trim() === '' ? i + 1 : null))
          .filter((n) => n !== null)
        if (numbers.length > 0) findings.push({ rule, detail: numbers.join(', ') })
        break
      }
      case 'indicatorMissingSource': {
        const numbers = indicators
          .map((ind, i) => (ind.meansOfVerification.trim() === '' ? i + 1 : null))
          .filter((n) => n !== null)
        if (numbers.length > 0) findings.push({ rule, detail: numbers.join(', ') })
        break
      }
      case 'tooManyStatements':
        if (statements.length > rule.max) findings.push({ rule, detail: String(statements.length) })
        break
      case 'longStatement': {
        const long = statements.filter((s) => wordCount(s) > rule.maxWords)
        if (long.length > 0) findings.push({ rule, detail: long.map((s) => `"${shorten(s)}"`).join('; ') })
        break
      }
    }
  }
  return findings
}

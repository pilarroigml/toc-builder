// Lists of allowed values used across the app and the content rules.
// Edit these to add a level, a status, a sector or a user type.
// (Kept separate from content.ts so the app can use them without loading the checker.)

// ===== EDITABLE SETTINGS =====

// The levels of a Theory of Change, in order. Each example fills in all of them.
export const LEVEL_IDS = [
  'problem',
  'activities',
  'outputs',
  'outcomesShort',
  'outcomesMedium',
  'impact',
] as const

// Review status for every piece of guidance and every example.
export const STATUSES = ['draft', 'needs-review', 'reviewed-by-practitioner'] as const

// Sectors used to tag and filter examples.
export const SECTORS = [
  'development',
  'education',
  'gender',
  'financial-inclusion',
  'sustainability',
  'energy',
  'research',
  'social-impact',
] as const

// User types used to tag and filter examples.
export const USER_TYPES = [
  'ngo',
  'student',
  'researcher',
  'entrepreneur',
  'community',
  'individual',
  'funder',
] as const

// =============================

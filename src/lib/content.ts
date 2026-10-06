// Loads all content files so the app can use them.
// The files have already been checked against the rules in src/schema/content.ts
// when the site was built, so here we only label them with the right types.

import type { Example, FieldGuidance, Ui } from '../schema/content'
import uiJson from '../../content/ui.en.json'
import fieldsJson from '../../content/fields.en.json'

export const ui = uiJson as unknown as Ui

// Fill in {placeholders} in interface text, e.g. "Step {current} of {total}".
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

export const fields = (fieldsJson as unknown as { fields: FieldGuidance[] }).fields

// Every file in content/examples is picked up automatically.
// Adding an example = dropping one new .json file in that folder.
const exampleFiles = import.meta.glob('../../content/examples/*.json', {
  eager: true,
  import: 'default',
})
export const examples = Object.values(exampleFiles) as Example[]

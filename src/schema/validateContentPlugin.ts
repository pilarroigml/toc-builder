// Checks every content file against the rules in content.ts.
//
// - When building (npm run build, and on GitHub), it checks ALL files in /content.
//   One broken file stops the build, so a mistake never reaches the live site.
// - In the local preview (npm run dev), it checks each file when you save it,
//   and shows a red error box in the browser if something is wrong.
//
// You shouldn't need to change this file, except to register a new type of content file below.

import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import type { Plugin } from 'vite'
import { ChecklistSchema, ExampleSchema, FieldsSchema, UiSchema } from './content.ts'

// ===== EDITABLE SETTINGS =====
// Which rules apply to which file. Paths are relative to the /content folder.
// The ".en" part is the language, so "ui.es.json" would be checked as interface text too.
function schemaFor(relativePath: string): z.ZodType | null {
  if (/^ui\.[a-z]{2}\.json$/.test(relativePath)) return UiSchema
  if (/^fields\.[a-z]{2}\.json$/.test(relativePath)) return FieldsSchema
  if (/^checklist\.[a-z]{2}\.json$/.test(relativePath)) return ChecklistSchema
  if (/^examples\/[^/]+\.json$/.test(relativePath)) return ExampleSchema
  return null
}
// =============================

// The /content folder. Set properly once Vite knows where the project is (see configResolved).
let CONTENT_DIR = path.resolve('content')

// Check one file's text. Returns a plain-language error message, or null if all is fine.
function check(relativePath: string, source: string): string | null {
  const schema = schemaFor(relativePath)
  if (!schema) {
    return `There are no rules for content/${relativePath}. Rename it, or register it in src/schema/validateContentPlugin.ts.`
  }
  let data: unknown
  try {
    data = JSON.parse(source)
  } catch (err) {
    return `content/${relativePath} is not valid JSON (often a missing comma or quote).\n${(err as Error).message}`
  }
  const result = schema.safeParse(data)
  if (!result.success) {
    return `content/${relativePath} doesn't follow the content rules:\n${z.prettifyError(result.error)}`
  }
  // Extra check for examples: the file name must match the "id" inside it.
  if (relativePath.startsWith('examples/')) {
    const expectedId = path.basename(relativePath, '.json')
    const id = (data as { id: string }).id
    if (id !== expectedId) {
      return `content/${relativePath} has "id": "${id}" but the file name says "${expectedId}". Make them match.`
    }
  }
  return null
}

// List every .json file inside /content, including subfolders.
function allContentFiles(dir = CONTENT_DIR): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return allContentFiles(full)
    return entry.name.endsWith('.json') ? [full] : []
  })
}

const relative = (file: string) => path.relative(CONTENT_DIR, file).split(path.sep).join('/')

export function validateContent(): Plugin {
  let isBuild = false
  return {
    name: 'validate-content',
    enforce: 'pre',
    configResolved(config) {
      isBuild = config.command === 'build'
      CONTENT_DIR = path.resolve(config.root, 'content')
    },
    // Building: check every content file before anything else happens.
    buildStart() {
      if (!isBuild) return
      const problems = allContentFiles()
        .map((file) => check(relative(file), fs.readFileSync(file, 'utf8')))
        .filter((message): message is string => message !== null)
      if (problems.length > 0) {
        this.error(`\n\nCONTENT CHECK FAILED\n\n${problems.join('\n\n')}\n`)
      }
    },
    // Preview: check each content file as it is loaded or saved.
    transform(code, id) {
      const file = path.resolve(id.split('?')[0])
      if (!file.startsWith(CONTENT_DIR + path.sep) || !file.endsWith('.json')) return null
      const message = check(relative(file), code)
      if (message) this.error(`CONTENT CHECK FAILED\n\n${message}`)
      return null
    },
  }
}

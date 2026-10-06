// Vite settings. Vite is the tool that builds the site and runs the local preview.

// ===== EDITABLE SETTINGS =====
// The repository name on GitHub. The live site lives at
// https://pilarroigml.github.io/<REPO_NAME>/ so Vite needs to know it.
// If you rename the repository on GitHub, change this too, or the live page loads blank.
const REPO_NAME = 'toc-builder'
// =============================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: `/${REPO_NAME}/`,
})

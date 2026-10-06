// Light and dark mode.
// The visitor picks Auto, Light or Dark. Auto follows their device's setting.
// The choice is remembered on this device. The page is marked data-theme="dark" or "light",
// and the colours in src/index.css follow that mark. Printing always uses light colours.
//
// index.html runs a tiny copy of applyTheme before the page appears, so it never flashes
// the wrong colours. If you rename STORAGE_KEY, change it there too.

// ===== EDITABLE SETTINGS =====
const STORAGE_KEY = 'toc-builder:theme'
// =============================

export type ThemeChoice = 'auto' | 'light' | 'dark'

const deviceIsDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

export function loadThemeChoice(): ThemeChoice {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'auto'
  } catch {
    return 'auto'
  }
}

export function saveThemeChoice(choice: ThemeChoice): void {
  try {
    if (choice === 'auto') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, choice)
  } catch {
    // Storage blocked: the choice simply won't be remembered.
  }
}

// Mark the page as dark or light.
export function applyTheme(choice: ThemeChoice): void {
  const dark = choice === 'dark' || (choice === 'auto' && deviceIsDark())
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}

// While on Auto, follow the device if it switches (for example at sunset). Returns a stop function.
export function followDevice(onChange: () => void): () => void {
  const query = window.matchMedia('(prefers-color-scheme: dark)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

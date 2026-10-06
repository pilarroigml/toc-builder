# Design decisions

Chosen 6 October 2026, a mix of direction A (calm green) and direction B (warm paper).

## From A
- Numbered progress steps (1 to 6), with done, current and upcoming states.
- Guidance beside the field on desktop, below it on phone. Always visible, no click needed.
- Green accent `#1f6f5c` (the one accent colour).

## From B
- Warm paper background `#faf7f2`.
- Guidance in a white card with a thin border.
- Strong and weak examples as tinted chips (green tint for strong, warm tint for weak).
- "Step 3 of 6 · Outputs" text under the steps.
- The main button names the next level, e.g. "Next: Outcomes".

## Also
- "Saved on this device" note under the fields.
- System fonts, one typeface. WCAG AA contrast. Visible focus outlines. One main action per screen.

All colours are set once at the top of `src/index.css`.

## Dark mode (added 6 October 2026)
- A switch in the header offers Auto, Light and Dark. Auto, the default, follows the device's setting. The choice is remembered on the device (`src/lib/theme.ts`).
- Dark colours use a deep charcoal-green background (`#141a18`) rather than pure black, and a brighter green accent (`#5cc4a6`), because the light theme's green is too dim on dark backgrounds.
- Printing (and the PDF export) always uses the light colours.
- Every text colour in both themes passes WCAG AA contrast (4.5:1). Text box borders pass 3:1. The check also found that the original light text box border (`#cfc8ba`, 1.66:1) was too faint. It is now `#8c8577` (3.66:1), set as `--color-field`.

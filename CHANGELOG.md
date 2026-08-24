# Changelog

All notable changes to this project are documented in this file.

## [1.1.0] - 2026-08-24

### Added

- **Code font**: a separate mono face for `pre`/`code`/`kbd`/`samp` regions (Consolas, JetBrains Mono, Fira Code, Cascadia Code, Sarasa Mono SC …), overriding the UI stack inside code regions.
- **Global font-size offset**: a -4..+8 px slider; implemented as `calc(1em ± Npx)` relative to each element's own size, so the shift stays flat across nesting (no cascade blow-up). Zero restores the default.
- Separate code-font preview line on the settings page.

### Changed

- Settings page labels now distinguish **UI fonts (English / Chinese)** from the **code font**; the reset button clears all four controls.

## [1.0.0] - 2026-08-24

### Added

- Settings page **Fonts (字体)** under Settings: customize the UI's English font and Chinese font independently.
- Live mixed Chinese/English preview that renders with the current font stack as you type.
- Comma-separated font lists and free-form font names (with common-font suggestions via `<datalist>`).
- Global stylesheet injection via a CSS `font-family` fallback chain: Latin characters run through the English font, Han characters fall back to the Chinese font — no language detection.
- **Restore defaults** button that clears both fields and removes every injected style.
- Pure client-side plugin: no host behavior, applies on page refresh, unloads cleanly.
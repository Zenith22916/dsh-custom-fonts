# Changelog

All notable changes to this project are documented in this file.

## [1.0.0] - 2026-08-24

### Added

- Settings page **Fonts (字体)** under Settings: customize the UI's English font and Chinese font independently.
- Live mixed Chinese/English preview that renders with the current font stack as you type.
- Comma-separated font lists and free-form font names (with common-font suggestions via `<datalist>`).
- Global stylesheet injection via a CSS `font-family` fallback chain: Latin characters run through the English font, Han characters fall back to the Chinese font — no language detection.
- **Restore defaults** button that clears both fields and removes every injected style.
- Pure client-side plugin: no host behavior, applies on page refresh, unloads cleanly.
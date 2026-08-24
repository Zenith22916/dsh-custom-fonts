# dsh-ui-font

Customize the **Chinese** and **English** fonts, the **code font**, and the **global font size** of the DeepSeek Harness Web UI — right from a settings page, with a live preview.

[中文说明](README.zh-CN.md)

## What it does

A pure client-side plugin (no host half, no restart needed). Once installed it adds a **Fonts (字体)** page under **Settings**:

- **UI font · English** — used for Latin characters. (Segoe UI, Arial, Georgia, Consolas…)
- **UI font · Chinese** — used for Han characters. (微软雅黑 / 宋体 / 黑体 / 楷体 / 思源黑体 / 苹方…)
- **Code font** — a separate mono face for code blocks and inline code (`pre`/`code`/`kbd`/`samp`). (Consolas, JetBrains Mono, Fira Code, Cascadia Code, Sarasa Mono SC…)
- **Font-size offset** — a -4..+8 px global slider; kernel text stays sharp, no layout blow-up (see below).
- **Live preview** — mixed Chinese/English UI sample plus a code-font sample render as you type (comma-separated font lists and free-form names are both supported).
- **Reset** — clears every control and removes all injected styles.

## How it works

The plugin injects one global stylesheet:

```css
:root { --dsh-ui-font-en: 'English'; --dsh-ui-font-zh: 'Chinese'; }
body, body * { font-family: 'English font', 'Chinese font' !important; }
pre, code, kbd, samp { font-family: 'Code font' !important; }
body, body * { font-size: calc(1em + 2px) !important; }  /* when offset ≠ 0 */
```

- The font-family fallback chain is the standard way to split fonts by script: Latin characters match the English font first, and Han characters — which the English font has no glyphs for — fall back to the Chinese font. No language detection, no DOM surgery.
- The code-font rule comes later and wins inside code regions only.
- The size offset applies `calc(1em ± Npx)` **relative to each element's own size**, so every nesting level shifts by exactly N — no exponential cascade. Clearing it (0) restores the default.

Changes apply immediately and globally (message body, sidebar, inputs, everything).

## Install

From the plugin market (Settings → **Plugin Market**) once the entry is published, or:

```sh
dsh plugin --profile web add dsh-ui-font
```

or directly from the repository:

```sh
dsh plugin --profile web add github:lsh2002/dsh-ui-font
```

Client-only plugin: after a page refresh it is live — no restart required.

## Uninstall

Remove it from **Settings → Plugins → Plugin configuration** (or `dsh plugin --profile web remove dsh-ui-font`), refresh the page; your fonts are reverted automatically.

## License

MIT
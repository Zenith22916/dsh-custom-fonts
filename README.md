# dsh-ui-font

Customize the **Chinese** and **English** fonts of the DeepSeek Harness Web UI — right from a settings page, with a live preview.

[中文说明](README.zh-CN.md)

## What it does

A pure client-side plugin (no host half, no restart needed). Once installed it adds a **Fonts (字体)** page under **Settings**:

- **English font** — used for Latin characters. (Segoe UI, Arial, Georgia, Consolas…)
- **Chinese font** — used for Han characters. (微软雅黑 / 宋体 / 黑体 / 楷体 / 思源黑体 / 苹方…)
- **Live preview** — a mixed Chinese/English sample renders with your fonts as you type (comma-separated font lists and free-form names are both supported).
- **Reset** — clears both fields and removes every injected style.

## How it works

The plugin injects one global stylesheet:

```css
body, body * { font-family: 'English font', 'Chinese font' !important; }
```

This is the standard way to split fonts by script: Latin characters match the English font first, and Han characters — which the English font has no glyphs for — fall back to the Chinese font. No language detection, no DOM surgery.

Changes apply immediately and globally (message body, sidebar, inputs, everything). Clearing both fields restores the product default.

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
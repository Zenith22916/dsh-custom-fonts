/**
 * dsh-ui-font — client bundle.
 *
 * Customizes the global UI fonts on a settings page:
 *   - "英文字体 / English font" is used for Latin characters,
 *   - "中文字体 / Chinese font" handles CJK glyphs,
 * resolved through a CSS font-family fallback chain (English first, so
 * Latin runs through the English font and Han characters fall back to the
 * Chinese one — the standard way to split fonts by script without any
 * language detection).
 *
 * Pure client-only plugin (`dsh.client` without `dsh.bundle`): the market
 * shim-mounts it, changes apply on page refresh, no host half, no restart.
 *
 * Bundle shape follows the official client-modules contract:
 *   window.__ModuleLoader__.load({ id, factory })
 * The factory's only external is `react` from the loader module table.
 */
window.__ModuleLoader__.load({
  id: 'dsh-ui-font',
  factory: (require) => {
    const { createElement, useState } = require('react')

    // Font state lives in the bundle closure so it survives settings-page
    // navigation. Empty means "use the product default".
    const state = { en: '', zh: '' }
    let styleTag = null

    const EN_FONTS = [
      'Segoe UI', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman',
      'Courier New', 'Consolas', 'Verdana', 'Calibri',
    ]
    const ZH_FONTS = [
      '微软雅黑', 'Microsoft YaHei', '宋体', 'SimSun', '黑体', 'SimHei',
      '楷体', 'KaiTi', '仿宋', 'FangSong', '思源黑体', 'Noto Sans CJK SC',
      '苹方', 'PingFang SC',
    ]

    // Turn user input (comma-separated font lists allowed) into quoted CSS.
    function quoteList(str) {
      return String(str || '').split(',').map((s) => s.trim()).filter((s) => s.length > 0).map((s) => {
        if (/^['"]/.test(s) && /['"]$/.test(s)) return s
        return "'" + s.replace(/['"]/g, '') + "'"
      }).join(', ')
    }

    // The global font CSS. English fonts come first so Latin characters win
    // the English font and Han glyphs fall back to the Chinese font.
    function buildCss(en, zh) {
      const enQ = quoteList(en)
      const zhQ = quoteList(zh)
      if (!enQ && !zhQ) return null
      const stack = [enQ, zhQ].filter(Boolean).join(', ')
      const vars = []
      if (enQ) vars.push('--dsh-ui-font-en: ' + enQ)
      if (zhQ) vars.push('--dsh-ui-font-zh: ' + zhQ)
      return [
        ':root { ' + vars.join('; ') + '; }',
        'body, body * { font-family: ' + stack + ' !important; }',
      ].join('\n')
    }

    // Apply or revert the fonts: replaces the injected <style> each time.
    function applyFonts(en, zh) {
      state.en = en
      state.zh = zh
      if (styleTag !== null) { styleTag.remove(); styleTag = null }
      const css = buildCss(en, zh)
      if (css !== null) {
        const tag = document.createElement('style')
        tag.setAttribute('data-dsh-ui-font', '')
        tag.textContent = css
        document.head.appendChild(tag)
        styleTag = tag
      }
    }

    const fieldLabelStyle = {
      display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6,
      color: 'var(--dsw-alias-label-primary)',
    }
    const inputStyle = {
      width: '100%', boxSizing: 'border-box', padding: '8px 10px',
      borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2)',
      background: 'var(--dsw-alias-bg-layer-2)', color: 'var(--dsw-alias-label-primary)',
      fontSize: 14, outline: 'none',
    }

    function Field(props) {
      return createElement('div', { style: { marginBottom: 14 } },
        createElement('label', { style: fieldLabelStyle }, props.label),
        createElement('input', {
          type: 'text', list: props.listId, value: props.value,
          placeholder: props.placeholder, onChange: props.onChange,
          style: inputStyle,
        }),
        createElement('datalist', { id: props.listId },
          props.options.map((name) => createElement('option', { key: name, value: name }))
        ),
      )
    }

    function FontPage() {
      const [en, setEn] = useState(state.en)
      const [zh, setZh] = useState(state.zh)
      const stack = [quoteList(en), quoteList(zh)].filter(Boolean).join(', ')
      return createElement('div', { style: { maxWidth: 560, padding: '4px 2px' } },
        createElement('p', {
          style: {
            margin: '0 0 18px', fontSize: 13, lineHeight: 1.7,
            color: 'var(--dsw-alias-label-secondary)',
          },
        },
          '自定义界面字体：英文字体用于拉丁字符，中文字体用于汉字；两处留空即恢复默认。修改实时全局生效。',
        ),
        createElement(Field, {
          label: '英文字体', listId: 'dsh-ui-font-en-list', value: en,
          placeholder: '例如 Segoe UI, Arial', options: EN_FONTS,
          onChange: (e) => { setEn(e.target.value); applyFonts(e.target.value, zh) },
        }),
        createElement(Field, {
          label: '中文字体', listId: 'dsh-ui-font-zh-list', value: zh,
          placeholder: '例如 微软雅黑, 思源黑体', options: ZH_FONTS,
          onChange: (e) => { setZh(e.target.value); applyFonts(en, e.target.value) },
        }),
        createElement('div', {
          style: {
            marginTop: 16, padding: '14px 16px', borderRadius: 10,
            border: '1px solid var(--dsw-alias-border-l1)',
            background: 'var(--dsw-alias-bg-layer-1)',
            fontSize: 15, lineHeight: 1.8, color: 'var(--dsw-alias-label-primary)',
            fontFamily: stack || 'inherit',
          },
        },
          'The quick brown fox jumps over the lazy dog 0123456789',
          createElement('br', null),
          '敏捷的棕色狐狸跳过了懒狗 0123456789',
        ),
        createElement('button', {
          onClick: () => { setEn(''); setZh(''); applyFonts('', '') },
          style: {
            marginTop: 16, padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
            border: '1px solid var(--dsw-alias-border-l1)',
            background: 'var(--dsw-alias-bg-layer-2)',
            color: 'var(--dsw-alias-label-primary)', fontSize: 13,
          },
        }, '恢复默认字体'),
      )
    }

    function apply(ctx) {
      // `slots` is declared in `inject`, so Cordis only runs apply() once the
      // service is present.
      const slots = ctx.slots
      // Remove the injected stylesheet when the plugin is unloaded.
      ctx.effect(() => () => {
        if (styleTag !== null) { styleTag.remove(); styleTag = null }
      })
      slots.inject('settings.section', () => slots.register(
        { name: 'settings.section', id: 'fonts', order: 25, label: () => '字体' },
        () => createElement(FontPage),
      ))
    }

    return { name: 'dsh-ui-font', inject: ['slots'], apply }
  },
})
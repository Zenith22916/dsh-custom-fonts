# dsh-ui-font

在 DeepSeek Harness Web 界面自定义**中文字体**与**英文字体** —— 设置页直接操作，实时预览。

[English](README.md)

## 功能

纯客户端插件（无宿主端，无需重启）。安装后在 **设置 → 字体** 新增设置页：

- **英文字体**：用于拉丁字符（Segoe UI、Arial、Georgia、Consolas 等）。
- **中文字体**：用于汉字（微软雅黑 / 宋体 / 黑体 / 楷体 / 仿宋 / 思源黑体 / 苹方等）。
- **实时预览**：中英混排示例随输入即时以当前字体渲染；支持逗号分隔的多个候选字体与任意字体名。
- **恢复默认**：一键清空两个输入框并移除全部注入样式。

## 原理

插件注入一段全局样式：

```css
body, body * { font-family: '英文字体', '中文字体' !important; }
```

利用 CSS font-family 回退链实现按文字的字体分流：拉丁字符优先匹配英文字体，中文字符因英文字体缺少字形而自动回退到中文字体——无需语言检测、不操作 DOM。

修改即时全局生效（消息正文、侧边栏、输入框等所有界面文本）。两处留空即恢复产品默认字体。

## 安装

市场发布后可从 **设置 → 插件市场** 一键安装，或：

```sh
dsh plugin --profile web add dsh-ui-font
```

或直接从仓库安装：

```sh
dsh plugin --profile web add github:lsh2002/dsh-ui-font
```

纯客户端插件：刷新页面即生效，无需重启。

## 卸载

在 **设置 → 插件 → 插件配置** 中移除（或 `dsh plugin --profile web remove dsh-ui-font`），刷新页面后字体自动还原。

## 许可证

MIT
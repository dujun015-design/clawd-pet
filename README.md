# Clawd 桌宠 🦀

一只活在你桌面上的 AI 小螃蟹 —— Anthropic 官方吉祥物 Clawd 改造版。**支持 macOS / Windows / Linux**。

它能：
- 👀 **观察你**：切到 VS Code 它打字、切到 Spotify 它跳舞、切到微信它指挥、长时间不动就睡着
- 💬 **陪你聊天**：点一下弹出聊天窗，支持 9 种大模型（DeepSeek / Kimi / 通义 / Claude / GPT...）
- 🖱 **拖到任何位置**：透明窗口覆盖全屏，鼠标穿透不挡操作
- ✨ **动画丝滑**：23 个原生 GIF 状态，纯像素风
- 🎨 **皮肤可换**：默认是 Clawd 螃蟹，可换成自己的角色（见 [SKINS.md](./SKINS.md)）

![demo](docs/demo.gif)

---

## 快速开始

### 方式 A：下载打包好的 .app（推荐普通用户）

去 [Releases](../../releases) 下载最新的 `Clawd.dmg`，拖进 Applications 就行。

### 方式 B：从源码运行（推荐开发者）

```bash
# 1. 克隆仓库
git clone https://github.com/dujun015-design/clawd-pet.git
cd clawd

# 2. 装依赖
npm install

# 3. 配置 API Key（见下方）
# ...

# 4. 启动
npm start
```

---

## 配置大模型

在你的 home 目录新建 `~/.clawd-config.json`：

```json
{
  "provider": "deepseek",
  "apiKey": "sk-你的key"
}
```

**支持的 provider**：`deepseek` / `anthropic` / `openai` / `kimi` / `zhipu` / `qwen` / `openrouter` / `groq` / `ollama`

详细配置见 [CONFIG_EXAMPLE.md](./CONFIG_EXAMPLE.md)。

---

## 打包（按平台）

```bash
# macOS（Apple Silicon）— 默认
npm run package:mac          # → dist/Clawd-darwin-arm64/Clawd.app

# macOS（Intel）
npm run package:mac-intel    # → dist/Clawd-darwin-x64/Clawd.app

# Windows 10/11 (x64)
npm run package:win          # → dist/Clawd-win32-x64/Clawd.exe

# Linux (x64)
npm run package:linux        # → dist/Clawd-linux-x64/clawd
```

打包是跨平台的：在 Mac 上可以打 Windows 包，反之亦然。

---

## 项目结构

```
.
├── main.js              # Electron 主进程：窗口、IPC、LLM 流式调用
├── renderer.js          # 桌面层：拖拽、状态切换、活动检测
├── index.html           # 透明覆盖层
├── chat.html            # 聊天窗口（支持 Markdown 流式渲染）
├── assets/
│   ├── skins/clawd/     # 默认 Clawd 皮肤
│   └── skins/clawd-mini/# 迷你皮肤
├── scripts/
│   ├── get-active-app.ps1  # Windows 前台应用检测
│   └── get-active-app.sh   # Linux 前台应用检测
└── tutorial-video/      # 教程视频的 Remotion 工程（可忽略）
```

## 平台差异

| 平台 | 前台 App 检测 | 备注 |
|---|---|---|
| macOS | `osascript` (AppleScript) | 内置，无需额外依赖 |
| Windows | PowerShell + Win32 API | Win10/11 自带 PowerShell |
| Linux | `xdotool` | 需要先 `apt install xdotool` |

---

## 致谢

- **Clawd 角色** © [Anthropic](https://www.anthropic.com/)
- **GIF 素材** 来自 [rullerzhou-afk/clawd-on-desk](https://github.com/rullerzhou-afk/clawd-on-desk)（AGPL-3.0）
- **桌面互动逻辑、聊天集成** 本仓库

## License

代码部分：MIT
GIF 素材：跟随上游 AGPL-3.0

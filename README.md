# Clawd 桌宠 🦀

一只活在你 Mac 桌面上的 AI 小螃蟹 —— Anthropic 官方吉祥物 Clawd 改造版。

它能：
- 👀 **观察你**：切到 VS Code 它打字、切到 Spotify 它跳舞、切到微信它指挥、长时间不动就睡着
- 💬 **陪你聊天**：点一下弹出聊天窗，支持 9 种大模型（DeepSeek / Kimi / 通义 / Claude / GPT...）
- 🖱 **拖到任何位置**：透明窗口覆盖全屏，鼠标穿透不挡操作
- ✨ **动画丝滑**：23 个原生 GIF 状态，纯像素风

![demo](docs/demo.gif)

---

## 快速开始

### 方式 A：下载打包好的 .app（推荐普通用户）

去 [Releases](../../releases) 下载最新的 `Clawd.dmg`，拖进 Applications 就行。

### 方式 B：从源码运行（推荐开发者）

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/clawd.git
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

## 打包成 .app（自用）

```bash
npm run package
# 产物在 dist/Clawd-darwin-arm64/Clawd.app
```

---

## 项目结构

```
.
├── main.js          # Electron 主进程：窗口、IPC、LLM 流式调用
├── renderer.js      # 桌面层：拖拽、状态切换、活动检测
├── index.html       # 透明覆盖层
├── chat.html        # 聊天窗口（支持 Markdown 流式渲染）
├── assets/gif/      # 23 个 Clawd GIF
└── tutorial-video/  # 教程视频的 Remotion 工程（可忽略）
```

---

## 致谢

- **Clawd 角色** © [Anthropic](https://www.anthropic.com/)
- **GIF 素材** 来自 [rullerzhou-afk/clawd-on-desk](https://github.com/rullerzhou-afk/clawd-on-desk)（AGPL-3.0）
- **桌面互动逻辑、聊天集成** 本仓库

## License

代码部分：MIT
GIF 素材：跟随上游 AGPL-3.0

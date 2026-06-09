# AI 桌宠

一只活在桌面上的 AI 小伙伴。它会根据你当前打开的 App 切换状态，也能弹出聊天窗口陪你对话。支持 macOS / Windows / Linux。

它能：
- 观察前台 App：写代码、聊天、听歌、浏览网页、看文档时切换不同动画
- 陪你聊天：支持 DeepSeek / Kimi / 通义 / Claude / GPT 等多种大模型
- 换皮肤：内置 Clawd 默认皮肤和 Golden Chibi 皮肤，也能导入自己的图片
- 桌面常驻：透明窗口覆盖全屏，可拖到任意位置，不挡日常操作
- 日常提醒：长时间学习、看屏幕后提醒休息或喝茶

## 下载

去 [Releases](../../releases) 下载最新版：

- macOS Apple Silicon：`AI-Desktop-Pet-mac-arm64.zip`
- Windows x64：`AI-Desktop-Pet-win-x64.zip`

## 从源码运行

```bash
git clone https://github.com/dujun015-design/ai-desktop-pet.git
cd ai-desktop-pet
npm install
npm start
```

## 配置大模型

在 home 目录新建 `~/.clawd-config.json`：

```json
{
  "provider": "deepseek",
  "apiKey": "sk-你的key"
}
```

支持的 provider：`deepseek` / `anthropic` / `openai` / `kimi` / `zhipu` / `qwen` / `openrouter` / `groq` / `ollama`。

详细配置见 [CONFIG_EXAMPLE.md](./CONFIG_EXAMPLE.md)。

## 打包

```bash
npm run package:mac        # dist/AI Desktop Pet-darwin-arm64/AI Desktop Pet.app
npm run package:mac-intel  # dist/AI Desktop Pet-darwin-x64/AI Desktop Pet.app
npm run package:win        # dist/AI Desktop Pet-win32-x64/AI Desktop Pet.exe
npm run package:linux      # dist/AI Desktop Pet-linux-x64/ai-desktop-pet
```

## 项目结构

```text
.
├── main.js              # Electron 主进程：窗口、IPC、LLM 流式调用
├── renderer.js          # 桌面层：拖拽、状态切换、活动检测
├── index.html           # 透明覆盖层
├── chat.html            # 聊天窗口
├── assets/
│   └── skins/           # 内置皮肤
├── lib/                 # CLI 监听与记录读取
└── scripts/             # 平台辅助脚本
```

`tutorial-video` 是旧的演示视频工程，和桌宠运行无关，已从项目中移除。

## 素材说明

- Clawd 默认皮肤：Anthropic 官方 Clawd 角色；动画素材来自 `clawd-on-desk`，授权信息见 `assets/skins/clawd/manifest.json`。
- Golden Chibi 皮肤：由用户 jun 提供的本地/生成表情素材，经 Codex 裁剪、抠图、切帧、压缩并适配为桌宠 GIF。
- Golden Chibi 的语气参考《光与夜之恋》中齐司礼一类角色的克制、清冷、嘴硬但会照顾人的气质，由 Codex 改写为原创短句；不使用、不复刻游戏官方台词、剧情文本或对白。

## License

代码部分：MIT

GIF / 皮肤素材：按各自来源与 manifest 标注执行。

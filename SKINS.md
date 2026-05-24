# Clawd 皮肤系统 🎨

教你怎么给桌宠换个样子。

---

## 切换内置皮肤

### 方式 A：右键换装

运行 Clawd 后，右键桌宠，打开 **换装** 菜单，直接选择想用的皮肤。

选择后会写入 `~/.clawd-config.json`，并立即切换，不需要重启。

也可以点 **导入图片做皮肤...**，选择一张 `png` / `jpg` / `webp` / `gif`。Clawd 会自动复制到 `~/.clawd/skins/`，生成一个自定义皮肤并立即换上。

### 方式 B：手动配置

编辑 `~/.clawd-config.json`，加 `skin` 字段：

```json
{
  "provider": "deepseek",
  "apiKey": "sk-xxx",
  "skin": "clawd-mini"
}
```

**内置皮肤**：
- `clawd` — 默认 Clawd 螃蟹（全状态）
- `clawd-mini` — 迷你版（部分状态，缺失状态自动回退到 idle）
- `pixel-dog` — CC0 像素小狗，含坐下、看、叫、走路等 GIF 动作
- `pixel-cat` — CC0 像素小猫，含走路、跑步 GIF 动作

重启 Clawd 生效。

---

## 自己做一个皮肤

### 1. 文件结构

新建一个文件夹，放进你的 GIF：

```
my-cat-skin/
├── manifest.json     (可选，描述信息)
├── idle.gif          (必需！也可以是 idle.png / idle.jpg / idle.webp)
├── typing.gif        (可选)
├── thinking.gif      (可选)
├── happy.gif         (可选)
├── sleeping.gif      (可选)
└── ...
```

**核心规则**：
- **只有 `idle.gif` 是必需的**
- 其他状态 GIF 不存在时会自动 fallback 到 `idle.gif`
- 文件名必须**完全小写**

### 2. 支持的所有状态

| 状态 | 何时触发 | 推荐内容 |
|---|---|---|
| `idle` ⭐必需 | 默认 | 待机 / 呼吸 |
| `reading` | 切到 PDF / 笔记类 app | 看书 / 看屏幕 |
| `typing` | 切到 VS Code / 终端 | 打字 / 敲键盘 |
| `thinking` | LLM 思考中 | 托腮思考 |
| `building` | 切到设计/创意类 app | 搭东西 |
| `debugger` | (未使用，预留) | 修 bug |
| `happy` | 点击 Clawd | 开心跳跃 |
| `error` | API 出错 | 惊讶 / 错愕 |
| `sleeping` | 3 分钟不动 | 睡觉 / 打盹 |
| `sweeping` | (未使用，预留) | 扫地 |
| `carrying` | (未使用，预留) | 搬东西 |
| `conducting` | 切到聊天类 app | 挥手 / 指挥 |
| `juggling` | (未使用，预留) | 杂耍 |
| `groove` | 切到音乐/视频 app | 跳舞 / 听歌 |
| `notification` | (未使用，预留) | 通知提醒 |
| `annoyed` | 连续点击 4 次 | 不耐烦 |
| `jump` | API 回答完成 | 庆祝跳跃 |
| `walk` | (未使用，预留) | 走路 |
| `peek` | 启动时 | 探头 |
| `alert` | (未使用，预留) | 警觉 |

⭐ = 必需

### 3. GIF 规格建议

- **尺寸**：300×300 px（实际渲染会缩放到 140×140）
- **透明背景**：让桌宠贴合桌面
- **帧率**：10-15 fps，循环
- **大小**：单文件别超过 500KB（性能考虑）

### 4. manifest.json（可选）

```json
{
  "name": "我的猫咪",
  "description": "一只懒洋洋的橘猫",
  "author": "你的名字",
  "version": "1.0.0"
}
```

### 5. 安装

把整个文件夹放到 `~/.clawd/skins/`：

```bash
mkdir -p ~/.clawd/skins/
cp -r my-cat-skin ~/.clawd/skins/
```

然后配置：

```json
{
  "skin": "my-cat-skin"
}
```

或者直接指绝对路径，不用复制：

```json
{
  "skin": "/Users/你/Downloads/my-cat-skin"
}
```

---

## 找 GIF 素材的地方

- [Giphy](https://giphy.com/) — 海量动图
- [LottieFiles](https://lottiefiles.com/) — 矢量动画（需转 GIF）
- [itch.io](https://itch.io/game-assets/free/tag-pixel-art) — 像素艺术
- AI 生成：Midjourney + 转 GIF 工具

---

## 分享皮肤

做好之后欢迎 PR 到 [仓库](https://github.com/dujun015-design/clawd-pet) 的 `assets/skins/` 目录！

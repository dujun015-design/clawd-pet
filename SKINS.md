# AI 桌宠皮肤系统

这个项目支持给桌宠换不同角色。2.x 版本内置皮肤只保留默认 Clawd 和 Golden Chibi。

## 切换皮肤

运行 AI 桌宠后，右键桌宠，打开“换装”菜单，选择想用的皮肤。

也可以点“导入图片做皮肤...”，选择一张 `png` / `jpg` / `webp` / `gif`。应用会复制到 `~/.clawd/skins/`，生成一个自定义皮肤并立即换上。

## 手动配置

编辑 `~/.clawd-config.json`，加 `skin` 字段：

```json
{
  "provider": "deepseek",
  "apiKey": "sk-xxx",
  "skin": "golden-chibi"
}
```

内置皮肤：

- `clawd`：默认 Clawd 皮肤
- `golden-chibi`：白发金眼 Q 版皮肤

## 自己做一个皮肤

新建一个文件夹，放进你的图片或 GIF：

```text
my-skin/
├── manifest.json
├── idle.gif
├── typing.gif
├── thinking.gif
├── happy.gif
└── sleeping.gif
```

规则：

- `idle.gif` 必需，也可以是 `idle.png` / `idle.jpg` / `idle.webp`
- 其他状态缺失时自动回退到 `idle`
- 文件名必须小写
- 推荐透明背景

## 支持状态

| 状态 | 触发场景 | 推荐内容 |
|---|---|---|
| `idle` | 默认 | 待机 / 呼吸 |
| `reading` | PDF / 笔记 / 浏览器阅读 | 看书 / 看屏幕 |
| `typing` | VS Code / Cursor / 终端 | 打字 / 敲键盘 |
| `thinking` | LLM 思考中 | 思考 |
| `building` | 创意类 App | 做东西 |
| `debugger` | 预留 | 修 bug |
| `happy` | 点击 / 回复完成 | 开心 |
| `error` | API 出错 | 惊讶 |
| `sleeping` | 长时间不动 | 睡觉 |
| `sweeping` | 预留 | 扫地 |
| `carrying` | 预留 | 搬东西 |
| `conducting` | 微信 / QQ / Discord | 聊天 / 挥手 |
| `juggling` | 预留 | 杂耍 |
| `groove` | 音乐 / 视频 App | 听歌 / 跳舞 |
| `notification` | 通知 | 提醒 |
| `annoyed` | 连续点击 4 次 | 不耐烦 |
| `jump` | 任务完成 | 庆祝 |
| `walk` | 预留 | 走路 |
| `peek` | 启动 | 探头 |
| `alert` | 预留 | 警觉 |

## 安装自定义皮肤

```bash
mkdir -p ~/.clawd/skins/
cp -r my-skin ~/.clawd/skins/
```

然后配置：

```json
{
  "skin": "my-skin"
}
```

也可以直接写绝对路径：

```json
{
  "skin": "/Users/你/Downloads/my-skin"
}
```

## 素材说明

- Clawd 默认皮肤：Anthropic 官方 Clawd 角色；动画素材来自 `clawd-on-desk`，授权信息见 `assets/skins/clawd/manifest.json`。
- Golden Chibi 皮肤：由用户 jun 提供的本地/生成表情素材，经 Codex 裁剪、抠图、切帧、压缩并适配为桌宠 GIF。
- Golden Chibi 语气参考《光与夜之恋》中齐司礼一类角色的克制、清冷、嘴硬但会照顾人的气质，由 Codex 改写为原创短句；不使用、不复刻游戏官方台词、剧情文本或对白。

## 分享皮肤

做好后可以 PR 到仓库的 `assets/skins/` 目录。

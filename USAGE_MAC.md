# AI 桌宠 · Mac 使用教程

跟着做，几分钟就能让 AI 桌宠住进你的 Mac。

> 当前发布包支持 Apple Silicon (M1/M2/M3/M4)。Intel Mac 需要单独打包。

## 第 1 步：下载并打开

1. 下载 `AI-Desktop-Pet-mac-arm64.zip`
2. 双击解压，得到 `AI Desktop Pet.app`
3. 拖到「应用程序 / Applications」文件夹
4. 第一次打开如果提示“无法验证开发者”，在 Finder 里右键 `AI Desktop Pet.app`，选择“打开”，弹窗里再点“打开”

## 第 2 步：申请 API Key

聊天功能需要接一个大模型。推荐 DeepSeek，国内可直连：

1. 打开 https://platform.deepseek.com
2. 注册账号并创建 API Key
3. 复制 `sk-` 开头的字符串

也可以使用 Kimi、通义千问、Claude、OpenAI 等，配置方式见 [CONFIG_EXAMPLE.md](./CONFIG_EXAMPLE.md)。

## 第 3 步：写配置文件

桌宠从 home 目录读取 `.clawd-config.json`。

```bash
cat > ~/.clawd-config.json <<EOF
{
  "provider": "deepseek",
  "apiKey": "sk-粘你的key"
}
EOF
```

## 第 4 步：启动

双击 `AI Desktop Pet.app`。

第一次启动可能会请求：

- 通知权限：建议允许
- 辅助功能权限：必须允许，否则不能识别你切到了哪个 App

手动开启路径：系统设置 → 隐私与安全性 → 辅助功能 → 勾选 `AI Desktop Pet`。

## 常用玩法

| 操作 | 效果 |
|---|---|
| 拖拽桌宠 | 放到屏幕任意位置 |
| 单击桌宠 | 弹出聊天窗口 |
| 切到 VS Code / 终端 | 进入写代码状态 |
| 切到 Spotify / 网易云 / QQ 音乐 | 进入听歌状态 |
| 切到微信 / QQ / Discord | 进入聊天状态 |
| 切到 Notion / PDF / Obsidian | 进入阅读学习状态 |
| 3 分钟不动 | 睡觉 |
| 连续戳 4 次 | 生气 |

## 常见问题

### Q: 桌宠不识别我开的 App

检查辅助功能权限：系统设置 → 隐私与安全性 → 辅助功能 → 勾选 `AI Desktop Pet`。

### Q: 聊天发不出去

检查 `~/.clawd-config.json` 里的 key 是否完整，账号是否有余额。改完配置后重启应用。

### Q: 怎么退出？

点顶部菜单栏的 `AI Desktop Pet` → 退出，或者先点一下应用再按 Cmd+Q。

### Q: 想换皮肤？

看 [SKINS.md](./SKINS.md)。

## 卸载

把 `/Applications/AI Desktop Pet.app` 拖到废纸篓即可。配置文件在 `~/.clawd-config.json`，需要的话可以手动删除。

## 反馈

GitHub: https://github.com/dujun015-design/ai-desktop-pet

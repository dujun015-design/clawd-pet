# AI 桌宠 · Windows 使用教程

跟着做，几分钟就能让 AI 桌宠住进你的 Windows 桌面。

> 支持 Windows 10 / Windows 11 (x64)。

## 第 1 步：下载并打开

1. 下载 `AI-Desktop-Pet-win-x64.zip`
2. 右键解压到固定位置，比如 `D:\Apps\AI-Desktop-Pet-win32-x64\`
3. 进入解压后的文件夹，双击 `AI Desktop Pet.exe`

第一次启动如果出现 SmartScreen 提示：

1. 点“更多信息”
2. 点“仍要运行”

整个解压文件夹要保持完整，不要只把 `.exe` 单独拿出来。

## 第 2 步：申请 API Key

聊天功能需要接一个大模型。推荐 DeepSeek，国内可直连：

1. 打开 https://platform.deepseek.com
2. 注册账号并创建 API Key
3. 复制 `sk-` 开头的字符串

也可以使用 Kimi、通义千问、Claude、OpenAI 等，配置方式见 [CONFIG_EXAMPLE.md](./CONFIG_EXAMPLE.md)。

## 第 3 步：写配置文件

桌宠从用户目录读取 `.clawd-config.json`。

打开 PowerShell，把下面整段贴进去，先把 `sk-粘你的key` 改成你的 key：

```powershell
@'
{
  "provider": "deepseek",
  "apiKey": "sk-粘你的key"
}
'@ | Set-Content "$env:USERPROFILE\.clawd-config.json"
```

## 第 4 步：启动

双击 `AI Desktop Pet.exe`。启动成功后，它会出现在屏幕右下角。

## 常用玩法

| 操作 | 效果 |
|---|---|
| 拖拽桌宠 | 放到屏幕任意位置 |
| 单击桌宠 | 弹出聊天窗口 |
| 切到 VS Code / Cursor / 终端 | 进入写代码状态 |
| 切到 Spotify / 网易云 / QQ 音乐 | 进入听歌状态 |
| 切到微信 / QQ / Discord | 进入聊天状态 |
| 切到 Notion / Obsidian / PDF | 进入阅读学习状态 |
| 3 分钟不动 | 睡觉 |
| 连续戳 4 次 | 生气 |

## 常见问题

### Q: 双击后被杀毒软件拦截

给整个 `AI-Desktop-Pet-win32-x64` 文件夹加白名单。

### Q: 桌宠出现了但不识别前台 App

以管理员身份打开 PowerShell，执行一次：

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

输入 `Y` 回车，然后重启应用。

### Q: 聊天发不出去

检查 `%USERPROFILE%\.clawd-config.json` 里的 key 是否完整，账号是否有余额。改完配置后重启应用。

### Q: 怎么退出？

任务管理器里结束 `AI Desktop Pet`，或者使用右键菜单里的退出。

### Q: 想换皮肤？

看 [SKINS.md](./SKINS.md)。

## 卸载

删除整个 `AI-Desktop-Pet-win32-x64` 文件夹即可。配置文件在 `%USERPROFILE%\.clawd-config.json`，需要的话可以手动删除。

## 反馈

GitHub: https://github.com/dujun015-design/ai-desktop-pet

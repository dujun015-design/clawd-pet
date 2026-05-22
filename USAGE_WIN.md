# Clawd 桌宠 · Windows 使用教程 🪟

跟着做，**3 分钟**就能让一只 AI 桌宠住进你的 Windows 桌面。

> ✅ 支持 **Windows 10 / Windows 11 (x64)**

---

## 第 1 步：下载并打开

1. 下载 `Clawd-win.zip`
2. **右键 → 解压**到一个固定位置，比如 `D:\Apps\Clawd-win32-x64\`

   ⚠️ **重要**：整个文件夹要保持完整。**不能只把 `Clawd.exe` 单独拿出来**，旁边那些 `.dll` 文件都是它跑起来需要的。

3. 进入解压后的文件夹，**双击 `Clawd.exe`**

4. 第一次启动会弹这个：

   > ⚠️ Windows 已保护你的电脑（Microsoft Defender SmartScreen 阻止启动了无法识别的应用）

   别慌：
   - 点 **「更多信息」**
   - 然后点 **「仍要运行」**

   之后再双击就不会拦了。

---

## 第 2 步：申请一个 API Key

桌宠的聊天功能要接大模型才能用。**推荐 DeepSeek**，国内能直连，新用户有免费额度，1 块钱够用很久。

1. 浏览器打开 👉 https://platform.deepseek.com
2. 注册账号 → 充值 1 元（够用 100 万 tokens，能聊几千次）
3. 左侧菜单点 **「API Keys」** → **「+ 创建 API Key」**
4. 复制那段 `sk-` 开头的字符串先放剪贴板里

> 不想用 DeepSeek？也支持：
> - **Kimi/月之暗面**（国内直连）：https://platform.moonshot.cn
> - **通义千问**（国内直连）：https://dashscope.aliyun.com
> - **智谱清言 GLM**（国内直连）：https://open.bigmodel.cn
> - **OpenAI / Anthropic Claude**（需梯子）
> - 还有 5 种其他模型支持，详见 [CONFIG_EXAMPLE.md](./CONFIG_EXAMPLE.md)

---

## 第 3 步：写配置文件

Clawd 从你的**用户目录**读取 `.clawd-config.json` 文件。

**最简单的办法：PowerShell 一条命令**

按 `Win + R` → 输入 `powershell` → 回车。把下面整段贴进去，**先改掉 `sk-粘你的key`**：

```powershell
@'
{
  "provider": "deepseek",
  "apiKey": "sk-粘你的key"
}
'@ | Set-Content "$env:USERPROFILE\.clawd-config.json"
```

完成。

**或者，鼠标办法：**

1. 打开**文件资源管理器**，地址栏输入 `%USERPROFILE%` 回车（会跳到 `C:\Users\你的名字\`）
2. 顶部「**查看**」勾选「**文件扩展名**」和「**隐藏的项目**」
3. 右键 → 新建 → 文本文档，命名为 `.clawd-config.json`（**注意开头有个点**）
4. 用记事本打开，粘贴：

   ```json
   {
     "provider": "deepseek",
     "apiKey": "sk-粘你的key"
   }
   ```

5. 保存（Ctrl+S）

> 💡 如果 Windows 不让你以「.」开头命名文件，可以先命名 `temp.json`，然后在 PowerShell 里执行：
>
> ```powershell
> ren "$env:USERPROFILE\temp.json" ".clawd-config.json"
> ```

---

## 第 4 步：启动 Clawd

双击 `Clawd.exe`。

启动成功后，**Clawd 会出现在屏幕右下角**🦀

第一次跑可能会弹「Windows 安全中心」相关的提示（防火墙之类的），选「**允许访问**」就行。

---

## 第 5 步：玩法

| 操作 | 效果 |
|---|---|
| 🖱 拖拽 Clawd | 它会跟着鼠标走，可以放在屏幕任何角落 |
| 🖱 单击 | 弹出聊天窗口，输入消息能聊 |
| 💻 切到 VS Code / Cursor | Clawd 自动开始打字 ⌨️ |
| 🎵 切到 Spotify / 网易云 | Clawd 戴耳机跳舞 💃 |
| 💬 切到微信 / QQ / Discord | Clawd 变成指挥家 🎼 |
| 📚 切到 Notion / Obsidian | Clawd 看书 📖 |
| 😴 3 分钟不动它 | Clawd 睡觉 zzz |
| 👆👆👆👆 连续戳 4 次 | Clawd 生气：「烦死了别戳了！😤」 |

聊天窗口支持 Markdown 渲染，AI 回复带打字机效果。

---

## 常见问题

### Q: 双击 `Clawd.exe` 一闪就消失了
→ 可能是杀毒软件拦截了。给 `Clawd.exe` 加白名单。
- Windows 自带 Defender：设置 → 隐私和安全 → Windows 安全中心 → 病毒防护 → 管理设置 → 添加排除项 → 选择文件夹（整个 `Clawd-win32-x64` 文件夹）
- 360 / 火绒 / 腾讯管家：搜「信任区 / 白名单」

### Q: Clawd 出现了但不识别我开的 app
→ 99% 是 PowerShell 执行策略问题。以**管理员身份**打开 PowerShell，执行一次：

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

输入 `Y` 回车。然后重启 Clawd。

### Q: 聊天发不出去
→ 99% 是 API key 没配好：
- 检查 `%USERPROFILE%\.clawd-config.json` 里 key 是不是完整的 `sk-...`
- 检查账号有没有余额
- 改完配置要**重启 Clawd**

### Q: 桌宠被任务栏挡住了
→ 拖到屏幕其他位置，或者改任务栏自动隐藏。

### Q: 怎么退出 Clawd？
→ 任务管理器（Ctrl+Shift+Esc）→ 找到「Clawd」→ 结束任务。
> 我后续会加一个右键退出菜单，等更新。

### Q: 想换个动物 / 自己画的桌宠？
→ 看 [SKINS.md](./SKINS.md)，几分钟就能换。

---

## 卸载

直接删除整个 `Clawd-win32-x64` 文件夹就行。配置文件留在 `%USERPROFILE%\.clawd-config.json`，要删也手动删。

---

## 反馈 / 改进

- GitHub: https://github.com/dujun015-design/clawd-pet
- 觉得好用就在视频下面点个赞🥺
- bug / 建议直接在 GitHub Issues 提

Made with 🦀 for fellow nerds.

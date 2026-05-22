# Clawd 桌宠 · Mac 使用教程 🍎

跟着做，**3 分钟**就能让一只 AI 桌宠住进你的 Mac。

> ⚠️ 仅支持 **Apple Silicon (M1/M2/M3/M4)** 芯片的 Mac。Intel Mac 请单独找我要 Intel 版本。

---

## 第 1 步：下载并打开

1. 下载 `Clawd-mac.zip`
2. 双击解压，得到 `Clawd.app`
3. **拖到「应用程序 / Applications」文件夹**（这一步很重要，不然某些功能会失效）
4. 第一次双击会弹这个：

   > ❌「无法打开 Clawd，因为无法验证开发者」

   别慌，这是 macOS 的正常拦截：
   - 在 Finder 里找到 `Clawd.app`
   - **右键 → 打开**
   - 弹窗里再点「**打开**」

   之后双击就能正常用了。

---

## 第 2 步：申请一个 API Key

桌宠的聊天功能要接大模型才能用。**推荐 DeepSeek**，新用户有免费额度，1 块钱够用很久。

1. 浏览器打开 👉 https://platform.deepseek.com
2. 注册账号 → 充值 1 元（够用 100 万 tokens，能聊几千次）
3. 左侧菜单点 **「API Keys」** → **「+ 创建 API Key」**
4. 复制那段 `sk-` 开头的字符串

> 不想用 DeepSeek？也可以用：
> - **Kimi/月之暗面**（国内）：https://platform.moonshot.cn
> - **Anthropic Claude**（要梯子）：https://console.anthropic.com
> - **OpenAI GPT**（要梯子）：https://platform.openai.com
> - 还有 7 种其他模型支持，详见 [CONFIG_EXAMPLE.md](./CONFIG_EXAMPLE.md)

---

## 第 3 步：写配置文件

桌宠从你 home 目录读 `.clawd-config.json` 文件。

**最简单的办法：终端一行命令**

打开「终端」（Cmd+空格 搜 Terminal），把下面整段贴进去 → 把 `sk-粘你的key` 替换成你刚才复制的 → 回车：

```bash
cat > ~/.clawd-config.json <<EOF
{
  "provider": "deepseek",
  "apiKey": "sk-粘你的key"
}
EOF
```

完成。

**或者，鼠标办法：**

1. Finder → 顶部菜单「前往」→ 输入 `~`（就是 home 目录）
2. 按 `Cmd + Shift + .` （显示隐藏文件）
3. 新建文本文件 `clawd-config.txt`
4. 内容写成上面那段 JSON
5. **重命名为 `.clawd-config.json`**（注意开头那个点）

---

## 第 4 步：启动 Clawd

双击 `Clawd.app`。

第一次启动，系统可能弹两个权限：

- **「通知」** → 选「允许」（不弹也没关系）
- **「辅助功能 / Accessibility」** → ⚠️ **必须允许**

  没看到弹窗？手动开：
  > 系统设置 → 隐私与安全性 → 辅助功能 → 找到 Clawd 打勾

  这个是用来检测你切到哪个 app 的（比如你打开 VS Code，桌宠会跟着打字）。没这个权限桌宠不会动。

启动成功后，**Clawd 会出现在屏幕右下角**🦀

---

## 第 5 步：玩法

| 操作 | 效果 |
|---|---|
| 🖱 拖拽 Clawd | 它会跟着鼠标走，可以放在屏幕任何角落 |
| 🖱 单击 | 弹出聊天窗口，输入消息能聊 |
| 🎯 切到 VS Code | Clawd 自动开始打字 ⌨️ |
| 🎵 切到 Spotify | Clawd 戴耳机跳舞 💃 |
| 💬 切到微信 | Clawd 变成指挥家 🎼 |
| 📚 切到 Notion/PDF | Clawd 看书 📖 |
| 😴 3 分钟不动它 | Clawd 睡觉 zzz |
| 👆👆👆👆 连续戳 4 次 | Clawd 生气：「烦死了别戳了！😤」 |

聊天窗口支持 Markdown 渲染，AI 回复带打字机效果。

---

## 常见问题

### Q: Clawd 不动 / 不识别我开的 app
→ 99% 是没给「辅助功能」权限。重新检查：系统设置 → 隐私 → 辅助功能 → 勾上 Clawd。

### Q: 双击没反应 / 闪退
→ 检查是不是 Intel Mac？这个包只支持 Apple Silicon。或者权限没开。

### Q: 聊天发不出去
→ 99% 是 API key 没配好。
- 检查 `~/.clawd-config.json` 里 key 是不是完整的 `sk-...`
- 检查账号有没有余额
- 改完配置要**重启 Clawd**

### Q: 怎么退出 Clawd？
→ 顶部菜单栏左上角「Clawd」→ 退出。或者 Cmd+Q（先点一下 Clawd 让它获取焦点）。

### Q: 想换个动物 / 自己画的桌宠？
→ 看 [SKINS.md](./SKINS.md)，几分钟就能换。

---

## 卸载

把 `Applications/Clawd.app` 拖到废纸篓就行。配置文件留在 `~/.clawd-config.json`，要删也手动删。

---

## 反馈 / 改进

- GitHub: https://github.com/dujun015-design/clawd-pet
- 觉得好用就在视频下面点个赞🥺
- bug / 建议直接在 GitHub Issues 提

Made with 🦀 for fellow nerds.

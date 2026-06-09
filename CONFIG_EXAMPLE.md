# AI 桌宠配置说明

在 home 目录创建 `~/.clawd-config.json` 文件来配置聊天模型、皮肤和名字。

> 配置文件名继续沿用 `.clawd-config.json`，这样旧用户升级不会丢配置。

## 支持的 Provider 预设

填 `provider` 字段即可，其他字段会自动使用预设默认值。

| Provider | 默认模型 | baseURL |
|---|---|---|
| `anthropic` | `claude-sonnet-4-6` | Anthropic 官方 |
| `openai` | `gpt-4o-mini` | OpenAI 官方 |
| `deepseek` | `deepseek-chat` | https://api.deepseek.com/v1 |
| `moonshot` / `kimi` | `moonshot-v1-8k` | https://api.moonshot.cn/v1 |
| `zhipu` | `glm-4-flash` | 智谱 GLM |
| `qwen` | `qwen-turbo` | 通义千问 |
| `openrouter` | `anthropic/claude-sonnet-4` | OpenRouter |
| `groq` | `llama-3.3-70b-versatile` | Groq |
| `ollama` | `llama3.2` | http://localhost:11434/v1 |

## 配置示例

### DeepSeek

```json
{
  "provider": "deepseek",
  "apiKey": "sk-xxxxx"
}
```

### Kimi

```json
{
  "provider": "kimi",
  "apiKey": "sk-xxxxx",
  "model": "moonshot-v1-32k"
}
```

### 通义千问

```json
{
  "provider": "qwen",
  "apiKey": "sk-xxxxx",
  "model": "qwen-max"
}
```

### Ollama 本地模型

```json
{
  "provider": "ollama",
  "apiKey": "ollama",
  "model": "qwen2.5:7b"
}
```

### 自定义 OpenAI 兼容接口

```json
{
  "provider": "openai",
  "apiKey": "sk-xxxxx",
  "baseURL": "https://任何兼容OpenAI的endpoint/v1",
  "model": "你的模型名"
}
```

## 皮肤和名字

```json
{
  "provider": "deepseek",
  "apiKey": "sk-xxx",
  "skin": "golden-chibi",
  "petName": "桌宠"
}
```

内置 skin：

- `clawd`：默认 Clawd 皮肤
- `golden-chibi`：白发金眼 Q 版皮肤

自定义皮肤放到 `~/.clawd/skins/<名字>/`，然后把 `"skin"` 写成对应名字即可。详细做法见 [SKINS.md](./SKINS.md)。

## 配置后

保存后重启 AI 桌宠生效。旧的 `~/.anthropic_key` 文件仍会作为 Anthropic 兼容方式读取。

# Clawd 配置说明

在你的 home 目录创建 `~/.clawd-config.json` 文件来配置 Clawd 使用的大模型。

## 支持的 Provider 预设

填 `provider` 字段就行，其他字段（baseURL、model）会自动用预设默认值。

| Provider | 默认模型 | baseURL |
|---|---|---|
| `anthropic` | `claude-sonnet-4-6` | Anthropic 官方 |
| `openai` | `gpt-4o-mini` | OpenAI 官方 |
| `deepseek` | `deepseek-chat` | https://api.deepseek.com/v1 |
| `moonshot` / `kimi` | `moonshot-v1-8k` | https://api.moonshot.cn/v1 |
| `zhipu` | `glm-4-flash` | 智谱 GLM |
| `qwen` | `qwen-turbo` | 通义千问 |
| `openrouter` | `anthropic/claude-sonnet-4` | OpenRouter（任意模型代理） |
| `groq` | `llama-3.3-70b-versatile` | Groq（超快） |
| `ollama` | `llama3.2` | http://localhost:11434/v1（本地） |

## 配置示例

### Anthropic Claude（默认）
```json
{
  "provider": "anthropic",
  "apiKey": "sk-ant-xxxxx"
}
```

### DeepSeek（便宜好用，国内推荐）
```json
{
  "provider": "deepseek",
  "apiKey": "sk-xxxxx"
}
```

### Kimi（长上下文）
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

### Ollama 本地模型（免 key）
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

## 配置后

文件保存后**重启 Clawd 应用**才会生效。

向后兼容：如果还在用旧的 `~/.anthropic_key` 文件，也会继续工作（按 Anthropic 处理）。

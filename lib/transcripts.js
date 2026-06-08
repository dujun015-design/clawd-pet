// Claude Code / Codex 本地 session 文件解析器
// Clawd 用这个读取并实时显示用户在 CLI 里的对话

const fs = require('fs')
const path = require('path')
const os = require('os')

const CLAUDE_PROJECTS_DIR = path.join(os.homedir(), '.claude', 'projects')
const CODEX_SESSIONS_DIR  = path.join(os.homedir(), '.codex',  'sessions')

// ── Helper: 列文件（带 mtime, size）─────────────────────────────
function statSafe(p) {
  try { return fs.statSync(p) } catch { return null }
}

function isInstalled() {
  return {
    claude: fs.existsSync(CLAUDE_PROJECTS_DIR),
    codex:  fs.existsSync(CODEX_SESSIONS_DIR),
  }
}

// ── 列出 Claude Code session 列表 ─────────────────────────────
function listClaudeSessions(limit = 30) {
  if (!fs.existsSync(CLAUDE_PROJECTS_DIR)) return []
  const out = []
  for (const project of fs.readdirSync(CLAUDE_PROJECTS_DIR)) {
    const projectDir = path.join(CLAUDE_PROJECTS_DIR, project)
    const s = statSafe(projectDir)
    if (!s || !s.isDirectory()) continue
    let files = []
    try { files = fs.readdirSync(projectDir) } catch { continue }
    for (const file of files) {
      if (!file.endsWith('.jsonl')) continue
      const full = path.join(projectDir, file)
      const fstat = statSafe(full)
      if (!fstat) continue
      // 项目名：把编码过的路径还原成可读形式
      const projectPath = project.replace(/^-/, '/').replace(/-/g, '/')
      const projectName = path.basename(projectPath) || projectPath
      out.push({
        cli: 'claude',
        id: file.replace('.jsonl', ''),
        title: projectName,
        subtitle: projectPath,
        path: full,
        mtime: fstat.mtimeMs,
        size: fstat.size,
      })
    }
  }
  return out.sort((a, b) => b.mtime - a.mtime).slice(0, limit)
}

// ── 列出 Codex CLI session 列表 ───────────────────────────────
function listCodexSessions(limit = 30) {
  if (!fs.existsSync(CODEX_SESSIONS_DIR)) return []
  const out = []
  const walk = (dir, depth = 0) => {
    if (depth > 6) return
    let items = []
    try { items = fs.readdirSync(dir) } catch { return }
    for (const item of items) {
      const full = path.join(dir, item)
      const s = statSafe(full)
      if (!s) continue
      if (s.isDirectory()) walk(full, depth + 1)
      else if (item.endsWith('.jsonl')) {
        out.push({
          cli: 'codex',
          id: item.replace('rollout-', '').replace('.jsonl', ''),
          title: 'Codex session',
          subtitle: new Date(s.mtimeMs).toLocaleString('zh-CN'),
          path: full,
          mtime: s.mtimeMs,
          size: s.size,
        })
      }
    }
  }
  walk(CODEX_SESSIONS_DIR)
  return out.sort((a, b) => b.mtime - a.mtime).slice(0, limit)
}

function listAllSessions(limit = 50) {
  return [...listClaudeSessions(), ...listCodexSessions()]
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit)
}

// ── 解析 Claude jsonl 成消息列表 ──────────────────────────────
function parseClaudeMessages(filePath) {
  let raw = ''
  try { raw = fs.readFileSync(filePath, 'utf8') } catch { return [] }
  const out = []
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue
    let d
    try { d = JSON.parse(line) } catch { continue }
    if (d.type !== 'user' && d.type !== 'assistant') continue
    const msg = d.message || {}
    const c = msg.content
    let text = ''
    if (typeof c === 'string') text = c
    else if (Array.isArray(c)) {
      text = c.map((item) => {
        if (typeof item === 'string') return item
        if (item?.type === 'text') return item.text || ''
        if (item?.type === 'thinking') return `_(thinking)_ ${item.thinking || ''}`
        if (item?.type === 'tool_use') return `🔧 \`${item.name}\``
        if (item?.type === 'tool_result') return `↩️ tool result`
        return ''
      }).filter(Boolean).join('\n\n')
    }
    text = text.trim()
    if (!text) continue
    // 过滤系统注入
    if (/^(<environment_context>|<permissions instructions>|<command-message>|<command-name>)/.test(text)) continue
    out.push({
      role: d.type,
      text,
      timestamp: d.timestamp,
    })
  }
  return out
}

// ── 解析 Codex jsonl 成消息列表 ───────────────────────────────
function parseCodexMessages(filePath) {
  let raw = ''
  try { raw = fs.readFileSync(filePath, 'utf8') } catch { return [] }
  const out = []
  for (const line of raw.split('\n')) {
    if (!line.trim()) continue
    let d
    try { d = JSON.parse(line) } catch { continue }
    const p = d.payload
    if (!p) continue
    if (p.type !== 'message') continue
    const role = p.role
    if (role !== 'user' && role !== 'assistant') continue
    const c = p.content
    let text = ''
    if (Array.isArray(c)) {
      text = c.map((item) => item.text || item.output_text || '').filter(Boolean).join('\n\n')
    } else if (typeof c === 'string') {
      text = c
    }
    text = text.trim()
    if (!text) continue
    if (/^(<environment_context>|<permissions instructions>)/.test(text)) continue
    out.push({
      role,
      text,
      timestamp: d.timestamp,
    })
  }
  return out
}

function readTranscript(session) {
  if (!session || !session.path) return []
  if (session.cli === 'claude') return parseClaudeMessages(session.path)
  if (session.cli === 'codex')  return parseCodexMessages(session.path)
  return []
}

module.exports = {
  isInstalled,
  listClaudeSessions,
  listCodexSessions,
  listAllSessions,
  readTranscript,
}

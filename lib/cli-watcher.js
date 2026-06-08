// 监听 Claude Code / Codex 的 transcript jsonl 文件变化
// 推断当前 CLI 在干嘛 → 桌宠跟着切动画状态
//
// 状态规则：
//   最后一条 = user message              → thinking  (AI 在想)
//   最后一条 = assistant tool_use         → building  (跑命令)
//   最后一条 = assistant text 且仍在写    → typing    (吐字中)
//   文件 5 秒+ 无新变化 + 最后是 assistant → jump      (跑完啦)
//
// 完成 (jump) 只触发一次 / session，避免反复跳

const Transcripts = require('./transcripts')

const POLL_MS              = 2000
const ACTIVE_WINDOW_MS     = 5 * 60_000   // 只关心 5 分钟内动过的 session
const COMPLETION_QUIET_MS  = 5_000        // 文件 5 秒不变才算"跑完"
const STATE_COOLDOWN_MS    = 8_000        // 同一动作 8 秒内不重复推

const sessionState = new Map()  // path → { mtime, lastRole, lastWasTool, completedFired, lastEmittedState, lastEmittedAt }

function classifyLastMessage(messages) {
  const last = messages.at(-1)
  if (!last) return { role: null, isTool: false }
  // 我们的 parser 给 tool_use 加了 🔧 前缀
  const isTool = last.role === 'assistant' && last.text.trim().startsWith('🔧')
  return { role: last.role, isTool, text: last.text }
}

let pollTimer = null

function startCliWatcher(emit) {
  if (pollTimer) return
  pollTimer = setInterval(() => tick(emit), POLL_MS)
}

function stopCliWatcher() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = null
}

function tick(emit) {
  const sessions = Transcripts.listAllSessions(15)
  const now = Date.now()

  // 找最活跃的 session（mtime 最新的，但仍要在活跃窗口内）
  const active = sessions
    .filter((s) => now - s.mtime <= ACTIVE_WINDOW_MS)
    .sort((a, b) => b.mtime - a.mtime)
  if (!active.length) return

  for (const s of active) {
    const prev = sessionState.get(s.path)
    const ageMs = now - s.mtime
    // 解析最后几条消息
    const msgs = Transcripts.readTranscript(s)
    const cls = classifyLastMessage(msgs)
    if (!cls.role) continue

    // 状态推断
    let state = null
    let label = ''

    if (cls.role === 'user') {
      state = 'thinking'
      label = cliLabel(s.cli) + ' 思考中...'
    } else if (cls.role === 'assistant' && cls.isTool) {
      state = 'building'
      label = cliLabel(s.cli) + ' 跑命令呢'
    } else if (cls.role === 'assistant' && ageMs >= COMPLETION_QUIET_MS) {
      // 静默 5s+，认为跑完了
      if (!prev?.completedFired) {
        state = 'jump'
        label = cliLabel(s.cli) + ' 跑完啦 ✨'
        // 系统通知
        emit({ type: 'completion', cli: s.cli, sessionTitle: s.title })
      }
    } else if (cls.role === 'assistant' && ageMs < COMPLETION_QUIET_MS) {
      state = 'typing'
      label = cliLabel(s.cli) + ' 回复中'
    }

    // 防抖：相同状态 8s 内不重复推
    if (state && (
        !prev ||
        prev.lastEmittedState !== state ||
        now - (prev.lastEmittedAt || 0) > STATE_COOLDOWN_MS
    )) {
      emit({ type: 'state', state, label, cli: s.cli, sessionTitle: s.title })
      sessionState.set(s.path, {
        mtime: s.mtime,
        lastRole: cls.role,
        lastWasTool: cls.isTool,
        completedFired: state === 'jump' ? true : (prev?.completedFired || false),
        lastEmittedState: state,
        lastEmittedAt: now,
      })
    } else {
      // 仍然更新 mtime 跟踪
      sessionState.set(s.path, {
        ...prev,
        mtime: s.mtime,
        lastRole: cls.role,
        lastWasTool: cls.isTool,
        // 如果最后一条变了 (新一轮)，重置 completedFired
        completedFired: (prev && prev.lastRole !== cls.role) ? false : (prev?.completedFired || false),
      })
    }

    // 只处理最活跃那一个，避免多个 session 互相打架
    break
  }
}

function cliLabel(cli) {
  return cli === 'claude' ? 'Claude' : cli === 'codex' ? 'Codex' : cli
}

module.exports = { startCliWatcher, stopCliWatcher }

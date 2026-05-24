const { app, BrowserWindow, ipcMain, screen, Menu, shell } = require('electron')
const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')
const Anthropic = require('@anthropic-ai/sdk')
const OpenAI = require('openai')
const { pickReply } = require('./demo-responses')

let mainWin, chatWin
let currentStream = null

// ── Provider configuration ────────────────────────────────────────────────
// Preset providers — user only needs to specify provider + apiKey + (optional) model
const PROVIDER_PRESETS = {
  anthropic:  { type: 'anthropic',          defaultModel: 'claude-sonnet-4-6' },
  openai:     { type: 'openai', baseURL: 'https://api.openai.com/v1',                defaultModel: 'gpt-4o-mini' },
  deepseek:   { type: 'openai', baseURL: 'https://api.deepseek.com/v1',              defaultModel: 'deepseek-chat' },
  moonshot:   { type: 'openai', baseURL: 'https://api.moonshot.cn/v1',               defaultModel: 'moonshot-v1-8k' },
  kimi:       { type: 'openai', baseURL: 'https://api.moonshot.cn/v1',               defaultModel: 'moonshot-v1-8k' },
  zhipu:      { type: 'openai', baseURL: 'https://open.bigmodel.cn/api/paas/v4',     defaultModel: 'glm-4-flash' },
  qwen:       { type: 'openai', baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1', defaultModel: 'qwen-turbo' },
  openrouter: { type: 'openai', baseURL: 'https://openrouter.ai/api/v1',             defaultModel: 'anthropic/claude-sonnet-4' },
  groq:       { type: 'openai', baseURL: 'https://api.groq.com/openai/v1',           defaultModel: 'llama-3.3-70b-versatile' },
  ollama:     { type: 'openai', baseURL: 'http://localhost:11434/v1',                defaultModel: 'llama3.2', apiKey: 'ollama' },
}

const CONFIG_PATH = path.join(os.homedir(), '.clawd-config.json')
const SKIN_IMAGE_EXTS = ['.gif', '.png', '.jpg', '.jpeg', '.webp']

// Read ~/.clawd-config.json, falling back to ~/.anthropic_key for backward compat
function loadConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
      const preset = PROVIDER_PRESETS[cfg.provider] || {}
      return {
        provider: cfg.provider || 'anthropic',
        type: preset.type || 'anthropic',
        apiKey: cfg.apiKey || preset.apiKey || process.env.ANTHROPIC_API_KEY,
        baseURL: cfg.baseURL || preset.baseURL,
        model: cfg.model || preset.defaultModel,
        skin: cfg.skin,
      }
    } catch (e) {
      console.error('Failed to parse ~/.clawd-config.json:', e.message)
    }
  }
  // Legacy: ~/.anthropic_key file (Anthropic only)
  const keyPath = path.join(os.homedir(), '.anthropic_key')
  if (fs.existsSync(keyPath)) {
    return {
      provider: 'anthropic',
      type: 'anthropic',
      apiKey: fs.readFileSync(keyPath, 'utf8').trim(),
      model: 'claude-sonnet-4-6',
    }
  }
  // Env var fallback
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic', type: 'anthropic', apiKey: process.env.ANTHROPIC_API_KEY, model: 'claude-sonnet-4-6' }
  }
  return null
}

let config = loadConfig()
let client = null
if (config && config.apiKey) {
  if (config.type === 'anthropic') {
    client = new Anthropic({ apiKey: config.apiKey })
  } else {
    client = new OpenAI({ apiKey: config.apiKey, baseURL: config.baseURL })
  }
}

console.log(`[Clawd] provider=${config?.provider || 'none'} model=${config?.model || 'n/a'}`)

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWin = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  mainWin.loadFile('index.html')
  mainWin.setIgnoreMouseEvents(true, { forward: true })
}

function setStatus(state, message) {
  if (mainWin && !mainWin.isDestroyed()) {
    mainWin.webContents.send('status-update', { state, message })
  }
}

// ── Skin 系统 ─────────────────────────────────────────────────────────────
// 解析 skin 路径，优先级：
//   1. 绝对路径（用户写死的）
//   2. ~/.clawd/skins/<name>/  （用户安装的皮肤）
//   3. <appPath>/assets/skins/<name>/  （内置皮肤）
//   4. fallback 到内置 clawd
function resolveSkinPath(skinName) {
  const builtinDir = path.join(__dirname, 'assets', 'skins')
  const userDir = path.join(os.homedir(), '.clawd', 'skins')
  const fallback = path.join(builtinDir, 'clawd')

  if (!skinName) return fallback
  if (path.isAbsolute(skinName) && fs.existsSync(skinName)) return skinName
  if (skinName.startsWith('~')) {
    const expanded = skinName.replace(/^~/, os.homedir())
    if (fs.existsSync(expanded)) return expanded
  }
  const userSkin = path.join(userDir, skinName)
  if (fs.existsSync(userSkin)) return userSkin
  const builtin = path.join(builtinDir, skinName)
  if (fs.existsSync(builtin)) return builtin
  console.warn(`[Clawd] skin "${skinName}" not found, falling back to clawd`)
  return fallback
}

function findSkinImage(skinPath, state) {
  for (const ext of SKIN_IMAGE_EXTS) {
    const file = path.join(skinPath, `${state}${ext}`)
    if (fs.existsSync(file)) return file
  }
  return null
}

// 扫描 skin 目录，缺失状态自动 fallback 到 idle 图片
function scanSkin(skinPath) {
  const STATES = [
    'idle', 'reading', 'typing', 'thinking', 'building', 'debugger',
    'happy', 'error', 'sleeping', 'sweeping', 'carrying', 'conducting',
    'juggling', 'groove', 'notification', 'annoyed', 'jump',
    'walk', 'peek', 'alert',
  ]
  const result = {}
  const idleFile = findSkinImage(skinPath, 'idle')
  for (const state of STATES) {
    const file = findSkinImage(skinPath, state)
    if (file) result[state] = file
    else if (idleFile) result[state] = idleFile
  }
  return result
}

function readManifest(skinPath) {
  const manifestPath = path.join(skinPath, 'manifest.json')
  if (!fs.existsSync(manifestPath)) return {}
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch (e) {
    console.warn(`[Clawd] failed to parse skin manifest: ${manifestPath}`, e.message)
    return {}
  }
}

function skinEntry(name, skinPath, source) {
  const manifest = readManifest(skinPath)
  return {
    name,
    label: manifest.name || name,
    description: manifest.description || '',
    source,
    path: skinPath,
  }
}

function listSkinEntries(dir, source) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const skinPath = path.join(dir, entry.name)
      if (!findSkinImage(skinPath, 'idle')) return null
      return skinEntry(entry.name, skinPath, source)
    })
    .filter(Boolean)
}

function listAvailableSkins() {
  const builtinDir = path.join(__dirname, 'assets', 'skins')
  const userDir = path.join(os.homedir(), '.clawd', 'skins')
  return [
    ...listSkinEntries(builtinDir, '内置'),
    ...listSkinEntries(userDir, '用户'),
  ]
}

function skinPayload(skinName) {
  const skinPath = resolveSkinPath(skinName)
  const manifest = readManifest(skinPath)
  const animations = scanSkin(skinPath)
  return {
    skinPath,
    skinName: path.basename(skinPath),
    skinLabel: manifest.name || path.basename(skinPath),
    animations,
  }
}

function saveConfigSkin(skinName) {
  let raw = {}
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      raw = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
    } catch (e) {
      console.warn('[Clawd] failed to update config skin:', e.message)
      return false
    }
  }
  raw.skin = skinName
  fs.writeFileSync(CONFIG_PATH, `${JSON.stringify(raw, null, 2)}\n`)
  config = loadConfig()
  return true
}

function switchSkin(skinName) {
  if (!saveConfigSkin(skinName)) return
  const payload = skinPayload(config?.skin)
  console.log(`[Clawd] switched skin: ${payload.skinName} (${Object.keys(payload.animations).length} states)`)
  if (mainWin && !mainWin.isDestroyed()) {
    mainWin.webContents.send('skin-update', payload)
  }
}

function safeSkinName(name) {
  const base = path.parse(name).name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return base || `custom-${Date.now()}`
}

async function importImageSkin() {
  const { dialog } = require('electron')
  const result = await dialog.showOpenDialog({
    title: '选择一张图片或 GIF 做皮肤',
    properties: ['openFile'],
    filters: [
      { name: '图片', extensions: ['gif', 'png', 'jpg', 'jpeg', 'webp'] },
    ],
  })
  if (result.canceled || !result.filePaths.length) return

  const sourcePath = result.filePaths[0]
  const ext = path.extname(sourcePath).toLowerCase()
  if (!SKIN_IMAGE_EXTS.includes(ext)) return

  const userSkinDir = path.join(os.homedir(), '.clawd', 'skins')
  const skinName = `${safeSkinName(sourcePath)}-${Date.now()}`
  const skinPath = path.join(userSkinDir, skinName)
  fs.mkdirSync(skinPath, { recursive: true })
  fs.copyFileSync(sourcePath, path.join(skinPath, `idle${ext}`))
  fs.writeFileSync(path.join(skinPath, 'manifest.json'), `${JSON.stringify({
    name: path.parse(sourcePath).name,
    description: '从本地图片导入的自定义皮肤',
    author: os.userInfo().username,
    version: '1.0.0',
  }, null, 2)}\n`)

  switchSkin(skinName)
}

ipcMain.on('init', (event) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const payload = skinPayload(config?.skin)
  console.log(`[Clawd] skin: ${payload.skinName} (${Object.keys(payload.animations).length} states)`)
  event.returnValue = {
    screenW: width,
    screenH: height,
    ...payload,
  }
})

ipcMain.on('set-ignore', (_, ignore) => {
  if (mainWin && !mainWin.isDestroyed()) {
    mainWin.setIgnoreMouseEvents(ignore, { forward: true })
  }
})

function openChatWindow() {
  if (chatWin && !chatWin.isDestroyed()) {
    chatWin.show()
    chatWin.moveTop()
    chatWin.focus()
    return
  }
  // 算个不挡 Clawd 的位置：在主屏中间靠左
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
  const W = 420, H = 520
  const x = Math.max(40, Math.floor((sw - W) / 2 - 100))
  const y = Math.max(40, Math.floor((sh - H) / 2))

  chatWin = new BrowserWindow({
    width: W,
    height: H,
    x, y,
    frame: true,
    show: false,            // 等准备好再 show，避免闪烁
    alwaysOnTop: true,
    skipTaskbar: false,     // 任务栏要显示，方便 Windows 用户找
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  chatWin.loadFile('chat.html')
  chatWin.once('ready-to-show', () => {
    chatWin.show()
    chatWin.moveTop()
    chatWin.focus()
  })

  // Cmd+Alt+I (mac) / Ctrl+Shift+I (win/linux) 打开 DevTools
  chatWin.webContents.on('before-input-event', (e, input) => {
    const isMacShortcut = input.key === 'I' && input.alt && input.meta
    const isWinShortcut = input.key === 'I' && input.shift && input.control
    if (isMacShortcut || isWinShortcut) {
      chatWin.webContents.openDevTools({ mode: 'detach' })
    }
  })

  chatWin.on('closed', () => {
    if (currentStream) {
      try { currentStream.controller.abort() } catch (_) {}
      currentStream = null
    }
    chatWin = null
    setStatus('idle', '闲着呢~')
  })
}

ipcMain.on('open-chat', openChatWindow)

// 右键菜单
ipcMain.on('show-context-menu', () => {
  const currentSkinPath = resolveSkinPath(config?.skin)
  const skinItems = listAvailableSkins().map((skin) => ({
    label: `${skin.label} (${skin.source})`,
    type: 'radio',
    checked: path.resolve(skin.path) === path.resolve(currentSkinPath),
    click: () => switchSkin(skin.name),
  }))
  const template = [
    {
      label: '💬 打开聊天',
      click: openChatWindow,
    },
    {
      label: '🦀 回到右下角',
      click: () => {
        if (mainWin && !mainWin.isDestroyed()) {
          mainWin.webContents.send('reset-position')
        }
      },
    },
    {
      label: '🎨 换装',
      submenu: [
        {
          label: '导入图片做皮肤...',
          click: importImageSkin,
        },
        { type: 'separator' },
        ...(skinItems.length ? skinItems : [{ label: '没有找到可用皮肤', enabled: false }]),
      ],
    },
    { type: 'separator' },
    {
      label: '📦 查看 GitHub 仓库',
      click: () => shell.openExternal('https://github.com/dujun015-design/clawd-pet'),
    },
    {
      label: 'ℹ️ 关于 Clawd',
      click: () => {
        const { dialog } = require('electron')
        dialog.showMessageBox({
          type: 'info',
          title: 'Clawd 桌宠',
          message: 'Clawd 桌宠 v1.0.0',
          detail:
            'AI 桌面宠物，支持 9 种大模型。\n\n' +
            'Clawd 角色 © Anthropic\n' +
            '动画素材 © clawd-on-desk (AGPL-3.0)\n' +
            '本项目代码：MIT License',
        })
      },
    },
    { type: 'separator' },
    {
      label: '退出 Clawd',
      role: 'quit',
    },
  ]
  Menu.buildFromTemplate(template).popup()
})

// 演示模式：没 client 时分块"模拟流"返回预设回复
async function streamDemoReply(event, prompt) {
  setStatus('thinking', '演示模式 · 思考中...')
  const text = pickReply(prompt)
  // 加点思考延迟，假装在用 AI
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 800))
  // 一字一字吐出来，模拟流式
  const chars = Array.from(text)
  for (const ch of chars) {
    event.reply('stream-chunk', ch)
    await new Promise((r) => setTimeout(r, 25 + Math.random() * 35))
  }
  event.reply('stream-done')
  setStatus('done', '演示回复完了 ✓')
  setTimeout(() => setStatus('idle', '闲着呢~ (演示模式)'), 3000)
}

ipcMain.on('send-prompt', async (event, { prompt, history }) => {
  if (!client) {
    return streamDemoReply(event, prompt)
  }
  setStatus('thinking', '思考中...')
  try {
    if (config.type === 'anthropic') {
      currentStream = client.messages.stream({
        model: config.model,
        max_tokens: 1024,
        messages: history,
      })
      for await (const chunk of currentStream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          event.reply('stream-chunk', chunk.delta.text)
        }
      }
    } else {
      // OpenAI-compatible streaming
      currentStream = await client.chat.completions.create({
        model: config.model,
        messages: history,
        stream: true,
        max_tokens: 1024,
      })
      for await (const chunk of currentStream) {
        const text = chunk.choices?.[0]?.delta?.content
        if (text) event.reply('stream-chunk', text)
      }
    }
    currentStream = null
    event.reply('stream-done')
    setStatus('done', '回答完了 ✓')
    setTimeout(() => setStatus('idle', '闲着呢~'), 3000)
  } catch (e) {
    currentStream = null
    if (e.name === 'AbortError' || e.message?.includes('aborted')) return
    event.reply('stream-error', e.message)
    setStatus('idle', '出错了...')
  }
})

// Allow renderer to query active provider
ipcMain.on('get-provider', (event) => {
  event.returnValue = config ? { provider: config.provider, model: config.model } : null
})

// ── Activity detection ────────────────────────────────────────────────────
// Map frontmost macOS app → activity category + random encouragement messages
const ACTIVITY_MAP = {
  // Coding
  'Code':           { type: 'coding',   msgs: ['一起写代码！⌨️', 'AI 双修中', 'VS Code 真好用'] },
  'Cursor':         { type: 'coding',   msgs: ['Cursor 写代码 ✨', '一起 vibe code'] },
  'Xcode':          { type: 'coding',   msgs: ['Swift 加油 🍎', 'iOS 大佬'] },
  'IntelliJ IDEA':  { type: 'coding',   msgs: ['Java 老法师', 'IDEA 启动'] },
  'PyCharm':        { type: 'coding',   msgs: ['Python 时间 🐍'] },
  'WebStorm':       { type: 'coding',   msgs: ['前端搞起来 ⚡'] },
  'Sublime Text':   { type: 'coding',   msgs: ['老牌编辑器 ⚡'] },
  'Zed':            { type: 'coding',   msgs: ['Zed 真快！'] },
  'Nova':           { type: 'coding',   msgs: ['Nova 写代码'] },

  // Terminal
  'Terminal':       { type: 'terminal', msgs: ['命令行起飞 🖥️'] },
  'iTerm2':         { type: 'terminal', msgs: ['iTerm 黑客模式'] },
  'Warp':           { type: 'terminal', msgs: ['Warp 真好用 🚀'] },
  'Ghostty':        { type: 'terminal', msgs: ['Ghostty 🦇'] },
  'Alacritty':      { type: 'terminal', msgs: ['Alacritty ⚡'] },

  // Reading / study
  'Preview':        { type: 'study',    msgs: ['看 PDF 学习 📖', '加油看完它！'] },
  'Books':          { type: 'study',    msgs: ['读书时间 📚', '我陪你一起读'] },
  'Adobe Acrobat':  { type: 'study',    msgs: ['PDF 阅读ing'] },
  'GoodNotes':      { type: 'study',    msgs: ['做笔记吧 ✏️'] },
  'Notability':     { type: 'study',    msgs: ['一边记一边学'] },
  'Kindle':         { type: 'study',    msgs: ['Kindle 读书 📖'] },

  // Notes / writing
  'Notion':         { type: 'study',    msgs: ['加油一起学习！📝', '整理笔记中？', '一起记录吧'] },
  'Obsidian':       { type: 'study',    msgs: ['第二大脑搭建中 🧠'] },
  'Notes':          { type: 'study',    msgs: ['记下灵感 💡'] },
  'Bear':           { type: 'study',    msgs: ['Bear 写作 🐻'] },
  'Craft':          { type: 'study',    msgs: ['工艺笔记 ✨'] },
  'Logseq':         { type: 'study',    msgs: ['Logseq 思考流'] },
  'Microsoft Word': { type: 'study',    msgs: ['Word 文档 ✍️'] },
  'Pages':          { type: 'study',    msgs: ['Pages 写作'] },

  // Communication / chill
  'Slack':          { type: 'chat',     msgs: ['工作群消息很多吧 💬', '摸鱼一下也行'] },
  'Discord':        { type: 'chat',     msgs: ['Discord 聊天中 🎮'] },
  'WeChat':         { type: 'chat',     msgs: ['微信回复中 💌'] },
  'QQ':             { type: 'chat',     msgs: ['QQ 老用户 🐧'] },
  'Mail':           { type: 'chat',     msgs: ['处理邮件 📧'] },
  'Telegram':       { type: 'chat',     msgs: ['Telegram 飞机 ✈️'] },
  'Messages':       { type: 'chat',     msgs: ['iMessage 💙'] },

  // Music / video
  'Spotify':        { type: 'leisure',  msgs: ['听什么歌呢 🎵'] },
  'Music':          { type: 'leisure',  msgs: ['Apple Music 🎶'] },
  'NeteaseMusic':   { type: 'leisure',  msgs: ['网易云人均文青 🎶'] },
  'QQMusic':        { type: 'leisure',  msgs: ['QQ 音乐 🎵'] },
  'YouTube':        { type: 'leisure',  msgs: ['看视频呢 📺'] },
  'Netflix':        { type: 'leisure',  msgs: ['Netflix 时间 🍿'] },
  'IINA':           { type: 'leisure',  msgs: ['IINA 看片 🎬'] },

  // Browser (generic)
  'Safari':         { type: 'browse',   msgs: ['Safari 冲浪 🌊'] },
  'Google Chrome':  { type: 'browse',   msgs: ['网上冲浪 🌐'] },
  'Arc':            { type: 'browse',   msgs: ['Arc 真好用 🏛️'] },
  'Firefox':        { type: 'browse',   msgs: ['火狐冲浪 🦊'] },
  'Microsoft Edge': { type: 'browse',   msgs: ['Edge 浏览中'] },

  // Design / creative
  'Figma':          { type: 'creative', msgs: ['设计搞起来 🎨', '一起 Figma'] },
  'Sketch':         { type: 'creative', msgs: ['Sketch 设计 ✏️'] },
  'Photoshop':      { type: 'creative', msgs: ['修图大佬 🖼️'] },
  'Affinity Photo': { type: 'creative', msgs: ['Affinity 修图'] },

  // AI tools
  'Claude':         { type: 'coding',   msgs: ['我们在一个屋檐下 ✨'] },
  'ChatGPT':        { type: 'coding',   msgs: ['脚踏两只船？😏'] },
}

// Each activity type maps to an animation state
const ACTIVITY_ANIM = {
  coding:   'running',   // pet "works" alongside you
  terminal: 'running',
  study:    'running',
  creative: 'running',
  chat:     'idle',
  leisure:  'idle',
  browse:   'idle',
}

// ── 跨平台拿前台 App 名 ──
// macOS  → osascript
// Windows → PowerShell + Win32 API（返回的是 ProcessName，例如 "Code"、"chrome"）
// Linux  → xdotool（返回 WM_CLASS）
function getActiveApp() {
  if (process.platform === 'darwin') {
    return new Promise((resolve) => {
      exec(
        `osascript -e 'tell application "System Events" to get name of first process whose frontmost is true'`,
        { timeout: 2000 },
        (err, stdout) => resolve(err ? null : stdout.trim())
      )
    })
  }
  if (process.platform === 'win32') {
    const psFile = path.join(__dirname, 'scripts', 'get-active-app.ps1')
    return new Promise((resolve) => {
      exec(
        `powershell -NoProfile -ExecutionPolicy Bypass -File "${psFile}"`,
        { timeout: 5000, windowsHide: true },
        (err, stdout) => resolve(err ? null : stdout.trim())
      )
    })
  }
  if (process.platform === 'linux') {
    const shFile = path.join(__dirname, 'scripts', 'get-active-app.sh')
    return new Promise((resolve) => {
      exec(
        `bash "${shFile}"`,
        { timeout: 2000 },
        (err, stdout) => resolve(err ? null : stdout.trim())
      )
    })
  }
  return Promise.resolve(null)
}

// Windows 进程名 → 等价的 macOS 应用名（统一查 ACTIVITY_MAP）
const WIN_TO_MAC = {
  // 浏览器
  'chrome': 'Google Chrome',
  'msedge': 'Microsoft Edge',
  'firefox': 'Firefox',
  'iexplore': 'Safari',     // 没人用 IE，姑且 fallback
  'Arc': 'Arc',
  // 编辑器
  'Code': 'Code',
  'Cursor': 'Cursor',
  'devenv': 'IntelliJ IDEA',     // Visual Studio 暂归类到编程
  'idea64': 'IntelliJ IDEA',
  'pycharm64': 'PyCharm',
  'webstorm64': 'WebStorm',
  'sublime_text': 'Sublime Text',
  'Zed': 'Zed',
  'notepad': 'Notes',
  'notepad++': 'Notes',
  // 终端
  'WindowsTerminal': 'Terminal',
  'cmd': 'Terminal',
  'powershell': 'Terminal',
  'pwsh': 'Terminal',
  // IM / 聊天
  'WeChat': 'WeChat',
  'WeChatApp': 'WeChat',
  'QQ': 'QQ',
  'TIM': 'QQ',
  'Telegram': 'Telegram',
  'Discord': 'Discord',
  'slack': 'Slack',
  'Slack': 'Slack',
  'Outlook': 'Mail',
  // 笔记 / 文档
  'Notion': 'Notion',
  'Obsidian': 'Obsidian',
  'WINWORD': 'Microsoft Word',
  // 音乐 / 视频
  'Spotify': 'Spotify',
  'cloudmusic': 'NeteaseMusic',
  'QQMusic': 'QQMusic',
  'PotPlayerMini64': 'IINA',
  'vlc': 'IINA',
  // 设计
  'Figma': 'Figma',
  'Photoshop': 'Photoshop',
  // AI
  'Claude': 'Claude',
  'ChatGPT': 'ChatGPT',
}

function normalizeAppName(name) {
  if (!name) return name
  if (process.platform === 'win32') {
    return WIN_TO_MAC[name] || name
  }
  return name
}

let lastApp = null
let lastNotifyAt = 0
const NOTIFY_COOLDOWN_MS = 25_000   // at most once per ~25s on app change
const APP_REVISIT_MS = 4 * 60_000   // re-notify same app at most every 4 min
let lastNotifyApp = null

async function pollActivity() {
  if (!mainWin || mainWin.isDestroyed()) return
  const rawName = await getActiveApp()
  if (!rawName) return
  const appName = normalizeAppName(rawName)

  // Skip self（跨平台：Electron 在 Win 上叫 electron）
  const selfNames = ['Electron', 'electron', 'claude-desktop-pet', 'Clawd', 'clawd-pet']
  if (selfNames.includes(rawName) || selfNames.includes(appName)) {
    lastApp = appName
    return
  }

  const def = ACTIVITY_MAP[appName]
  const appChanged = appName !== lastApp
  lastApp = appName
  if (!def) return

  const now = Date.now()
  const sameAppRecent = lastNotifyApp === appName && now - lastNotifyAt < APP_REVISIT_MS
  const cooldownActive = now - lastNotifyAt < NOTIFY_COOLDOWN_MS
  if (!appChanged && sameAppRecent) return
  if (cooldownActive && !appChanged) return

  lastNotifyAt = now
  lastNotifyApp = appName
  const msg = def.msgs[Math.floor(Math.random() * def.msgs.length)]
  const animation = ACTIVITY_ANIM[def.type] || 'idle'
  mainWin.webContents.send('activity-update', { type: def.type, animation, message: msg })
}

let activityTimer = null
function startActivityWatcher() {
  if (activityTimer) return
  // First check after 8s, then every 5s
  setTimeout(pollActivity, 8_000)
  activityTimer = setInterval(pollActivity, 5_000)
}

app.whenReady().then(() => {
  createMainWindow()
  startActivityWatcher()
})
app.on('window-all-closed', () => app.quit())

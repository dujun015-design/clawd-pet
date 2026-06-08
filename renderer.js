const { ipcRenderer } = require('electron')

// ── Setup ─────────────────────────────────────────────────────────────────
const pet = document.getElementById('pet')
const wrap = document.getElementById('pet-wrap')
const bubble = document.getElementById('bubble')
const dot = document.getElementById('status-dot')

const initData = ipcRenderer.sendSync('init')
const { screenW, screenH } = initData
let ANIMATIONS = initData.animations
let currentSkinName = initData.skinName || 'clawd'

// 跟 index.html 的 --pet-size CSS 变量保持一致
const PET_W = 130
const PET_H = 130

// Default position: bottom-right corner
let petX = screenW - PET_W - 20
let petY = screenH - PET_H - 40

function setPetPos(x, y) {
  petX = Math.max(0, Math.min(screenW - PET_W, x))
  petY = Math.max(0, Math.min(screenH - PET_H, y))
  wrap.style.transform = `translate(${petX}px, ${petY}px)`
}
setPetPos(petX, petY)

// ── Animation: img.src swap, GIF handles internal frames ─────────────────
// ANIMATIONS 由 main 进程根据当前 skin 推送，state → 绝对路径
// 缺失的 state 已在 main 端 fallback 到 idle.gif

let currentState = 'idle'
let isStaticMode = false

// NOTE: 粒子/飘字效果（FX）已移除 —— 用户觉得 tap tap / 星星 太密会遮住主体
// 如果想加回来，请确保默认关闭，做成用户可选开关

function updateBubbleAnchor() {
  try {
    if (!pet.complete || !pet.naturalWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = PET_W
    canvas.height = PET_H
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, PET_W, PET_H)
    ctx.drawImage(pet, 0, 0, PET_W, PET_H)
    const { data } = ctx.getImageData(0, 0, PET_W, PET_H)
    let minY = PET_H
    let maxY = -1
    for (let y = 0; y < PET_H; y++) {
      for (let x = 0; x < PET_W; x++) {
        if (data[(y * PET_W + x) * 4 + 3] > 18) {
          minY = Math.min(minY, y)
          maxY = Math.max(maxY, y)
        }
      }
    }
    if (maxY < 0) return
    const visibleHeight = maxY - minY + 1
    const gap = visibleHeight < 48 ? 5 : visibleHeight < 92 ? 7 : 9
    const bottom = Math.max(34, Math.min(142, PET_H - minY + gap))
    wrap.style.setProperty('--bubble-bottom', `${bottom}px`)
  } catch (_) {
    wrap.style.setProperty('--bubble-bottom', '52px')
  }
}

pet.addEventListener('load', () => {
  requestAnimationFrame(updateBubbleAnchor)
  setTimeout(updateBubbleAnchor, 120)
})

function setPetMotionClass(name, file) {
  const cleanPath = file.split('?')[0].toLowerCase()
  isStaticMode = !cleanPath.endsWith('.gif')
  pet.className = isStaticMode ? `static-skin state-${name}` : ''
  wrap.classList.toggle('static-mode', isStaticMode)
}

function setState(name) {
  const file = ANIMATIONS[name]
  if (!file) return
  if (currentState === name && pet.src) return
  currentState = name
  setPetMotionClass(name, file)
  // Setting src to empty then to new value forces GIF to restart from frame 0
  // file:// 前缀，绕开 packaged asar 路径问题
  pet.src = ''
  pet.src = file.startsWith('file://') ? file : `file://${file}`
}

// ── Drag (Pointer Events with capture for robust tracking) ───────────────
let isDragging = false
let activePointerId = null
let dragStartMX = 0, dragStartMY = 0
let dragStartPX = 0, dragStartPY = 0

pet.addEventListener('pointerdown', (e) => {
  // 右键单独处理 → 弹原生菜单
  if (e.button === 2) {
    e.preventDefault()
    ipcRenderer.send('show-context-menu')
    return
  }
  if (e.button !== 0) return
  try { pet.setPointerCapture(e.pointerId) } catch (_) {}
  activePointerId = e.pointerId
  isDragging = true
  dragStartMX = e.clientX; dragStartMY = e.clientY
  dragStartPX = petX;      dragStartPY = petY
  wrap.classList.add('dragging')
  resetIdleTimer()
  e.preventDefault()
})

pet.addEventListener('pointermove', (e) => {
  if (!isDragging || e.pointerId !== activePointerId) return
  setPetPos(dragStartPX + e.clientX - dragStartMX,
            dragStartPY + e.clientY - dragStartMY)
})

function endDrag(e) {
  if (!isDragging || e.pointerId !== activePointerId) return
  const moved = Math.hypot(e.clientX - dragStartMX, e.clientY - dragStartMY)
  isDragging = false
  activePointerId = null
  wrap.classList.remove('dragging')
  try { pet.releasePointerCapture(e.pointerId) } catch (_) {}
  ipcRenderer.send('set-ignore', true)
  if (moved < 6) handleClick()
}
pet.addEventListener('pointerup', endDrag)
pet.addEventListener('pointercancel', endDrag)

// ── Mouse passthrough ─────────────────────────────────────────────────────
pet.addEventListener('pointerenter', () => {
  ipcRenderer.send('set-ignore', false)
  resetIdleTimer()
})
pet.addEventListener('pointerleave', () => {
  if (!isDragging) ipcRenderer.send('set-ignore', true)
})

// ── Speech bubble ─────────────────────────────────────────────────────────
let bubbleTimer = null

function showBubble(text, durationMs = 3500) {
  if (!text) return
  bubble.textContent = text
  bubble.style.display = 'block'
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => { bubble.style.display = 'none' }, durationMs)
}

const CHIBI_QUOTES = {
  greeting: [
    '来了。别把桌面弄乱。',
    '今天也别偷懒，笨鸟。',
    '坐好，先把要做的事说清楚。',
  ],
  reset: ['回来了。位置都记不住？', '站好，别乱跑。'],
  skin: ['这身还算顺眼。', '勉强合格。'],
  drop: ['文件放这，我看。', '别催，我会处理。'],
  click: ['有事就说。', '我在。别戳了。'],
  annoyed: ['再戳就自己写。', '手闲的话，去整理需求。'],
  'status-thinking': ['别急，我在看。', '先别打断。', '这个要想清楚。'],
  'status-working': ['在写了。', '字会出来，别盯太紧。', '我尽量写得像样。'],
  'status-done': ['好了。自己检查一遍。', '写完了，别说你没看懂。', '结果在这。'],
  'status-idle': ['暂时没事？那就别浪费时间。', '我在，茶也在。'],
  'cli-thinking': ['它在想，我盯着。', '先等，别乱动。'],
  'cli-building': ['命令在跑，别碰终端。', '小黑窗还活着。'],
  'cli-typing': ['它开始回了。', '有字了，安静看。'],
  'cli-jump': ['跑完了。还不错。', '结束，去看结果。'],
  'activity-coding': ['代码别写成一团。', '缩进先对齐。'],
  'activity-terminal': ['终端打开了，谨慎点。', '命令别乱敲。'],
  'activity-study': ['看仔细点。', '读完再下结论。'],
  'activity-creative': ['审美别掉线。', '这一步要干净。'],
  'activity-chat': ['有人找你。', '先把话说清楚。'],
  'activity-leisure': ['休息可以，别过头。', '喝口茶再继续。'],
  'activity-browse': [
    '别开太多标签页。',
    '有用的，记下来。',
    '看资料可以，别走神。',
    '读完再下结论，笨鸟。',
    '这页值得留着吗？',
    '眼睛离屏幕远一点。',
  ],
  'streak-study': ['看这么久，喝口茶。', '眼睛也要休息，笨鸟。'],
  'streak-chat': ['盯太久了，停两分钟。', '休息一下，不许逞强。'],
}

function pickQuote(key, fallback) {
  if (currentSkinName !== 'golden-chibi') return fallback
  const quotes = CHIBI_QUOTES[key]
  if (!quotes?.length) return fallback
  return quotes[Math.floor(Math.random() * quotes.length)]
}

function say(key, fallback, durationMs = 3500) {
  showBubble(pickQuote(key, fallback), durationMs)
}

// ── Click → wave + open chat ──────────────────────────────────────────────
let petLocked = false

function handleClick() {
  setState('happy')
  say('click', '打开聊天', 1000)
  // 别 lock 太久，让对话框立刻能弹出来
  petLocked = true
  setTimeout(() => {
    petLocked = false
    if (currentState === 'happy') setState('idle')
  }, 800)
  ipcRenderer.send('open-chat')
}

// 防止浏览器自带的 contextmenu 抢菜单
pet.addEventListener('contextmenu', (e) => e.preventDefault())
window.addEventListener('contextmenu', (e) => e.preventDefault())

// ── 拖文件到桌宠 → 把文件名作为聊天 prompt 前缀 ──
function bindDropZone(el) {
  el.addEventListener('dragover', (e) => {
    e.preventDefault()
    ipcRenderer.send('set-ignore', false)
    wrap.classList.add('drop-target')
  })
  el.addEventListener('dragleave', () => {
    wrap.classList.remove('drop-target')
  })
  el.addEventListener('drop', (e) => {
    e.preventDefault()
    wrap.classList.remove('drop-target')
    const files = Array.from(e.dataTransfer.files || [])
    if (!files.length) return
    const paths = files.map(f => f.path).filter(Boolean)
    if (paths.length) {
      setState('happy')
      say('drop', `吃到了 ${paths.length} 个文件 🍔`, 2000)
      ipcRenderer.send('drop-files', paths)
    }
  })
}
bindDropZone(pet)
bindDropZone(wrap)

// 主进程让我们回到右下角
ipcRenderer.on('reset-position', () => {
  setPetPos(screenW - PET_W - 20, screenH - PET_H - 40)
  say('reset', '我回来啦 ✋', 1500)
})

ipcRenderer.on('skin-update', (_, { animations, skinLabel, skinName }) => {
  ANIMATIONS = animations
  currentSkinName = skinName || currentSkinName
  currentState = ''
  setState('idle')
  say('skin', `已换装：${skinLabel}`, 1800)
  resetIdleTimer()
})

// Track click count for hidden reactions
let clickCount = 0
let clickTimer = null
pet.addEventListener('click', () => {
  clickCount++
  clearTimeout(clickTimer)
  clickTimer = setTimeout(() => { clickCount = 0 }, 1500)
  if (clickCount >= 4) {
    clickCount = 0
    setState('annoyed')
    say('annoyed', '烦死了别戳了！😤', 2000)
    petLocked = true
    setTimeout(() => { petLocked = false; setState('idle') }, 2500)
  }
})

// ── Activity updates from main (foreground app changes) ──────────────────
// Each activity type maps to one or more GIF states (random pick when array)
const ACTIVITY_STATE = {
  coding:   'typing',
  terminal: 'typing',
  study:    'reading',
  creative: 'building',
  chat:     'conducting',
  leisure:  'groove',
  browse:   'idle',
}

let activityResetTimer = null
ipcRenderer.on('activity-update', (_, { type, message, animation, source }) => {
  if (isDragging) return
  const fromCli = source === 'cli'
  if (petLocked && !fromCli) return
  // 优先 main 指定的 animation（cli-watcher 直接指定 jump/thinking/typing），否则按 type 映射
  const rawAnimState = animation || ACTIVITY_STATE[type] || 'idle'
  const animState = fromCli && rawAnimState === 'building' ? 'typing' : rawAnimState
  const quoteKey = source === 'streak' ? `streak-${type}` : fromCli ? `cli-${rawAnimState}` : `activity-${type}`
  say(quoteKey, message, fromCli ? 2400 : 3500)
  setState(animState)
  resetIdleTimer()
  if (fromCli) {
    petLocked = animState !== 'jump'
  }
  // jump 是庆祝动作，短暂播完回 idle；CLI 工作状态要撑到下一次 watcher 刷新
  const holdMs = animState === 'jump' ? 2200 : fromCli ? 12_000 : 8000
  clearTimeout(activityResetTimer)
  activityResetTimer = setTimeout(() => {
    if (fromCli) petLocked = false
    if (!petLocked && !isDragging) setState('idle')
  }, holdMs)
})

// ── Status updates from main (API call lifecycle) ─────────────────────────
ipcRenderer.on('status-update', (_, { state, message }) => {
  say(`status-${state}`, message)
  dot.className = state === 'idle' ? '' : state === 'done' ? 'done' : state
  if (state === 'thinking') {
    setState('thinking')
    petLocked = true
  } else if (state === 'working') {
    setState('typing')
    petLocked = true
  } else if (state === 'done') {
    setState('jump')
    petLocked = true
    setTimeout(() => {
      petLocked = false
      setState('idle')
    }, 2200)
  } else if (state === 'idle') {
    petLocked = false
    setState('idle')
  }
  resetIdleTimer()
})

// ── Sleep timer: after long idle period, switch to sleeping ───────────────
const IDLE_TO_SLEEP_MS = 3 * 60_000   // 3 minutes
let idleTimer = null

function resetIdleTimer() {
  clearTimeout(idleTimer)
  if (currentState === 'sleeping') {
    if (!petLocked) setState('idle')
  }
  idleTimer = setTimeout(() => {
    if (!petLocked && !isDragging && currentState === 'idle') {
      setState('sleeping')
    }
  }, IDLE_TO_SLEEP_MS)
}

// Any mouse movement near the pet resets idle timer
window.addEventListener('mousemove', resetIdleTimer)

// ── Startup greeting ───────────────────────────────────────────────────────
const hour = new Date().getHours()
const greeting =
  hour >= 5 && hour < 12 ? '早上好！点我聊聊吧 ☀️' :
  hour >= 12 && hour < 17 ? '下午好！点我来聊 👋' :
  hour >= 17 && hour < 21 ? '晚上好！今天怎么样？' :
  '还没睡呢～ 找我聊聊吧'

window.addEventListener('load', () => {
  setTimeout(() => {
    showBubble(greeting)
    setState('peek')
    setTimeout(() => setState('idle'), 1800)
  }, 600)
  resetIdleTimer()
})

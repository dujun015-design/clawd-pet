const { ipcRenderer } = require('electron')

// ── Setup ─────────────────────────────────────────────────────────────────
const pet = document.getElementById('pet')
const wrap = document.getElementById('pet-wrap')
const bubble = document.getElementById('bubble')
const dot = document.getElementById('status-dot')

const { screenW, screenH, animations: ANIMATIONS } = ipcRenderer.sendSync('init')

const PET_W = 140
const PET_H = 140

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

function setState(name) {
  if (currentState === name) return
  const file = ANIMATIONS[name]
  if (!file) return
  currentState = name
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
  bubble.textContent = text
  bubble.style.display = 'block'
  clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => { bubble.style.display = 'none' }, durationMs)
}

// ── Click → wave + open chat ──────────────────────────────────────────────
let petLocked = false

function handleClick() {
  setState('happy')
  petLocked = true
  setTimeout(() => {
    petLocked = false
    setState('idle')
  }, 1200)
  ipcRenderer.send('open-chat')
}

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
    showBubble('烦死了别戳了！😤', 2000)
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
ipcRenderer.on('activity-update', (_, { type, message }) => {
  if (petLocked || isDragging) return
  const animState = ACTIVITY_STATE[type] || 'idle'
  showBubble(message)
  setState(animState)
  resetIdleTimer()
  // Keep the activity animation a little longer than the bubble
  clearTimeout(activityResetTimer)
  activityResetTimer = setTimeout(() => {
    if (!petLocked && !isDragging) setState('idle')
  }, 8000)
})

// ── Status updates from main (API call lifecycle) ─────────────────────────
ipcRenderer.on('status-update', (_, { state, message }) => {
  showBubble(message)
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
    }, 1800)
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

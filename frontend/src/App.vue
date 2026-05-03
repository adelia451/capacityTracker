<script setup>
import NavBar from './components/NavBar.vue'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = ['/', '/capacity', '/tasks', '/rest-mood', '/intake', '/history']

function handleKeydown(e) {
  if (!e.altKey) return
  const current = routes.indexOf(router.currentRoute.value.path)
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    router.push(routes[(current + 1) % routes.length])
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    router.push(routes[(current - 1 + routes.length) % routes.length])
  }
  const num = parseInt(e.key)
  if (!isNaN(num) && num >= 1 && num <= routes.length) {
    e.preventDefault()
    router.push(routes[num - 1])
  }
}

// background floating symbols — hex colors so they work in dynamically created elements
const BG_ITEMS = [
  { t: '✦', col: '#ffb2f7', x: 8,  y: 15, fs: 14, op: .5,  dur: 7,   del: 0,   r0: '0deg',  r1: '15deg',  r2: '-10deg' },
  { t: '♡', col: '#88a2ff', x: 22, y: 70, fs: 18, op: .45, dur: 9,   del: 1,   r0: '0deg',  r1: '-20deg', r2: '12deg'  },
  { t: '✿', col: '#ab9dff', x: 38, y: 30, fs: 12, op: .5,  dur: 8,   del: 2,   r0: '0deg',  r1: '10deg',  r2: '-8deg'  },
  { t: '⋆', col: '#c0e0ff', x: 55, y: 80, fs: 16, op: .55, dur: 6,   del: 0.5, r0: '0deg',  r1: '25deg',  r2: '-15deg' },
  { t: '✦', col: '#e3fc87', x: 70, y: 20, fs: 10, op: .45, dur: 10,  del: 3,   r0: '0deg',  r1: '-12deg', r2: '8deg'   },
  { t: '✧', col: '#ffb2f7', x: 82, y: 60, fs: 13, op: .5,  dur: 7.5, del: 1.5, r0: '0deg',  r1: '18deg',  r2: '-11deg' },
  { t: '♡', col: '#ab9dff', x: 92, y: 40, fs: 11, op: .4,  dur: 8.5, del: 4,   r0: '0deg',  r1: '-8deg',  r2: '14deg'  },
  { t: '˚',  col: '#88a2ff', x: 14, y: 88, fs: 18, op: .45, dur: 9.5, del: 2.5, r0: '0deg',  r1: '20deg',  r2: '-18deg' },
  { t: '✿', col: '#c0e0ff', x: 47, y: 55, fs: 14, op: .45, dur: 7,   del: 1,   r0: '0deg',  r1: '-15deg', r2: '10deg'  },
  { t: '⋆', col: '#e3fc87', x: 88, y: 85, fs: 10, op: .4,  dur: 11,  del: 0.8, r0: '0deg',  r1: '-22deg', r2: '16deg'  },
  { t: '★', col: '#ffb2f7', x: 30, y: 45, fs: 9,  op: .35, dur: 8,   del: 3.5, r0: '0deg',  r1: '8deg',   r2: '-6deg'  },
  { t: '✦', col: '#ab9dff', x: 65, y: 65, fs: 11, op: .4,  dur: 6.5, del: 2,   r0: '0deg',  r1: '-10deg', r2: '15deg'  },
]

// sparkle cursor effect — hex colors so they resolve in dynamic elements
const SPARKS = ['✦', '✧', '✿', '˚', '·', '⋆', '♡', '★']
const COLORS = ['#ffb2f7', '#ab9dff', '#88a2ff', '#c0e0ff', '#e3fc87']
let lastSpark = 0

function handleMouseMove(e) {
  const cur = document.getElementById('cursor')
  if (cur) {
    cur.style.left = e.clientX + 'px'
    cur.style.top  = e.clientY + 'px'
  }
  const now = Date.now()
  if (now - lastSpark > 60) {
    lastSpark = now
    const s = document.createElement('div')
    s.className = 'spark'
    s.textContent = SPARKS[Math.floor(Math.random() * SPARKS.length)]
    const dx = (Math.random() - 0.5) * 60
    const dy = (Math.random() - 0.5) * 60
    s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;color:${COLORS[Math.floor(Math.random() * COLORS.length)]};--dx:${dx}px;--dy:${dy}px;font-size:${8 + Math.random() * 10}px`
    document.body.appendChild(s)
    setTimeout(() => s.remove(), 700)
  }
}

onMounted(() => {
  // spawn background floating symbols
  const bgEl = document.getElementById('bg-layer')
  BG_ITEMS.forEach(({ t, col, x, y, fs, op, dur, del, r0, r1, r2 }) => {
    const el = document.createElement('div')
    el.className = 'floater'
    el.textContent = t
    el.style.cssText = `left:${x}%;top:${y}%;color:${col};--fs:${fs}px;--op:${op};--dur:${dur}s;--del:${del}s;--r0:${r0};--r1:${r1};--r2:${r2};filter:drop-shadow(0 0 4px ${col})`
    bgEl.appendChild(el)
  })
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <div id="cursor"></div>
  <div id="bg-layer"></div>
  <NavBar />
  <RouterView />
</template>

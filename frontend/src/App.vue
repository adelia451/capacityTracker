<script>
import NavBar from './components/NavBar.vue'

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
  { t: '✧', col: '#e3fc87', x: 5,  y: 50, fs: 9,  op: .35, dur: 9,   del: 5,   r0: '0deg',  r1: '12deg',  r2: '-9deg'  },
  { t: '˚',  col: '#ffd9fb', x: 18, y: 35, fs: 22, op: .4,  dur: 11,  del: 1.2, r0: '0deg',  r1: '-18deg', r2: '10deg'  },
  { t: '✦', col: '#c0e0ff', x: 33, y: 90, fs: 8,  op: .3,  dur: 7.5, del: 3,   r0: '0deg',  r1: '20deg',  r2: '-14deg' },
  { t: '⋆', col: '#ffb2f7', x: 50, y: 10, fs: 12, op: .45, dur: 8,   del: 0.3, r0: '0deg',  r1: '-10deg', r2: '18deg'  },
  { t: '♡', col: '#f5ffbd', x: 60, y: 50, fs: 10, op: .35, dur: 10,  del: 2.2, r0: '0deg',  r1: '14deg',  r2: '-12deg' },
  { t: '✿', col: '#ffb2f7', x: 75, y: 75, fs: 16, op: .4,  dur: 7,   del: 4.5, r0: '0deg',  r1: '-16deg', r2: '8deg'   },
  { t: '★', col: '#ddd6ff', x: 85, y: 25, fs: 11, op: .4,  dur: 9,   del: 1.8, r0: '0deg',  r1: '22deg',  r2: '-16deg' },
  { t: '✦', col: '#88a2ff', x: 95, y: 70, fs: 8,  op: .3,  dur: 12,  del: 0.6, r0: '0deg',  r1: '-8deg',  r2: '12deg'  },
  { t: '˚',  col: '#ab9dff', x: 42, y: 18, fs: 14, op: .4,  dur: 8.5, del: 3.8, r0: '0deg',  r1: '16deg',  r2: '-20deg' },
  { t: '✧', col: '#ffc1f9', x: 28, y: 62, fs: 10, op: .35, dur: 6.5, del: 2.8, r0: '0deg',  r1: '-14deg', r2: '10deg'  },
  { t: '⋆', col: '#ddd6ff', x: 72, y: 92, fs: 13, op: .45, dur: 9.5, del: 1.6, r0: '0deg',  r1: '18deg',  r2: '-8deg'  },
  { t: '♡', col: '#c0e0ff', x: 10, y: 25, fs: 9,  op: .3,  dur: 7,   del: 4.2, r0: '0deg',  r1: '-22deg', r2: '14deg'  },
  { t: '✦', col: '#ffd9fb', x: 53, y: 38, fs: 7,  op: .3,  dur: 10,  del: 0.9, r0: '0deg',  r1: '10deg',  r2: '-6deg'  },
  { t: '✿', col: '#e3fc87', x: 78, y: 48, fs: 9,  op: .35, dur: 8,   del: 5.5, r0: '0deg',  r1: '-12deg', r2: '16deg'  },
  { t: '✦', col: '#ffc1f9', x: 3,  y: 72, fs: 11, op: .4,  dur: 7.5, del: 6,   r0: '0deg',  r1: '14deg',  r2: '-10deg' },
  { t: '⋆', col: '#ab9dff', x: 16, y: 5,  fs: 15, op: .45, dur: 9,   del: 1.4, r0: '0deg',  r1: '-18deg', r2: '12deg'  },
  { t: '˚',  col: '#e3fc87', x: 26, y: 82, fs: 10, op: .3,  dur: 11,  del: 3.2, r0: '0deg',  r1: '20deg',  r2: '-16deg' },
  { t: '★', col: '#c0e0ff', x: 35, y: 12, fs: 8,  op: .35, dur: 8.5, del: 0.7, r0: '0deg',  r1: '-10deg', r2: '8deg'   },
  { t: '♡', col: '#ffb2f7', x: 44, y: 68, fs: 13, op: .4,  dur: 6,   del: 4.8, r0: '0deg',  r1: '16deg',  r2: '-14deg' },
  { t: '✧', col: '#ddd6ff', x: 58, y: 22, fs: 10, op: .35, dur: 10,  del: 2.6, r0: '0deg',  r1: '-20deg', r2: '10deg'  },
  { t: '✿', col: '#88a2ff', x: 67, y: 58, fs: 7,  op: .3,  dur: 7,   del: 5.2, r0: '0deg',  r1: '12deg',  r2: '-8deg'  },
  { t: '✦', col: '#f5ffbd', x: 80, y: 8,  fs: 12, op: .4,  dur: 9.5, del: 1.1, r0: '0deg',  r1: '-14deg', r2: '18deg'  },
  { t: '⋆', col: '#ffd9fb', x: 90, y: 52, fs: 16, op: .45, dur: 8,   del: 3.6, r0: '0deg',  r1: '22deg',  r2: '-12deg' },
  { t: '˚',  col: '#ffb2f7', x: 7,  y: 42, fs: 8,  op: .3,  dur: 12,  del: 0.4, r0: '0deg',  r1: '-8deg',  r2: '14deg'  },
  { t: '♡', col: '#ab9dff', x: 20, y: 95, fs: 11, op: .35, dur: 7,   del: 6.5, r0: '0deg',  r1: '18deg',  r2: '-20deg' },
  { t: '★', col: '#ffc1f9', x: 40, y: 52, fs: 9,  op: .3,  dur: 9,   del: 2.1, r0: '0deg',  r1: '-16deg', r2: '10deg'  },
  { t: '✦', col: '#c0e0ff', x: 62, y: 35, fs: 13, op: .4,  dur: 6.5, del: 4.1, r0: '0deg',  r1: '10deg',  r2: '-18deg' },
  { t: '✧', col: '#e3fc87', x: 73, y: 82, fs: 8,  op: .35, dur: 11,  del: 1.9, r0: '0deg',  r1: '-22deg', r2: '16deg'  },
  { t: '✿', col: '#ddd6ff', x: 84, y: 15, fs: 14, op: .4,  dur: 8,   del: 5.8, r0: '0deg',  r1: '14deg',  r2: '-10deg' },
  { t: '⋆', col: '#88a2ff', x: 97, y: 35, fs: 10, op: .35, dur: 7.5, del: 3.4, r0: '0deg',  r1: '-12deg', r2: '20deg'  },
  { t: '˚',  col: '#ffd9fb', x: 12, y: 58, fs: 20, op: .35, dur: 10,  del: 0.2, r0: '0deg',  r1: '24deg',  r2: '-16deg' },
  { t: '♡', col: '#f5ffbd', x: 24, y: 22, fs: 8,  op: .3,  dur: 8.5, del: 4.6, r0: '0deg',  r1: '-10deg', r2: '12deg'  },
  { t: '✦', col: '#ab9dff', x: 48, y: 78, fs: 11, op: .4,  dur: 9,   del: 2.4, r0: '0deg',  r1: '16deg',  r2: '-8deg'  },
  { t: '★', col: '#ffb2f7', x: 57, y: 5,  fs: 7,  op: .3,  dur: 11,  del: 5.1, r0: '0deg',  r1: '-18deg', r2: '14deg'  },
  { t: '✧', col: '#88a2ff', x: 69, y: 42, fs: 15, op: .4,  dur: 7,   del: 1.7, r0: '0deg',  r1: '20deg',  r2: '-12deg' },
  { t: '⋆', col: '#ffc1f9', x: 77, y: 28, fs: 9,  op: .35, dur: 8,   del: 6.2, r0: '0deg',  r1: '-14deg', r2: '18deg'  },
  { t: '✿', col: '#c0e0ff', x: 93, y: 88, fs: 12, op: .4,  dur: 9.5, del: 0.5, r0: '0deg',  r1: '12deg',  r2: '-22deg' },
  { t: '✦', col: '#ddd6ff', x: 2,  y: 92, fs: 10, op: .35, dur: 7.5, del: 3.9, r0: '0deg',  r1: '-20deg', r2: '8deg'   },
  { t: '˚',  col: '#e3fc87', x: 36, y: 75, fs: 16, op: .4,  dur: 10,  del: 2.9, r0: '0deg',  r1: '18deg',  r2: '-14deg' },
  { t: '♡', col: '#ffb2f7', x: 86, y: 95, fs: 8,  op: .3,  dur: 8,   del: 4.4, r0: '0deg',  r1: '-8deg',  r2: '10deg'  },
]

const SPARKS = ['✦', '✧', '✿', '˚', '·', '⋆', '♡', '★']
const COLORS = ['#ffb2f7', '#ab9dff', '#88a2ff', '#c0e0ff', '#e3fc87']
const ROUTES = ['/', '/capacity', '/tasks', '/rest-mood', '/intake', '/history']
let lastSpark = 0

export default {
  name: 'App',
  components: { NavBar },
  data() {
    return {
      boundKeydown: null,
      boundMouseMove: null
    }
  },
  methods: {
    handleKeydown(e) {
      if (!e.altKey) return
      const current = ROUTES.indexOf(this.$route.path)
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        this.$router.push(ROUTES[(current + 1) % ROUTES.length])
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        this.$router.push(ROUTES[(current - 1 + ROUTES.length) % ROUTES.length])
      }
      const num = parseInt(e.key)
      if (!isNaN(num) && num >= 1 && num <= ROUTES.length) {
        e.preventDefault()
        this.$router.push(ROUTES[num - 1])
      }
    },
    handleMouseMove(e) {
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
  },
  mounted() {
    const bgEl = document.getElementById('bg-layer')
    BG_ITEMS.forEach(({ t, col, x, y, fs, op, dur, del, r0, r1, r2 }) => {
      const el = document.createElement('div')
      el.className = 'floater'
      el.textContent = t
      el.style.cssText = `left:${x}%;top:${y}%;color:${col};--fs:${fs}px;--op:${op};--dur:${dur}s;--del:${del}s;--r0:${r0};--r1:${r1};--r2:${r2};filter:drop-shadow(0 0 4px ${col})`
      bgEl.appendChild(el)
    })
    this.boundKeydown = (e) => this.handleKeydown(e)
    this.boundMouseMove = (e) => this.handleMouseMove(e)
    window.addEventListener('keydown', this.boundKeydown)
    window.addEventListener('mousemove', this.boundMouseMove)
  },
  unmounted() {
    window.removeEventListener('keydown', this.boundKeydown)
    window.removeEventListener('mousemove', this.boundMouseMove)
  }
}
</script>

<template>
  <div id="cursor"></div>
  <div id="bg-layer"></div>
  <NavBar />
  <RouterView />
</template>

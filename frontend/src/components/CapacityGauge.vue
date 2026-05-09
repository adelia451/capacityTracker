<script>
export default {
  name: 'CapacityGauge',
  props: {
    score: { type: Number, default: 0 },
    max:   { type: Number, default: 10 }
  },
  data() {
    return {
      r:  46,
      cx: 54,
      cy: 54
    }
  },
  computed: {
    C()      { return 2 * Math.PI * this.r },
    filled() { return (this.score / this.max) * this.C }
  }
}
</script>

<template>
  <svg width="108" height="108" viewBox="0 0 108 108" style="flex-shrink: 0;">
    <!-- outer decorative dashed ring -->
    <circle :cx="cx" :cy="cy" :r="r + 8"
      fill="none" stroke="var(--pink)" stroke-width="1"
      stroke-dasharray="3 7" opacity=".2"
      style="animation: gauge-float 6s ease-in-out infinite"/>

    <!-- middle decorative dashed ring -->
    <circle :cx="cx" :cy="cy" :r="r + 3"
      fill="none" stroke="var(--blue)" stroke-width="1"
      stroke-dasharray="5 5" opacity=".18"/>

    <!-- track (unfilled arc) -->
    <circle :cx="cx" :cy="cy" :r="r"
      fill="none" stroke="color-mix(in srgb, var(--text-muted) 15%, transparent)" stroke-width="8"/>

    <!-- filled arc — starts from the top (offset by 25% of circumference) -->
    <circle :cx="cx" :cy="cy" :r="r"
      fill="none" stroke="url(#capGrad)" stroke-width="8"
      :stroke-dasharray="`${filled} ${C - filled}`"
      :stroke-dashoffset="C * 0.25"
      stroke-linecap="round"/>

    <defs>
      <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="var(--light-yellow)"/>
        <stop offset="50%"  stop-color="var(--light-cyan)"/>
        <stop offset="100%" stop-color="var(--light-purple)"/>
      </linearGradient>
    </defs>

    <!-- score number -->
    <text :x="cx" :y="cy - 5" text-anchor="middle"
      font-size="24" font-weight="800"
      :font-family="'Comfortaa, sans-serif'"
      fill="var(--text-primary)">{{ Math.round(score * 10) / 10 }}</text>

    <!-- /max label -->
    <text :x="cx" :y="cy + 11" text-anchor="middle"
      font-size="9" font-family="'DM Mono', monospace"
      fill="var(--text-muted)">/{{ max }}</text>

    <!-- decorative sparkles -->
    <text :x="cx - 28" :y="cy - 33" font-size="9" fill="var(--accent-pink)" opacity=".7">✦</text>
    <text :x="cx + 22" :y="cy + 36" font-size="7" fill="var(--purple)" opacity=".6">✧</text>
    <text :x="cx + 28" :y="cy - 28" font-size="7" fill="var(--text-muted)" opacity=".5">˚</text>
  </svg>
</template>

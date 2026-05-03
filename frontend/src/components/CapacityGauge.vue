<script setup>
// props: score (number) and max (number, defaults to 10)
const props = defineProps({
  score: { type: Number, default: 0 },
  max:   { type: Number, default: 10 }
})

const r  = 46
const cx = 54
const cy = 54
const C  = 2 * Math.PI * r          // full circumference
const filled = (props.score / props.max) * C  // how much of the arc to fill
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
      fill="none" stroke="color-mix(in srgb, var(--peri) 15%, transparent)" stroke-width="8"/>

    <!-- filled arc — starts from the top (offset by 25% of circumference) -->
    <circle :cx="cx" :cy="cy" :r="r"
      fill="none" stroke="url(#capGrad)" stroke-width="8"
      :stroke-dasharray="`${filled} ${C - filled}`"
      :stroke-dashoffset="C * 0.25"
      stroke-linecap="round"
      style="filter: drop-shadow(0 0 10px var(--pink)); animation: ring-pulse 3s ease-in-out infinite"/>

    <defs>
      <linearGradient id="capGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%"   stop-color="var(--pink)"/>
        <stop offset="50%"  stop-color="var(--blue)"/>
        <stop offset="100%" stop-color="var(--peri)"/>
      </linearGradient>
    </defs>

    <!-- score number -->
    <text :x="cx" :y="cy - 5" text-anchor="middle"
      font-size="24" font-weight="800"
      :font-family="'Comfortaa, sans-serif'"
      fill="var(--navy)">{{ score }}</text>

    <!-- /max label -->
    <text :x="cx" :y="cy + 11" text-anchor="middle"
      font-size="9" font-family="'DM Mono', monospace"
      fill="var(--peri)">/{{ max }}</text>

    <!-- decorative sparkles -->
    <text :x="cx - 28" :y="cy - 33" font-size="9" fill="var(--pink)" opacity=".7">✦</text>
    <text :x="cx + 22" :y="cy + 36" font-size="7" fill="var(--blue)" opacity=".6">✧</text>
    <text :x="cx + 28" :y="cy - 28" font-size="7" fill="var(--peri)" opacity=".5">˚</text>
  </svg>
</template>

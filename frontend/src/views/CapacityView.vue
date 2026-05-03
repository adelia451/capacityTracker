<script setup>
import { onMounted } from 'vue'
import { useCapacityStore } from '../stores/capacity'
import CapacityGauge from '../components/CapacityGauge.vue'

const capacityStore = useCapacityStore()
const today = new Date().toLocaleDateString('en-CA')

onMounted(async () => {
  await capacityStore.fetchCapacity(today)
  await capacityStore.fetchPrediction()
})
</script>

<template>
  <main>
    <!-- TODAY'S CAPACITY + CONTRIBUTING FACTORS — same card, like the goal -->
    <section class="card card-pink">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Today's Capacity</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>

      <!-- gauge + bar -->
      <div style="display: flex; align-items: center; gap: 22px; margin-bottom: 14px;">
        <CapacityGauge v-if="capacityStore.score?.score != null" :score="capacityStore.score.score" />
        <div v-else class="score-null">no log yet</div>
        <div style="flex: 1;">
          <div class="bar-track">
            <div class="bar-fill bar-ok"
              :style="{ width: capacityStore.score?.score ? Math.min(100, (capacityStore.score.score / 10) * 100) + '%' : '0%' }">
            </div>
          </div>
        </div>
      </div>

      <!-- divider before factors -->
      <div class="ct" v-if="capacityStore.score?.factors?.length">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Contributing factors</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>

      <!-- factors -->
      <div v-if="capacityStore.score?.factors?.length">
        <div v-for="factor in capacityStore.score.factors" :key="factor.label"
          class="factor-row" :class="factor.positive ? 'factor-pos' : 'factor-neg'">
          <span>{{ factor.label }}</span>
          <span class="factor-impact" :class="factor.positive ? 'positive' : 'negative'">
            {{ factor.positive ? '+' : '-' }}{{ factor.impact }}
          </span>
        </div>
      </div>
      <p v-else-if="capacityStore.score">no log for today</p>
      <p v-else>Loading...</p>
    </section>

    <!-- PREDICTIONS — separate card -->
    <section class="card card-blue">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Coming up</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <p v-if="capacityStore.prediction?.prediction">
        {{ capacityStore.prediction.prediction }}
      </p>
      <div v-else-if="capacityStore.prediction?.days">
        <div v-for="day in capacityStore.prediction.days" :key="day.label" class="prediction-row">
          <span class="prediction-label">{{ day.label }}</span>
          <span class="prediction-score">{{ day.score }}</span>
          <span class="prediction-confidence">{{ day.confidence }}% confidence</span>
        </div>
      </div>
      <p v-else>Loading...</p>
    </section>
  </main>
</template>

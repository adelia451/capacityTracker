<script setup>
import { onMounted } from 'vue'
import { useCapacityStore } from '../stores/capacity'

const capacityStore = useCapacityStore()
const today = new Date().toLocaleDateString('en-CA')

onMounted(async () => {
  await capacityStore.fetchCapacity(today)
  await capacityStore.fetchPrediction()
})
</script>

<template>
  <main>
    <!-- TODAY'S SCORE -->
    <section class="card card-pink">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Today's Capacity</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <p v-if="capacityStore.score">{{ capacityStore.score?.score ?? '-' }}</p>
      <p v-else>Loading...</p>
    </section>

    <!-- CONTRIBUTING FACTORS -->
    <section class="card card-pink">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>What affected today</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <div v-if="capacityStore.score?.factors?.length">
        <div v-for="factor in capacityStore.score.factors" :key="factor.label">
          <span>{{ factor.label }}</span>
          <span>{{ factor.positive ? '+' : '-' }}{{ factor.impact }}</span>
        </div>
      </div>
      <p v-else>no log for today</p>
    </section>

    <!-- PREDICTIONS -->
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
        <div v-for="day in capacityStore.prediction.days" :key="day.label">
          <span>{{ day.label }}</span>
          <span>{{ day.score }}</span>
          <span>{{ day.confidence }}% confidence</span>
        </div>
      </div>
      <p v-else>Loading...</p>
    </section>
  </main>
</template>
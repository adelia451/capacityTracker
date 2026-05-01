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
    <h1>Capacity</h1>

    <!-- TODAY'S SCORE -->
    <section>
      <h2>Today</h2>
      <p v-if="capacityStore.score">{{ capacityStore.score?.score ?? '-' }}</p>
      <p v-else>Loading...</p>
    </section>

    <!-- CONTRIBUTING FACTORS -->
    <!-- what helped and hurt today's score (e.g. good sleep +1.2, high stress -0.5) -->
    <!-- loop over the factors array once you know the shape from the API response -->
    <section>
      <h2>What affected today</h2>
      <div v-if="capacityStore.score?.factors?.length">
        <div v-for="factor in capacityStore.score.factors" :key="factor.label">
          <span>{{ factor.label }}</span>
          <span>{{ factor.positive ? '+' : '-' }}{{ factor.impact }}</span>
        </div>
      </div>
      <p v-else>no log for today</p>
    </section>

    <!-- PREDICTIONS -->
    <!-- tomorrow, day after, in 3 days — each with a score and confidence % -->
    <!-- check GET /api/prediction in Thunder Client first to confirm the shape -->
    <!-- if the endpoint only returns one day, that needs to be updated on the backend -->
    <section>
      <h2>Coming up</h2>
      <p v-if="capacityStore.prediction?.prediction">
        {{ capacityStore.prediction.prediction }}
      </p>

      <!-- enough data — days is an array -->
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

<script setup>
import { onMounted } from 'vue'
import { useLogsStore } from '../stores/logs'
import { useCapacityStore } from '../stores/capacity'
import CapacityGauge from '../components/CapacityGauge.vue'

const logsStore = useLogsStore()
const capacityStore = useCapacityStore()
const today = new Date().toLocaleDateString('en-CA')

const dateDisplay = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

onMounted(async () => {
  await logsStore.fetchTodayLog(today)
  await capacityStore.fetchCapacity(today)
  await capacityStore.fetchInsights()
})
</script>

<template>
  <main>
    <!-- TODAY'S SUMMARY -->
    <section class="card card-pink">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>{{ dateDisplay }}</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>

      <div class="summary-row" style="align-items: flex-start; gap: 16px;">
        <CapacityGauge v-if="capacityStore.score?.score != null" :score="capacityStore.score.score" />
        <div v-else class="summary-value muted">capacity not logged yet</div>
      </div>

      <div class="summary-row" v-if="logsStore.todayLog?.sleep?.hours">
        <span class="summary-label">Sleep</span>
        <span class="summary-value">{{ logsStore.todayLog.sleep.hours }}h — {{ logsStore.todayLog.sleep.state }}</span>
      </div>
      <div class="summary-row" v-else>
        <span class="summary-label">Sleep</span>
        <span class="summary-value muted">not logged yet</span>
      </div>

      <div class="summary-row" v-if="logsStore.todayLog?.medication?.takenAt">
        <span class="summary-label">Medication</span>
        <span class="summary-value">taken at {{ logsStore.todayLog.medication.takenAt }}</span>
      </div>
      <div class="summary-row" v-else-if="logsStore.todayLog?.medication?.skipped">
        <span class="summary-label">Medication</span>
        <span class="summary-value">skipped</span>
      </div>
      <div class="summary-row" v-else>
        <span class="summary-label">Medication</span>
        <span class="summary-value muted">not logged yet</span>
      </div>

      <div class="summary-row" v-if="logsStore.todayLog?.moodLogs?.length">
        <span class="summary-label">Mood</span>
        <span class="summary-value">{{ logsStore.todayLog.moodLogs.length }} logged</span>
      </div>

      <div class="summary-row" v-if="logsStore.todayLog?.stressLogs?.length">
        <span class="summary-label">Stress</span>
        <span class="summary-value">{{ logsStore.todayLog.stressLogs.length }} logged</span>
      </div>
    </section>

    <!-- INSIGHTS -->
    <section class="card card-blue">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Insights</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <div v-if="!capacityStore.insights">Loading...</div>
      <div v-else>
        <div v-for="(insight, i) in capacityStore.insights" :key="insight"
          class="insight-card" :class="i % 3 === 0 ? 'insight-blue' : i % 3 === 1 ? 'insight-pink' : 'insight-peri'">
          {{ insight }}
        </div>
      </div>
    </section>
  </main>
</template>

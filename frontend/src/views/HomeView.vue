<script setup>
import { onMounted } from 'vue'
import { useLogsStore } from '../stores/logs'
import { useCapacityStore } from '../stores/capacity'

const logsStore = useLogsStore()
const capacityStore = useCapacityStore()
const today = new Date().toLocaleDateString('en-CA')

onMounted(async () => {
  await logsStore.fetchTodayLog(today)
  await capacityStore.fetchCapacity(today)
  await capacityStore.fetchInsights()
})
</script>

<template>
  <main>
    <!-- TODAY'S SUMMARY -->
    <!-- quick snapshot of what's been logged today -->
    <section class="card card-pink">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Today</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>

      <!-- capacity score — replace with actual field name once you check the API response -->
      <div>
        <span>Capacity</span>
        <span v-if="capacityStore.score">{{ capacityStore.score?.score ?? '-' }}</span>
        <span v-else>—</span>
      </div>

      <!-- sleep summary — logsStore.todayLog holds the full log object -->
      <div v-if="logsStore.todayLog?.sleep?.hours">
        <span>Sleep</span>
        <span>{{ logsStore.todayLog.sleep.hours }}h — {{ logsStore.todayLog.sleep.state }}</span>
      </div>
      <div v-else>
        <span>Sleep</span>
        <span>not logged yet</span>
      </div>

      <!-- medication status -->
      <div v-if="logsStore.todayLog?.medication?.takenAt">
        <span>Medication</span>
        <span>taken at {{ logsStore.todayLog.medication.takenAt }}</span>
      </div>
      <div v-else-if="logsStore.todayLog?.medication?.skipped">
        <span>Medication</span>
        <span>skipped</span>
      </div>
      <div v-else>
        <span>Medication</span>
        <span>not logged yet</span>
      </div>

      <!-- mood entries today -->
      <div v-if="logsStore.todayLog?.moodLogs?.length">
        <span>Mood entries</span>
        <span>{{ logsStore.todayLog.moodLogs.length }} logged</span>
      </div>

      <!-- stress entries today -->
      <div v-if="logsStore.todayLog?.stressLogs?.length">
        <span>Stress entries</span>
        <span>{{ logsStore.todayLog.stressLogs.length }} logged</span>
      </div>
    </section>

    <!-- INSIGHTS -->
    <!-- patterns the system has learned from your data (needs 7+ days of logs) -->
    <section class="card card-blue">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Insights</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <div v-if="!capacityStore.insights">Loading...</div>
      <div v-else>
        <p v-for="insight in capacityStore.insights" :key="insight">{{ insight }}</p>
      </div>
    </section>
  </main>
</template>

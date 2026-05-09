<script>
import { useLogsStore } from '../stores/logs'
import { useCapacityStore } from '../stores/capacity'
import CapacityGauge from '../components/CapacityGauge.vue'

export default {
  name: 'HomeView',
  components: { CapacityGauge },
  setup() {
    return {
      logsStore: useLogsStore(),
      capacityStore: useCapacityStore()
    }
  },
  data() {
    return {
      today: new Date().toLocaleDateString('en-CA'),
      dateDisplay: new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }),
      error: null,
      ratingMessage: ''
    }
  },
  methods: {
    formatHours(h) {
      if (!h) return '—'
      const hrs = Math.floor(h)
      const mins = Math.round((h - hrs) * 60)
      if (mins === 0) return `${hrs}h`
      return `${hrs}h ${mins}m`
    },
    async saveRating(n) {
      await this.logsStore.saveRating(this.today, n)
      this.ratingMessage = 'Rating saved!'
      await this.logsStore.fetchTodayLog(this.today)
    }
  },
  async mounted() {
    try {
      await this.logsStore.fetchTodayLog(this.today)
      await this.capacityStore.fetchCapacity(this.today)
      await this.capacityStore.fetchInsights()
      await this.capacityStore.fetchCorrelations()
    } catch {
      this.error = 'Could not load data. Check your connection.'
    }
  }
}
</script>

<template>
  <main>
    <p v-if="error" class="state-error">{{ error }}</p>
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
        <span class="summary-value">{{ formatHours(logsStore.todayLog.sleep.hours) }} — {{ logsStore.todayLog.sleep.state }}</span>
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

      <!-- END OF DAY RATING -->
      <div class="ct" style="margin-top: 16px;">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>How capable did you feel today?</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <div v-if="logsStore.todayLog?.actualCapacityRating" class="summary-row">
        <span class="summary-label">Your rating</span>
        <span class="summary-value">{{ logsStore.todayLog.actualCapacityRating }} / 10</span>
      </div>
      <div class="rating-buttons">
        <button v-for="n in 10" :key="n" type="button"
          class="btn-rating"
          :class="{ selected: logsStore.todayLog?.actualCapacityRating === n }"
          @click="saveRating(n)">{{ n }}</button>
      </div>
      <div class="rating-anchors">
        <span>completely depleted</span>
        <span>limited but present</span>
        <span>fully capable</span>
      </div>
      <p v-if="ratingMessage" class="message">{{ ratingMessage }}</p>
    </section>

    <!-- INSIGHTS -->
    <section class="card card-blue">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Insights</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <div v-if="!capacityStore.insights" class="state-loading">Loading...</div>
      <div v-else-if="capacityStore.insights.length === 0" class="state-empty">Log more days to see insights.</div>
      <div v-else>
        <div v-for="(insight, i) in capacityStore.insights" :key="insight"
          class="insight-card" :class="i % 3 === 0 ? 'insight-blue' : i % 3 === 1 ? 'insight-pink' : 'insight-peri'">
          {{ insight }}
        </div>
      </div>
    </section>

    <!-- CORRELATIONS -->
    <section class="card card-purple" v-if="capacityStore.correlations?.length">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Discovered patterns</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <div v-for="(pattern, i) in capacityStore.correlations" :key="i"
        class="insight-card insight-peri">
        {{ pattern }}
      </div>
    </section>
  </main>
</template>

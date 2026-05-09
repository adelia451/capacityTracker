<script>
import { useCapacityStore } from '../stores/capacity'
import { useLogsStore } from '../stores/logs'
import CapacityGauge from '../components/CapacityGauge.vue'

export default {
  name: 'CapacityView',
  components: { CapacityGauge },
  setup() {
    return {
      capacityStore: useCapacityStore(),
      logsStore: useLogsStore()
    }
  },
  data() {
    return {
      today: new Date().toLocaleDateString('en-CA'),
      error: null
    }
  },
  async mounted() {
    try {
      await this.logsStore.fetchTodayLog(this.today)
      await this.capacityStore.fetchCapacity(this.today)
      await this.capacityStore.fetchPrediction()
    } catch {
      this.error = 'Could not load capacity data. Check your connection.'
    }
  }
}
</script>

<template>
  <main>
    <p v-if="error" class="state-error">{{ error }}</p>
    <section class="card card-pink">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Today's Capacity</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>

      <!-- gauge + log status + focus window -->
      <div style="display: flex; align-items: center; gap: 24px; margin-bottom: 14px;">
        <CapacityGauge v-if="capacityStore.score?.score != null" :score="capacityStore.score.score" />
        <div v-else class="score-null">no log yet</div>

        <div class="cap-sidebar">
          <!-- mini log status -->
          <div class="log-status">
            <span :class="logsStore.todayLog?.sleep?.hours ? 'status-done' : 'status-missing'">
              <span class="material-symbols-rounded" :class="{ filled: logsStore.todayLog?.sleep?.hours }" style="font-size:16px;">{{ logsStore.todayLog?.sleep?.hours ? 'check_circle' : 'radio_button_unchecked' }}</span>
              sleep
            </span>
            <span :class="(logsStore.todayLog?.medication?.takenAt || logsStore.todayLog?.medication?.skipped) ? 'status-done' : 'status-missing'">
              <span class="material-symbols-rounded" :class="{ filled: logsStore.todayLog?.medication?.takenAt || logsStore.todayLog?.medication?.skipped }" style="font-size:16px;">{{ (logsStore.todayLog?.medication?.takenAt || logsStore.todayLog?.medication?.skipped) ? 'check_circle' : 'radio_button_unchecked' }}</span>
              medication
            </span>
            <span :class="logsStore.todayLog?.moodLogs?.length ? 'status-done' : 'status-missing'">
              <span class="material-symbols-rounded" :class="{ filled: logsStore.todayLog?.moodLogs?.length }" style="font-size:16px;">{{ logsStore.todayLog?.moodLogs?.length ? 'check_circle' : 'radio_button_unchecked' }}</span>
              mood
            </span>
            <span :class="logsStore.todayLog?.stressLogs?.length ? 'status-done' : 'status-missing'">
              <span class="material-symbols-rounded" :class="{ filled: logsStore.todayLog?.stressLogs?.length }" style="font-size:16px;">{{ logsStore.todayLog?.stressLogs?.length ? 'check_circle' : 'radio_button_unchecked' }}</span>
              stress
            </span>
          </div>

          <!-- focus window -->
          <div class="focus-window">
            <span class="focus-label">focus window</span>
            <span v-if="logsStore.todayLog?.medication?.feltOnset && logsStore.todayLog?.medication?.feltEnd" class="focus-times">
              {{ logsStore.todayLog.medication.feltOnset }} → {{ logsStore.todayLog.medication.feltEnd }}
            </span>
            <span v-else class="focus-times-missing">log medication to see</span>
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
        <div v-for="factor in capacityStore.score.factors" :key="factor.key || factor.label"
          class="factor-row" :class="factor.neutral ? 'factor-neutral' : factor.positive ? 'factor-pos' : 'factor-neg'">
          <span>{{ factor.label }}</span>
          <span class="factor-impact" :class="factor.neutral ? 'neutral' : factor.positive ? 'positive' : 'negative'">
            <span class="material-symbols-rounded" style="font-size:14px; vertical-align:middle;">{{ factor.neutral ? 'remove' : factor.positive ? 'arrow_upward' : 'arrow_downward' }}</span>{{ Math.round(factor.impact * 100) / 100 }}
          </span>
        </div>
      </div>
      <p v-else-if="capacityStore.score">no log for today</p>
      <p v-else>Loading...</p>
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
        <div v-for="day in capacityStore.prediction.days" :key="day.label" class="prediction-row">
          <span class="prediction-label">{{ day.label }}</span>
          <span class="prediction-score">{{ day.score }}</span>
          <span class="prediction-confidence">{{ day.confidence }}% confidence</span>
        </div>
      </div>
      <p v-else>Loading...</p>
    </section>

    <!-- CALIBRATE -->
    <section class="card card-blue">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Weight Learning</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
        Recalculates how much each factor contributes to your capacity based on your end-of-day ratings. Needs at least 7 rated days.
      </p>
      <button class="btn-save" @click="capacityStore.calibrate()" :disabled="capacityStore.calibrating">
        {{ capacityStore.calibrating ? 'Calibrating...' : 'Run calibration' }}
      </button>
      <p v-if="capacityStore.calibrateMessage" class="message" style="margin-top: 10px;">
        {{ capacityStore.calibrateMessage }}
      </p>
    </section>
  </main>
</template>

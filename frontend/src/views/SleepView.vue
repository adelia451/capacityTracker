<script setup>
import { ref, onMounted } from 'vue'
import { useLogsStore } from '../stores/logs'

// ---------- STORE CONNECTION ----------
const logsStore = useLogsStore()

// ---------- REACTIVE STATE (REFS) ----------
const today = new Date().toLocaleDateString('en-CA')
const message = ref('')
const calculatedHours = ref(null)

const bedTime = ref('')
const wakeTime = ref('')
const sleepState = ref('')
const sleepStates = ['sleepy', 'tired', 'neutral', 'awake', 'energized']

const napStart = ref('')
const napEnd = ref('')
const feltRestedAfter = ref('neutral')

// ---------- PRE-FILL ON PAGE LOAD ----------
onMounted(async () => {
  await logsStore.fetchTodayLog(today)
  const sleep = logsStore.todayLog?.sleep
  if (sleep) {
    bedTime.value   = sleep.start || ''
    wakeTime.value  = sleep.end   || ''
    sleepState.value = sleep.state || ''
  }
})

// ---------- FUNCTIONS ----------
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

async function saveSleep() {
  if (!bedTime.value || !wakeTime.value) {
    message.value = 'Please enter bed time and wake time'
    return
  }
  if (!sleepState.value) {
    message.value = 'Please select a sleep state'
    return
  }

  let minutes = timeToMinutes(wakeTime.value) - timeToMinutes(bedTime.value)
  if (minutes < 0) minutes += 1440
  const hours = minutes / 60

  await logsStore.saveSleep(today, {
    start: bedTime.value,
    end: wakeTime.value,
    hours: hours,
    state: sleepState.value
  })

  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  calculatedHours.value = `${h} hours ${m} minutes`
  message.value = 'Sleep logged!'
}

async function saveNap() {
  if (!napStart.value || !napEnd.value) {
    message.value = 'Please enter nap start and end time'
    return
  }

  let minutes = timeToMinutes(napEnd.value) - timeToMinutes(napStart.value)
  if (minutes < 0) minutes += 1440
  const hours = minutes / 60

  await logsStore.saveNap(today, {
    start: napStart.value,
    end: napEnd.value,
    hours: hours,
    feltRestedAfter: feltRestedAfter.value
  })

  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  calculatedHours.value = `${h} hours ${m} minutes`
  message.value = 'Nap logged!'
}
</script>

<template>
  <main>
    <h1>Sleep</h1>

    <form @submit.prevent="saveSleep">
      <label>Bed time</label>
      <input type="time" v-model="bedTime" />

      <label>Wake time</label>
      <input type="time" v-model="wakeTime" />

      <label>Sleep state</label>
      <div>
        <button
          v-for="state in sleepStates"
          :key="state"
          type="button"
          :class="{ selected: sleepState === state }"
          @click="sleepState = state"
        >{{ state }}</button>
      </div>

      <button type="submit">Save sleep</button>
    </form>

    <h1>Nap</h1>

    <form @submit.prevent="saveNap">
      <label>Nap start</label>
      <input type="time" v-model="napStart" />

      <label>Nap end</label>
      <input type="time" v-model="napEnd" />

      <label>Felt after nap</label>
      <div>
        <button
          v-for="state in sleepStates"
          :key="state"
          type="button"
          :class="{ selected: feltRestedAfter === state }"
          @click="feltRestedAfter = state"
        >{{ state }}</button>
      </div>

      <button type="submit">Save nap</button>
    </form>

    <p v-if="calculatedHours">Hours: {{ calculatedHours }}</p>
    <p v-if="message">{{ message }}</p>
  </main>
</template>

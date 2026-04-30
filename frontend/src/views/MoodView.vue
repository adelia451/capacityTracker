<script setup>
// ---------- IMPORTS ----------
import { ref } from 'vue'
import { useLogsStore } from '../stores/logs'

// ---------- STORE CONNECTION ----------
const logsStore = useLogsStore()

// ---------- REACTIVE STATE (REFS) ----------
const today = new Date().toLocaleDateString('en-CA')
const message = ref('')

const mood = ref('')
const moodStates = ['depressed', 'heavy', 'sad', 'meh', 'neutral', 'positive', 'happy']

const stress = ref('')
const stressStates = ['understimulated', 'stress-free', 'balanced', 'debilitating', 'paralyzing']

// reason applies to both mood and stress — defaults to 'no clear reason' so it's always valid
const moodReason = ref('no clear reason')
const stressReason = ref('no clear reason')
const reasons = [
  'no clear reason',
  'accomplishment', 'loneliness', 'low motivation', 'mentally tired',
  'overthinking', 'overwhelmed', 'self image',
  'hunger', 'low energy', 'sickness',
  'career', 'conflict', 'family', 'hobby', 'relationship',
  'relaxation', 'school', 'social activity', 'social life', 'workload'
]

// ---------- FUNCTIONS ----------
async function saveMood() {
  if (!mood.value) {
    message.value = 'Pick a mood first :)'
    return
  }

  await logsStore.saveMood(today, {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: mood.value,
    reason: moodReason.value
  })

  message.value = 'Mood logged'
  mood.value = ''
  moodReason.value = 'no clear reason'
}

async function saveStress() {
  if (!stress.value) {
    message.value = 'Pick your stress level first :)'
    return
  }

  await logsStore.saveStress(today, {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: stress.value,
    reason: stressReason.value
  })

  message.value = 'Stress logged'
  stress.value = ''
  stressReason.value = 'no clear reason'
}
</script>

<template>
  <main>
    <h1>Mood</h1>

    <form @submit.prevent="saveMood">
      <label>How are you feeling?</label>
      <div>
        <button
          v-for="state in moodStates"
          :key="state"
          type="button"
          :class="{ selected: mood === state }"
          @click="mood = state"
        >{{ state }}</button>
      </div>

      <label>Why?</label>
      <div>
        <button
          v-for="reason in reasons"
          :key="reason"
          type="button"
          :class="{ selected: moodReason === reason }"
          @click="moodReason = reason"
        >{{ reason }}</button>
      </div>

      <button type="submit">Save mood</button>
    </form>

    <h1>Stress</h1>

    <form @submit.prevent="saveStress">
      <label>Current stress level</label>
      <div>
        <button
          v-for="state in stressStates"
          :key="state"
          type="button"
          :class="{ selected: stress === state }"
          @click="stress = state"
        >{{ state }}</button>
      </div>

      <label>Why?</label>
      <div>
        <button
          v-for="reason in reasons"
          :key="reason"
          type="button"
          :class="{ selected: stressReason === reason }"
          @click="stressReason = reason"
        >{{ reason }}</button>
      </div>

      <button type="submit">Save stress level</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </main>
</template>

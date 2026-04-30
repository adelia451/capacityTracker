<script setup>
// ---------- IMPORTS ----------
import { ref, onMounted } from 'vue'
// onMounted = a lifecycle hook that runs automatically when the component appears on screen
// I use it to pre-fill the form with whatever was already logged today
import { useLogsStore } from '../stores/logs'

// ---------- STORE CONNECTION ----------
const logsStore = useLogsStore()

// ---------- REACTIVE STATE (REFS) ----------
const today = new Date().toLocaleDateString('en-CA')
const message = ref('')

// time fields: logged one at a time throughout the day
const takenAt = ref('')
const feltOnset = ref('')
const feltPeak = ref('')
const feltEnd = ref('')
const focusCapacityHours = ref('')

// multi-select arrays: user can pick more than one
const medQuality = ref([])
const medQualityOptions = ['no effect', 'lightly felt', 'felt', 'strongly felt']

const focusQuality = ref([])
const focusQualityOptions = ['unfocused', 'focused', 'locked-in']

// skipped toggle + multi-select reasons
const skipped = ref(false)
const selectedSkipReasons = ref([])
const skipReasonOptions = ['low energy', 'emotional state', 'light workload', 'intentional rest', 'outing']

// ---------- TOGGLE HELPERS ----------
// each toggles its own array: if the value is already in the array remove it, otherwise add it
function toggleMedQuality(val) {
  const i = medQuality.value.indexOf(val)
  i > -1 ? medQuality.value.splice(i, 1) : medQuality.value.push(val)
}

function toggleFocusQuality(val) {
  const i = focusQuality.value.indexOf(val)
  i > -1 ? focusQuality.value.splice(i, 1) : focusQuality.value.push(val)
}

function toggleSkipReason(val) {
  const i = selectedSkipReasons.value.indexOf(val)
  i > -1 ? selectedSkipReasons.value.splice(i, 1) : selectedSkipReasons.value.push(val)
}

// ---------- PRE-FILL ON PAGE LOAD ----------
// onMounted runs once when the page appears: fetches today's log and fills in any saved values
onMounted(async () => {
  await logsStore.fetchTodayLog(today)
  const med = logsStore.todayLog?.medication
  if (med) {
    takenAt.value            = med.takenAt || ''
    feltOnset.value          = med.feltOnset || ''
    feltPeak.value           = med.feltPeak || ''
    feltEnd.value            = med.feltEnd || ''
    focusCapacityHours.value = med.focusCapacityHours || ''
    medQuality.value         = med.medQuality || []
    focusQuality.value       = med.focusQuality || []
    skipped.value            = med.skipped || false
    selectedSkipReasons.value = med.skipReasons || []
  }
})

// ---------- SAVE ----------
async function saveMed() {
  await logsStore.saveMedication(today, {
    takenAt: takenAt.value,
    feltOnset: feltOnset.value,
    feltPeak: feltPeak.value,
    feltEnd: feltEnd.value,
    focusCapacityHours: focusCapacityHours.value ? Number(focusCapacityHours.value) : null,
    medQuality: medQuality.value,
    focusQuality: focusQuality.value,
    skipped: skipped.value,
    skipReasons: selectedSkipReasons.value
  })
  message.value = 'Saved!'
}
</script>

<template>
  <main>
    <h1>Medication</h1>

    <form @submit.prevent="saveMed">

      <!-- skipped toggle — v-model on a checkbox binds to the boolean ref directly -->
      <label>
        <input type="checkbox" v-model="skipped" />
        Skipped today
      </label>

      <!-- v-if / v-else swaps between two sections based on skipped -->
      <div v-if="skipped">
        <label>Skip reasons</label>
        <div>
          <button
            v-for="reason in skipReasonOptions"
            :key="reason"
            type="button"
            :class="{ selected: selectedSkipReasons.includes(reason) }"
            @click="toggleSkipReason(reason)"
          >{{ reason }}</button>
        </div>
      </div>

      <div v-else>
        <label>Taken at</label>
        <input type="time" v-model="takenAt" />

        <label>Felt onset</label>
        <input type="time" v-model="feltOnset" />

        <label>Felt peak</label>
        <input type="time" v-model="feltPeak" />

        <label>Felt end</label>
        <input type="time" v-model="feltEnd" />

        <label>Focus capacity (hours)</label>
        <input type="number" v-model="focusCapacityHours" />

        <label>Med quality</label>
        <div>
          <button
            v-for="option in medQualityOptions"
            :key="option"
            type="button"
            :class="{ selected: medQuality.includes(option) }"
            @click="toggleMedQuality(option)"
          >{{ option }}</button>
        </div>

        <label>Focus quality</label>
        <div>
          <button
            v-for="option in focusQualityOptions"
            :key="option"
            type="button"
            :class="{ selected: focusQuality.includes(option) }"
            @click="toggleFocusQuality(option)"
          >{{ option }}</button>
        </div>
      </div>

      <button type="submit">Save</button>
    </form>

    <p v-if="message">{{ message }}</p>
  </main>
</template>

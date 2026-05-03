<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLogsStore } from '../stores/logs'

const logsStore = useLogsStore()
const today = new Date().toLocaleDateString('en-CA')
const message = ref('')

// tabs
const activeTab = ref('medication')
const tabs = ['medication', 'protein', 'alcohol']

// medication
const takenAt = ref('')
const feltOnset = ref('')
const feltPeak = ref('')
const feltEnd = ref('')
const focusCapacityHours = ref('')

const medQuality = ref([])
const medQualityOptions = ['no effect', 'lightly felt', 'felt', 'strongly felt']

const focusQuality = ref([])
const focusQualityOptions = ['unfocused', 'focused', 'locked-in']

const skipped = ref(false)
const selectedSkipReasons = ref([])
const skipReasonOptions = ['low energy', 'emotional state', 'light workload', 'intentional rest', 'outing']

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

// ctrl+arrows/numbers switches tabs — only active when this view is mounted
function handleKeydown(e) {
  if (!e.ctrlKey) return
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    const i = tabs.indexOf(activeTab.value)
    activeTab.value = tabs[(i + 1) % tabs.length]
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    const i = tabs.indexOf(activeTab.value)
    activeTab.value = tabs[(i - 1 + tabs.length) % tabs.length]
  }
  const num = parseInt(e.key)
  if (!isNaN(num) && num >= 1 && num <= tabs.length) {
    e.preventDefault()
    activeTab.value = tabs[num - 1]
  }
}

onMounted(async () => {
  await logsStore.fetchTodayLog(today)
  const med = logsStore.todayLog?.medication
  if (med) {
    takenAt.value             = med.takenAt || ''
    feltOnset.value           = med.feltOnset || ''
    feltPeak.value            = med.feltPeak || ''
    feltEnd.value             = med.feltEnd || ''
    focusCapacityHours.value  = med.focusCapacityHours || ''
    medQuality.value          = med.medQuality || []
    focusQuality.value        = med.focusQuality || []
    skipped.value             = med.skipped || false
    selectedSkipReasons.value = med.skipReasons || []
  }
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

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
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <!-- MEDICATION -->
    <section v-if="activeTab === 'medication'" class="card card-peri">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>˚</span><span>Medication</span><span>˚</span></div>
        <div class="ct-line"></div>
      </div>

      <form @submit.prevent="saveMed">
        <label>
          <input type="checkbox" v-model="skipped" />
          Skipped today
        </label>

        <div v-if="skipped">
          <label>Skip reasons</label>
          <div>
            <button v-for="reason in skipReasonOptions" :key="reason" type="button"
              :class="{ selected: selectedSkipReasons.includes(reason) }"
              @click="toggleSkipReason(reason)">{{ reason }}</button>
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
            <button v-for="option in medQualityOptions" :key="option" type="button"
              :class="{ selected: medQuality.includes(option) }"
              @click="toggleMedQuality(option)">{{ option }}</button>
          </div>

          <label>Focus quality</label>
          <div>
            <button v-for="option in focusQualityOptions" :key="option" type="button"
              :class="{ selected: focusQuality.includes(option) }"
              @click="toggleFocusQuality(option)">{{ option }}</button>
          </div>
        </div>

        <button type="submit">Save</button>
      </form>
    </section>

    <!-- PROTEIN — coming after submission -->
    <section v-if="activeTab === 'protein'" class="card card-peri">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✿</span><span>Protein</span><span>✿</span></div>
        <div class="ct-line"></div>
      </div>
      <p>Coming after submission</p>
    </section>

    <!-- ALCOHOL — coming after submission -->
    <section v-if="activeTab === 'alcohol'" class="card card-peri">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>˚</span><span>Alcohol</span><span>˚</span></div>
        <div class="ct-line"></div>
      </div>
      <p>Coming after submission</p>
    </section>

    <p v-if="message">{{ message }}</p>
  </main>
</template>
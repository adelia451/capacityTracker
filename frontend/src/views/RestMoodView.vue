<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLogsStore } from '../stores/logs'

const logsStore = useLogsStore()
const today = new Date().toLocaleDateString('en-CA')
const message = ref('')
const calculatedHours = ref(null)

// tabs
const activeTab = ref('sleep')
const tabs = ['sleep', 'mood', 'stress', 'naps']

// sleep
const bedTime = ref('')
const wakeTime = ref('')
const sleepState = ref('')
const sleepStates = ['sleepy', 'tired', 'neutral', 'awake', 'energized']

// naps
const napStart = ref('')
const napEnd = ref('')
const feltRestedAfter = ref('neutral')

// mood
const mood = ref('')
const moodStates = ['depressed', 'heavy', 'sad', 'meh', 'neutral', 'positive', 'happy']
const moodReason = ref('no clear reason')

// stress
const stress = ref('')
const stressStates = ['understimulated', 'stress-free', 'balanced', 'debilitating', 'paralyzing']
const stressReason = ref('no clear reason')

const reasons = [
  'no clear reason',
  'accomplishment', 'loneliness', 'low motivation', 'mentally tired',
  'overthinking', 'overwhelmed', 'self image',
  'hunger', 'low energy', 'sickness',
  'career', 'conflict', 'family', 'hobby', 'relationship',
  'relaxation', 'school', 'social activity', 'social life', 'workload'
]

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
  const sleep = logsStore.todayLog?.sleep
  if (sleep) {
    bedTime.value    = sleep.start || ''
    wakeTime.value   = sleep.end   || ''
    sleepState.value = sleep.state || ''
  }
  window.addEventListener('keydown', handleKeydown)
})

// onUnmounted removes the listener so it doesn't fire on other pages
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

async function saveSleep() {
  if (!bedTime.value || !wakeTime.value) { message.value = 'Please enter bed time and wake time'; return }
  if (!sleepState.value) { message.value = 'Please select a sleep state'; return }

  let minutes = timeToMinutes(wakeTime.value) - timeToMinutes(bedTime.value)
  if (minutes < 0) minutes += 1440
  const hours = minutes / 60

  await logsStore.saveSleep(today, {
    start: bedTime.value,
    end: wakeTime.value,
    hours,
    state: sleepState.value
  })

  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  calculatedHours.value = `${h} hours ${m} minutes`
  message.value = 'Sleep logged!'
}

async function saveNap() {
  if (!napStart.value || !napEnd.value) { message.value = 'Please enter nap start and end time'; return }

  let minutes = timeToMinutes(napEnd.value) - timeToMinutes(napStart.value)
  if (minutes < 0) minutes += 1440
  const hours = minutes / 60

  await logsStore.saveNap(today, {
    start: napStart.value,
    end: napEnd.value,
    hours,
    feltRestedAfter: feltRestedAfter.value
  })

  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  calculatedHours.value = `${h} hours ${m} minutes`
  message.value = 'Nap logged!'
}

async function saveMood() {
  if (!mood.value) { message.value = 'Pick a mood first :)'; return }

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
  if (!stress.value) { message.value = 'Pick your stress level first :)'; return }

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
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <!-- SLEEP -->
    <section v-if="activeTab === 'sleep'" class="card card-ice">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>˚</span><span>Sleep Log</span><span>˚</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveSleep">
        <label>Bed time</label>
        <input type="time" v-model="bedTime" />

        <label>Wake time</label>
        <input type="time" v-model="wakeTime" />

        <label>Sleep state</label>
        <div>
          <button v-for="state in sleepStates" :key="state" type="button"
            :class="{ selected: sleepState === state }" @click="sleepState = state">{{ state }}</button>
        </div>

        <button type="submit">Save sleep</button>
      </form>
      <p v-if="calculatedHours">Hours: {{ calculatedHours }}</p>
    </section>

    <!-- MOOD -->
    <section v-if="activeTab === 'mood'" class="card card-yellow">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>♡</span><span>Mood Log</span><span>♡</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveMood">
        <label>How are you feeling?</label>
        <div>
          <button v-for="state in moodStates" :key="state" type="button"
            :class="{ selected: mood === state }" @click="mood = state">{{ state }}</button>
        </div>

        <label>Why?</label>
        <div>
          <button v-for="reason in reasons" :key="reason" type="button"
            :class="{ selected: moodReason === reason }" @click="moodReason = reason">{{ reason }}</button>
        </div>

        <button type="submit">Save mood</button>
      </form>
    </section>

    <!-- STRESS -->
    <section v-if="activeTab === 'stress'" class="card card-yellow">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>⋆</span><span>Stress Log</span><span>⋆</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveStress">
        <label>Current stress level</label>
        <div>
          <button v-for="state in stressStates" :key="state" type="button"
            :class="{ selected: stress === state }" @click="stress = state">{{ state }}</button>
        </div>

        <label>Why?</label>
        <div>
          <button v-for="reason in reasons" :key="reason" type="button"
            :class="{ selected: stressReason === reason }" @click="stressReason = reason">{{ reason }}</button>
        </div>

        <button type="submit">Save stress level</button>
      </form>
    </section>

    <!-- NAPS -->
    <section v-if="activeTab === 'naps'" class="card card-ice">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✿</span><span>Nap Log</span><span>✿</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveNap">
        <label>Nap start</label>
        <input type="time" v-model="napStart" />

        <label>Nap end</label>
        <input type="time" v-model="napEnd" />

        <label>Felt after nap</label>
        <div>
          <button v-for="state in sleepStates" :key="state" type="button"
            :class="{ selected: feltRestedAfter === state }" @click="feltRestedAfter = state">{{ state }}</button>
        </div>

        <button type="submit">Save nap</button>
      </form>
      <p v-if="calculatedHours">Hours: {{ calculatedHours }}</p>
    </section>

    <p v-if="message">{{ message }}</p>
  </main>
</template>
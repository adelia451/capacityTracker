<script>
import { useLogsStore } from '../stores/logs'

export default {
  name: 'RestMoodView',
  setup() {
    return {
      logsStore: useLogsStore()
    }
  },
  data() {
    return {
      today: new Date().toLocaleDateString('en-CA'),
      message: '',
      calculatedHours: null,
      activeTab: 'sleep',
      tabs: ['sleep', 'mood', 'stress', 'naps'],
      bedTime: '',
      wakeTime: '',
      sleepState: '',
      sleepStates: ['sleepy', 'tired', 'neutral', 'awake', 'energized'],
      napStart: '',
      napEnd: '',
      feltRestedAfter: 'neutral',
      mood: '',
      moodStates: ['depressed', 'heavy', 'sad', 'meh', 'neutral', 'positive', 'happy'],
      moodReason: ['no clear reason'],
      stress: '',
      stressStates: ['understimulated', 'stress-free', 'balanced', 'debilitating', 'paralyzing'],
      stressReason: ['no clear reason'],
      reasons: [
        'no clear reason',
        'accomplishment', 'loneliness', 'low motivation', 'mentally tired',
        'overthinking', 'overwhelmed', 'self image',
        'hunger', 'low energy', 'sickness',
        'career', 'conflict', 'family', 'hobby', 'relationship',
        'relaxation', 'school', 'social activity', 'social life', 'workload'
      ],
      reasonGroups: {
        'accomplishment': 'internal', 'loneliness': 'internal', 'low motivation': 'internal',
        'mentally tired': 'internal', 'overthinking': 'internal', 'overwhelmed': 'internal', 'self image': 'internal',
        'hunger': 'physical', 'low energy': 'physical', 'sickness': 'physical',
        'career': 'external', 'conflict': 'external', 'family': 'external', 'hobby': 'external',
        'relationship': 'external', 'relaxation': 'external', 'school': 'external',
        'social activity': 'external', 'social life': 'external', 'workload': 'external',
        'no clear reason': 'neutral'
      },
      boundKeydown: null
    }
  },
  watch: {
    activeTab() { this.message = '' }
  },
  methods: {
    toggleMoodReason(reason) {
      const i = this.moodReason.indexOf(reason)
      i > -1 ? this.moodReason.splice(i, 1) : this.moodReason.push(reason)
    },
    toggleStressReason(reason) {
      const i = this.stressReason.indexOf(reason)
      i > -1 ? this.stressReason.splice(i, 1) : this.stressReason.push(reason)
    },
    formatReasons(reason) {
      if (!reason) return ''
      const arr = Array.isArray(reason) ? reason : [reason]
      return arr.filter(r => r !== 'no clear reason').join(', ')
    },
    handleKeydown(e) {
      if (!e.ctrlKey) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        const i = this.tabs.indexOf(this.activeTab)
        this.activeTab = this.tabs[(i + 1) % this.tabs.length]
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const i = this.tabs.indexOf(this.activeTab)
        this.activeTab = this.tabs[(i - 1 + this.tabs.length) % this.tabs.length]
      }
      const num = parseInt(e.key)
      if (!isNaN(num) && num >= 1 && num <= this.tabs.length) {
        e.preventDefault()
        this.activeTab = this.tabs[num - 1]
      }
    },
    timeToMinutes(t) {
      const [h, m] = t.split(':').map(Number)
      return h * 60 + m
    },
    async saveSleep() {
      if (!this.bedTime || !this.wakeTime) { this.message = 'Please enter bed time and wake time'; return }
      if (!this.sleepState) { this.message = 'Please select a sleep state'; return }
      let minutes = this.timeToMinutes(this.wakeTime) - this.timeToMinutes(this.bedTime)
      if (minutes < 0) minutes += 1440
      const hours = minutes / 60
      await this.logsStore.saveSleep(this.today, { start: this.bedTime, end: this.wakeTime, hours, state: this.sleepState })
      const h = Math.floor(hours)
      const m = Math.round((hours - h) * 60)
      this.calculatedHours = `${h} hours ${m} minutes`
      this.message = 'Sleep logged!'
    },
    async saveNap() {
      if (!this.napStart || !this.napEnd) { this.message = 'Please enter nap start and end time'; return }
      let minutes = this.timeToMinutes(this.napEnd) - this.timeToMinutes(this.napStart)
      if (minutes < 0) minutes += 1440
      const hours = minutes / 60
      await this.logsStore.saveNap(this.today, { start: this.napStart, end: this.napEnd, hours, feltRestedAfter: this.feltRestedAfter })
      const h = Math.floor(hours)
      const m = Math.round((hours - h) * 60)
      this.calculatedHours = `${h} hours ${m} minutes`
      this.message = 'Nap logged!'
    },
    async saveMood() {
      if (!this.mood) { this.message = 'Pick a mood first :)'; return }
      await this.logsStore.saveMood(this.today, {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: this.mood,
        reason: this.moodReason
      })
      this.message = 'Mood logged'
      this.mood = ''
      this.moodReason = ['no clear reason']
      await this.logsStore.fetchTodayLog(this.today)
    },
    deleteMoodEntry(entryId) {
      this.logsStore.deleteMoodEntry(this.logsStore.todayLog._id, entryId)
    },
    deleteStressEntry(entryId) {
      this.logsStore.deleteStressEntry(this.logsStore.todayLog._id, entryId)
    },
    deleteNapEntry(entryId) {
      this.logsStore.deleteNapEntry(this.logsStore.todayLog._id, entryId)
    },
    async saveStress() {
      if (!this.stress) { this.message = 'Pick your stress level first :)'; return }
      await this.logsStore.saveStress(this.today, {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: this.stress,
        reason: this.stressReason
      })
      this.message = 'Stress logged'
      this.stress = ''
      this.stressReason = ['no clear reason']
      await this.logsStore.fetchTodayLog(this.today)
    }
  },
  async mounted() {
    await this.logsStore.fetchTodayLog(this.today)
    const sleep = this.logsStore.todayLog?.sleep
    if (sleep) {
      this.bedTime    = sleep.start || ''
      this.wakeTime   = sleep.end   || ''
      this.sleepState = sleep.state || ''
    }
    this.boundKeydown = (e) => this.handleKeydown(e)
    window.addEventListener('keydown', this.boundKeydown)
  },
  unmounted() {
    window.removeEventListener('keydown', this.boundKeydown)
  }
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
    <section v-if="activeTab === 'sleep'" class="card card-purple">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>˚</span><span>Sleep Log</span><span>˚</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveSleep">
        <label>Fell asleep at</label>
        <input type="text" v-model="bedTime" placeholder="HH:MM" />

        <label>Woke up at</label>
        <input type="text" v-model="wakeTime" placeholder="HH:MM" />

        <label>Woke up feeling</label>
        <div>
          <button v-for="state in sleepStates" :key="state" type="button"
            :data-sleep="state"
            :class="{ selected: sleepState === state }" @click="sleepState = state">{{ state }}</button>
        </div>

        <button type="submit"  class="btn-save">Save sleep</button>
      </form>
      <p v-if="calculatedHours">Hours: {{ calculatedHours }}</p>
    </section>

    <!-- MOOD -->
    <section v-if="activeTab === 'mood'" class="card card-purple">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>♡</span><span>Mood Log</span><span>♡</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveMood">
        <label>How are you feeling?</label>
        <div>
          <button v-for="state in moodStates" :key="state" type="button"
            :data-mood="state"
            :class="{ selected: mood === state }" @click="mood = state">{{ state }}</button>
        </div>

        <label>Why?</label>
        <div>
          <button v-for="reason in reasons" :key="reason" type="button"
            :data-reason-group="reasonGroups[reason]"
            :class="{ selected: moodReason.includes(reason) }" @click="toggleMoodReason(reason)">{{ reason }}</button>
        </div>

        <button type="submit" class="btn-save">Save mood</button>
      </form>

      <!-- today's mood entries -->
      <div v-if="logsStore.todayLog?.moodLogs?.length" class="entries-list">
        <div class="ct" style="margin-top: 16px;">
          <div class="ct-line"></div>
          <div class="ct-inner"><span>♡</span><span>Today's entries</span><span>♡</span></div>
          <div class="ct-line"></div>
        </div>
        <div v-for="entry in logsStore.todayLog.moodLogs" :key="entry._id" class="entry-row">
          <span class="entry-time">{{ entry.time }}</span>
          <span class="entry-value">{{ Array.isArray(entry.value) ? entry.value.join(', ') : entry.value }}</span>
          <span class="entry-reason" v-if="formatReasons(entry.reason)">· {{ formatReasons(entry.reason) }}</span>
          <button type="button" class="btn-delete" @click="deleteMoodEntry(entry._id)">×</button>
        </div>
      </div>
    </section>

    <!-- STRESS -->
    <section v-if="activeTab === 'stress'" class="card card-purple">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>⋆</span><span>Stress Log</span><span>⋆</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveStress">
        <label>How stressed are you currently?</label>
        <div>
          <button v-for="state in stressStates" :key="state" type="button"
            :data-stress="state"
            :class="{ selected: stress === state }" @click="stress = state">{{ state }}</button>
        </div>

        <label>Why?</label>
        <div>
          <button v-for="reason in reasons" :key="reason" type="button"
            :data-reason-group="reasonGroups[reason]"
            :class="{ selected: stressReason.includes(reason) }" @click="toggleStressReason(reason)">{{ reason }}</button>
        </div>

        <button type="submit" class="btn-save">Save stress level</button>
      </form>

      <!-- today's stress entries -->
      <div v-if="logsStore.todayLog?.stressLogs?.length" class="entries-list">
        <div class="ct" style="margin-top: 16px;">
          <div class="ct-line"></div>
          <div class="ct-inner"><span>⋆</span><span>Today's entries</span><span>⋆</span></div>
          <div class="ct-line"></div>
        </div>
        <div v-for="entry in logsStore.todayLog.stressLogs" :key="entry._id" class="entry-row">
          <span class="entry-time">{{ entry.time }}</span>
          <span class="entry-value">{{ Array.isArray(entry.value) ? entry.value.join(', ') : entry.value }}</span>
          <span class="entry-reason" v-if="formatReasons(entry.reason)">· {{ formatReasons(entry.reason) }}</span>
          <button type="button" class="btn-delete" @click="deleteStressEntry(entry._id)">×</button>
        </div>
      </div>
    </section>

    <!-- NAPS -->
    <section v-if="activeTab === 'naps'" class="card card-purple">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✿</span><span>Nap Log</span><span>✿</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveNap">
        <label>Fell asleep at</label>
        <input type="time" v-model="napStart" />

        <label>Woke up at</label>
        <input type="time" v-model="napEnd" />

        <label>Woke up feeling</label>
        <div>
          <button v-for="state in sleepStates" :key="state" type="button"
            :data-sleep="state"
            :class="{ selected: feltRestedAfter === state }" @click="feltRestedAfter = state">{{ state }}</button>
        </div>

        <button type="submit"  class="btn-save">Save nap</button>
      </form>
      <p v-if="calculatedHours">Hours: {{ calculatedHours }}</p>

      <div v-if="logsStore.todayLog?.naps?.length" class="entries-list">
        <div class="ct" style="margin-top: 16px;">
          <div class="ct-line"></div>
          <div class="ct-inner"><span>✿</span><span>Today's naps</span><span>✿</span></div>
          <div class="ct-line"></div>
        </div>
        <div v-for="nap in logsStore.todayLog.naps" :key="nap._id" class="entry-row">
          <span class="entry-time">{{ nap.start }} → {{ nap.end }}</span>
          <span class="entry-value">{{ nap.feltRestedAfter }}</span>
          <button type="button" class="btn-delete" @click="deleteNapEntry(nap._id)">×</button>
        </div>
      </div>
    </section>

    <p v-if="message" class="message">{{ message }}</p>
  </main>
</template>

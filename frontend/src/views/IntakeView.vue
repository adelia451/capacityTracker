<script>
import { useLogsStore } from '../stores/logs'

export default {
  name: 'IntakeView',
  setup() {
    return {
      logsStore: useLogsStore()
    }
  },
  data() {
    return {
      today: new Date().toLocaleDateString('en-CA'),
      message: '',
      activeTab: 'medication',
      tabs: ['medication', 'protein', 'alcohol'],
      takenAt: '',
      feltOnset: '',
      feltPeak: '',
      feltEnd: '',
      medQuality: [],
      medQualityOptions: ['no effect', 'lightly felt', 'felt', 'strongly felt'],
      focusQuality: [],
      focusQualityOptions: ['unfocused', 'focused', 'locked-in'],
      skipped: false,
      selectedSkipReasons: [],
      skipReasonOptions: ['low energy', 'emotional state', 'light workload', 'intentional rest', 'outing'],
      alcoholDrinks: null,
      boundKeydown: null
    }
  },
  methods: {
    toggleMedQuality(val) {
      const i = this.medQuality.indexOf(val)
      i > -1 ? this.medQuality.splice(i, 1) : this.medQuality.push(val)
    },
    toggleFocusQuality(val) {
      const i = this.focusQuality.indexOf(val)
      i > -1 ? this.focusQuality.splice(i, 1) : this.focusQuality.push(val)
    },
    toggleSkipReason(val) {
      const i = this.selectedSkipReasons.indexOf(val)
      i > -1 ? this.selectedSkipReasons.splice(i, 1) : this.selectedSkipReasons.push(val)
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
    calcFocusHours() {
      if (!this.feltOnset || !this.feltEnd) return null
      const [oh, om] = this.feltOnset.split(':').map(Number)
      const [eh, em] = this.feltEnd.split(':').map(Number)
      if (isNaN(oh) || isNaN(eh)) return null
      return Math.round(((eh * 60 + em) - (oh * 60 + om)) / 60 * 10) / 10
    },
    async saveMed() {
      await this.logsStore.saveMedication(this.today, {
        takenAt: this.takenAt,
        feltOnset: this.feltOnset,
        feltPeak: this.feltPeak,
        feltEnd: this.feltEnd,
        focusCapacityHours: this.calcFocusHours(),
        medQuality: this.medQuality,
        focusQuality: this.focusQuality,
        skipped: this.skipped,
        skipReasons: this.selectedSkipReasons
      })
      this.message = 'Saved!'
    },
    async saveAlcohol() {
      await this.logsStore.saveAlcohol(this.today, this.alcoholDrinks ?? 0)
      this.message = 'Saved!'
    }
  },
  async mounted() {
    await this.logsStore.fetchTodayLog(this.today)
    if (this.logsStore.todayLog?.alcohol != null) {
      this.alcoholDrinks = this.logsStore.todayLog.alcohol
    }
    const med = this.logsStore.todayLog?.medication
    if (med) {
      this.takenAt             = med.takenAt || ''
      this.feltOnset           = med.feltOnset || ''
      this.feltPeak            = med.feltPeak || ''
      this.feltEnd             = med.feltEnd || ''
      this.medQuality          = med.medQuality || []
      this.focusQuality        = med.focusQuality || []
      this.skipped             = med.skipped || false
      this.selectedSkipReasons = med.skipReasons || []
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

    <!-- MEDICATION -->
    <section v-if="activeTab === 'medication'" class="card card-yellow">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>˚</span><span>Medication</span><span>˚</span></div>
        <div class="ct-line"></div>
      </div>

      <form @submit.prevent="saveMed">
        <label>
          <input type="checkbox" v-model="skipped" />
          Skipped medication
        </label>

        <div v-if="skipped" style="display: contents">
          <label>Why?</label>
          <div>
            <button v-for="reason in skipReasonOptions" :key="reason" type="button"
              :class="{ selected: selectedSkipReasons.includes(reason) }"
              @click="toggleSkipReason(reason)">{{ reason }}</button>
          </div>
        </div>

        <div v-else style="display: contents">
          <label>Taken at</label>
          <input type="text" v-model="takenAt" placeholder="HH:MM" />

          <label>Felt onset</label>
          <input type="text" v-model="feltOnset" placeholder="HH:MM" />

          <label>Felt peak</label>
          <input type="text" v-model="feltPeak" placeholder="HH:MM" />

          <label>Felt end</label>
          <input type="text" v-model="feltEnd" placeholder="HH:MM" />

          <label>Med quality</label>
          <div>
            <button v-for="option in medQualityOptions" :key="option" type="button"
              :class="{ selected: medQuality.includes(option) }"
              @click="toggleMedQuality(option)">{{ option }}</button>
          </div>

          <label style="margin-top: 14px;">Focus quality</label>
          <div>
            <button v-for="option in focusQualityOptions" :key="option" type="button"
              :class="{ selected: focusQuality.includes(option) }"
              @click="toggleFocusQuality(option)">{{ option }}</button>
          </div>
        </div>

        <button type="submit"  class="btn-save">Save</button>
      </form>
    </section>

    <!-- PROTEIN -->
    <section v-if="activeTab === 'protein'" class="card card-yellow">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✿</span><span>Protein</span><span>✿</span></div>
        <div class="ct-line"></div>
      </div>
      <p class="coming-soon">Not currently tracked.</p>
    </section>

    <!-- ALCOHOL -->
    <section v-if="activeTab === 'alcohol'" class="card card-yellow">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>˚</span><span>Alcohol</span><span>˚</span></div>
        <div class="ct-line"></div>
      </div>
      <form @submit.prevent="saveAlcohol">
        <label>Drinks today</label>
        <div>
          <button v-for="n in [0,1,2,3,4,5,6,7,8]" :key="n" type="button"
            :class="{ selected: alcoholDrinks === n }"
            @click="alcoholDrinks = n">{{ n === 0 ? 'none' : n }}</button>
        </div>
        <button type="submit" class="btn-save">Save</button>
      </form>
    </section>

    <p v-if="message" class="message">{{ message }}</p>
  </main>
</template>

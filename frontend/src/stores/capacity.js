import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useCapacityStore = defineStore('capacity', () => {

  // today's capacity result — check Thunder Client GET /api/capacity to see the full shape
  const score = ref(null)

  // prediction data — check Thunder Client GET /api/prediction to see what fields come back
  // wireframes show multi-day predictions with confidence % — confirm your endpoint returns that
  const prediction = ref(null)

  // insights — array from GET /api/insights (needs 7+ days of logs to populate)
  const insights = ref(null)

  async function fetchCapacity(date) {
    try {
      const res = await axios.get(`http://localhost:3000/api/capacity?date=${date}`)
      score.value = res.data
    } catch (err) {
      console.error('Failed to fetch capacity:', err)
    }
  }

  async function fetchPrediction() {
    try {
      const res = await axios.get('http://localhost:3000/api/prediction')
      prediction.value = res.data
    } catch (err) {
      console.error('Failed to fetch prediction:', err)
    }
  }

  async function fetchInsights() {
    try {
      const res = await axios.get('http://localhost:3000/api/insights')
      insights.value = res.data
    } catch (err) {
      console.error('Failed to fetch insights:', err)
    }
  }

  const correlations = ref(null)

  async function fetchCorrelations() {
    try {
      const res = await axios.get('http://localhost:3000/api/correlations')
      correlations.value = res.data
    } catch (err) {
      console.error('Failed to fetch correlations:', err)
    }
  }

  const calibrating = ref(false)
  const calibrateMessage = ref(null)

  async function calibrate() {
    calibrating.value = true
    calibrateMessage.value = null
    try {
      const res = await axios.post('http://localhost:3000/api/calibrate')
      calibrateMessage.value = res.data?.message || 'Weights updated!'
    } catch (err) {
      calibrateMessage.value = err.response?.data?.message || 'Not enough data yet — need at least 7 rated days.'
      console.error('Calibration failed:', err)
    } finally {
      calibrating.value = false
    }
  }

  return { score, prediction, insights, correlations, calibrating, calibrateMessage, fetchCapacity, fetchPrediction, fetchInsights, fetchCorrelations, calibrate }
})

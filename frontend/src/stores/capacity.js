import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const useCapacityStore = defineStore('capacity', () => {

  const score = ref(null)
  const prediction = ref(null)
  const insights = ref(null)
  const correlations = ref(null)
  const calibrating = ref(false)
  const calibrateMessage = ref(null)

  async function fetchCapacity(date) {
    try {
      const res = await axios.get(`${API}/api/capacity?date=${date}`)
      score.value = res.data
    } catch (err) {
      console.error('Failed to fetch capacity:', err)
    }
  }

  async function fetchPrediction() {
    try {
      const res = await axios.get(`${API}/api/prediction`)
      prediction.value = res.data
    } catch (err) {
      console.error('Failed to fetch prediction:', err)
    }
  }

  async function fetchInsights() {
    try {
      const res = await axios.get(`${API}/api/insights`)
      insights.value = res.data
    } catch (err) {
      console.error('Failed to fetch insights:', err)
    }
  }

  async function fetchCorrelations() {
    try {
      const res = await axios.get(`${API}/api/correlations`)
      correlations.value = res.data
    } catch (err) {
      console.error('Failed to fetch correlations:', err)
    }
  }

  async function calibrate() {
    calibrating.value = true
    calibrateMessage.value = null
    try {
      const res = await axios.post(`${API}/api/calibrate`)
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

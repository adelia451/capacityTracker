import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const useLogsStore = defineStore('logs', () => {

  const todayLog = ref(null)

  // Shared POST-or-PUT logic for all log fields.
  // appendEntry: { field: 'moodLogs', value: entryObj } — merges into existing array.
  // Omit appendEntry for scalar replacements (sleep, medication, alcohol, rating).
  async function upsertLog(date, fields, appendEntry = null) {
    function buildBody(existing) {
      if (!appendEntry) return fields
      const arr = existing?.[appendEntry.field] || []
      return { ...fields, [appendEntry.field]: [...arr, appendEntry.value] }
    }
    try {
      const res = await axios.post(`${API}/api/logs`, { date, ...buildBody(null) })
      todayLog.value = res.data
    } catch (err) {
      if (err.response?.status !== 400) {
        console.error('Failed to save log:', err)
        throw err
      }
      const { data: existing } = await axios.get(`${API}/api/logs/${date}`)
      const res = await axios.put(`${API}/api/logs/${existing._id}`, buildBody(existing))
      todayLog.value = res.data
    }
  }

  async function saveSleep(date, sleepData) {
    await upsertLog(date, { sleep: sleepData })
  }

  async function saveNap(date, napData) {
    await upsertLog(date, {}, { field: 'naps', value: napData })
  }

  async function saveMood(date, moodData) {
    await upsertLog(date, {}, { field: 'moodLogs', value: moodData })
  }

  async function saveStress(date, stressData) {
    await upsertLog(date, {}, { field: 'stressLogs', value: stressData })
  }

  async function saveMedication(date, medData) {
    await upsertLog(date, { medication: medData })
  }

  async function saveAlcohol(date, drinks) {
    await upsertLog(date, { alcohol: drinks })
  }

  async function saveRating(date, rating) {
    await upsertLog(date, { actualCapacityRating: rating })
  }

  async function fetchTodayLog(date) {
    try {
      const res = await axios.get(`${API}/api/logs/${date}`)
      todayLog.value = res.data
    } catch (err) {
      if (err.response?.status === 404) {
        todayLog.value = null
      } else {
        console.error('Failed to fetch today log:', err)
      }
    }
  }

  async function deleteMoodEntry(logId, entryId) {
    try {
      const res = await axios.delete(`${API}/api/logs/${logId}/mood/${entryId}`)
      todayLog.value = res.data
    } catch (err) {
      console.error('Failed to delete mood entry:', err)
    }
  }

  async function deleteStressEntry(logId, entryId) {
    try {
      const res = await axios.delete(`${API}/api/logs/${logId}/stress/${entryId}`)
      todayLog.value = res.data
    } catch (err) {
      console.error('Failed to delete stress entry:', err)
    }
  }

  async function deleteNapEntry(logId, entryId) {
    try {
      const res = await axios.delete(`${API}/api/logs/${logId}/nap/${entryId}`)
      todayLog.value = res.data
    } catch (err) {
      console.error('Failed to delete nap entry:', err)
    }
  }

  return { todayLog, saveSleep, saveNap, saveMood, saveStress, fetchTodayLog, saveMedication, saveAlcohol, saveRating, deleteMoodEntry, deleteStressEntry, deleteNapEntry }
})

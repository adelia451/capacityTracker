// ---------- IMPORTS ----------
// defineStore creates a Pinia store
// Arguments:
//   1. a unique name string: Pinia uses this internally to identify the store
//   2. a setup function: where you define your state, just like <script setup> in a component
import { defineStore } from 'pinia'

// ref() makes a value "reactive", Vue watches it for changes.
// When a ref changes, any component that uses it automatically re-renders.
import { ref } from 'vue'

// axios is the library used to make HTTP requests to the backend
import axios from 'axios'


// ---------- FUNCTIONS ----------
// "export const" makes it importable in any component that needs it
export const useLogsStore = defineStore('logs', () => {

  // ref([]) = a reactive empty array, will be filled when we fetch logs from the backend
  const logs = ref([])

  // ref(null) = starts as nothing, will be set once we fetch today's log from the backend
  const todayLog = ref(null)

  // ---------- SAVE SLEEP ----------
  // async function = can use "await" inside it to wait for the backend to respond
  async function saveSleep(date, sleepData) {
    try {
      const res = await axios.post('http://localhost:3000/api/logs', {
        date,
        sleep: sleepData
      })

      // store the returned log in our reactive state
      todayLog.value = res.data

    } catch (err) {
      // if a log already exists for today the backend returns 400
      // so instead we fetch today's log to get its _id, then PUT to update it
      if (err.response?.status === 400) {
        const existing = await axios.get(`http://localhost:3000/api/logs/${date}`)

        const res = await axios.put(
          `http://localhost:3000/api/logs/${existing.data._id}`,
          { sleep: sleepData }
        )

        todayLog.value = res.data
      } else {
        // any other error: log it to the browser console so you can see what went wrong
        console.error('Failed to save sleep:', err)
        throw err // re-throw so the view knows something failed
      }
    }
  }

  // ---------- SAVE NAP ----------
  async function saveNap(date, napData) {
    try {
        const res = await axios.post('http://localhost:3000/api/logs', {
        date,
        naps: [napData]
      })

      todayLog.value = res.data

    } catch (err) {
      // if log already exists, we need to UPDATE instead of create
      if (err.response?.status === 400) {
        try {
          // get the existing log so we can append to naps
          const existing = await axios.get(`http://localhost:3000/api/logs/${date}`)

          const updatedNaps = [
            ...(existing.data.naps || []), // keep existing naps
            napData                        // add the new one
          ]

          // update the log with the new naps array
          const res = await axios.put(
            `http://localhost:3000/api/logs/${existing.data._id}`,
            { naps: updatedNaps }
          )

          todayLog.value = res.data

        } catch (fetchErr) {
          // if fetching the existing log fails, show error
          console.error('Failed to fetch existing log:', fetchErr)
          throw fetchErr
        }
      } else {
        // any other error (not "already exists")
        console.error('Failed to save nap:', err)
        throw err
      }
    }
  }

  // ---------- SAVE MOOD ----------
  async function saveMood(date, moodData) {
    try {
      const res = await axios.post('http://localhost:3000/api/logs', {
        date,
        moodLogs: [moodData] // array because schema expects list
      })

      todayLog.value = res.data

    } catch (err) {
      if (err.response?.status === 400) {
        try {
          const existing = await axios.get(`http://localhost:3000/api/logs/${date}`)

          const updatedMoodLogs = [
            ...(existing.data.moodLogs || []),
            moodData
          ]

          const res = await axios.put(
            `http://localhost:3000/api/logs/${existing.data._id}`,
            { moodLogs: updatedMoodLogs }
          )

          todayLog.value = res.data

        } catch (fetchErr) {
          console.error('Failed to fetch existing log:', fetchErr)
          throw fetchErr
        }
      } else {
        console.error('Failed to save mood:', err)
        throw err
      }
    }
  }

// ---------- SAVE STRESS ----------
async function saveStress(date, stressData) {
  try {
    const res = await axios.post('http://localhost:3000/api/logs', {
      date,
      stressLogs: [stressData]
    })

    todayLog.value = res.data

  } catch (err) {
    if (err.response?.status === 400) {
      try {
        const existing = await axios.get(`http://localhost:3000/api/logs/${date}`)

        const updatedStressLogs = [
          ...(existing.data.stressLogs || []),
          stressData
        ]

        const res = await axios.put(
          `http://localhost:3000/api/logs/${existing.data._id}`,
          { stressLogs: updatedStressLogs }
        )

        todayLog.value = res.data

      } catch (fetchErr) {
        console.error('Failed to fetch existing log:', fetchErr)
        throw fetchErr
      }
    } else {
      console.error('Failed to save stress:', err)
      throw err
    }
  }
}

  // ---------- FETCH TODAY'S LOG ----------
  // used by MedicationView on mount to pre-fill the form with whatever was already saved
  async function fetchTodayLog(date) {
    try {
      const res = await axios.get(`http://localhost:3000/api/logs/${date}`)
      todayLog.value = res.data
    } catch (err) {
      if (err.response?.status === 404) {
        todayLog.value = null // no log yet for today — that's fine
      } else {
        console.error('Failed to fetch today log:', err)
      }
    }
  }

  // ---------- SAVE MEDICATION ----------
  async function saveMedication(date, medData) {
    try {
      const res = await axios.post('http://localhost:3000/api/logs', {
        date,
        medication: medData
      })
      todayLog.value = res.data
    } catch (err) {
      if (err.response?.status === 400) {
        try {
          const existing = await axios.get(`http://localhost:3000/api/logs/${date}`)
          const res = await axios.put(
            `http://localhost:3000/api/logs/${existing.data._id}`,
            { medication: medData }
          )
          todayLog.value = res.data
        } catch (fetchErr) {
          console.error('Failed to fetch existing log:', fetchErr)
          throw fetchErr
        }
      } else {
        console.error('Failed to save medication:', err)
        throw err
      }
    }
  }

  // Whatever you return here is accessible to any component using this store.
  // Anything you don't return stays private to this file.
  return { logs, todayLog, saveSleep, saveNap, saveMood, saveStress, fetchTodayLog, saveMedication }
})
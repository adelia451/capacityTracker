import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useTasksStore = defineStore('tasks', () => {

  // tasks for the current date — populated from Google Calendar sync
  const tasks = ref([])

  // syncs GCal then immediately fetches tasks for the given date
  // called automatically on mount so the page is always up to date
  async function syncAndFetch(date) {
    try {
      await axios.post('http://localhost:3000/api/gcal/sync')
      const res = await axios.get(`http://localhost:3000/api/tasks/${date}`)
      tasks.value = res.data
    } catch (err) {
      if (err.response?.status === 404) {
        tasks.value = [] // no tasks for today — not an error
      } else {
        console.error('Failed to sync/fetch tasks:', err)
      }
    }
  }

  // update a task — used for setting effort weight and deferring
  // "defer" increments timesPostponed so the insight engine can track avoidance patterns
  // the actual event is moved in Google Calendar — this just tells the app you moved it
  async function updateTask(id, data) {
    try {
      const res = await axios.put(`http://localhost:3000/api/tasks/${id}`, data)
      // replace the updated task in the local array so the UI updates immediately
      const i = tasks.value.findIndex(t => t._id === id)
      if (i > -1) tasks.value[i] = res.data
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  return { tasks, syncAndFetch, updateTask }
})

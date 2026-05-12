import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

export const useTasksStore = defineStore('tasks', () => {

  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function syncAndFetch(date) {
    loading.value = true
    error.value = null
    try {
      await axios.post(`${API}/api/gcal/sync`)
      const res = await axios.get(`${API}/api/tasks/${date}`)
      tasks.value = res.data
    } catch (err) {
      error.value = 'Could not load tasks. Check your connection.'
      console.error('Failed to sync/fetch tasks:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateTask(id, data) {
    try {
      const res = await axios.put(`${API}/api/tasks/${id}`, data)
      const i = tasks.value.findIndex(t => t._id === id)
      if (i > -1) tasks.value[i] = res.data
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  return { tasks, loading, error, syncAndFetch, updateTask }
})

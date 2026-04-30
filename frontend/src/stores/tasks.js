import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTasksStore = defineStore('tasks', () => {

  // ref([]) = reactive empty array, will hold tasks for the selected date
  // tasks come from Google Calendar sync via the backend 
  const tasks = ref([])

  return { tasks }
})

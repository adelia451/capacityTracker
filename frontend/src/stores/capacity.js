import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCapacityStore = defineStore('capacity', () => {

  // ref(null) = starts empty, will be set when we call GET /api/capacity from the backend
  // the score is a number, higher is better, can go negative on bad days
  const score = ref(null)

  return { score }
})

<script setup>
import { computed, onMounted } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useCapacityStore } from '../stores/capacity'

const tasksStore = useTasksStore()
const capacityStore = useCapacityStore()
const today = new Date().toLocaleDateString('en-CA')

onMounted(async () => {
  // syncs GCal then fetches today's tasks automatically 
  await tasksStore.syncAndFetch(today)
  await capacityStore.fetchCapacity(today)
})

// planned load = sum of effort weights across all tasks
// computed = recalculates automatically whenever tasks changes
const plannedLoad = computed(() =>
  tasksStore.tasks.reduce((sum, task) => sum + (task.effortWeight || 0), 0)
)

// set effort weight on a task (1–5)
function setEffort(task, weight) {
  tasksStore.updateTask(task._id, { effortWeight: weight })
}

// defer a task: increments timesPostponed so the system can track avoidance patterns
// you still move the actual event in Google Calendar separately
function defer(task) {
  tasksStore.updateTask(task._id, { timesPostponed: (task.timesPostponed || 0) + 1 })
}

// mark a task as completed: only sets completed:true, never goes back to false
function complete(task) {
  tasksStore.updateTask(task._id, { completed: true })
}
</script>

<template>
  <main>
    <h1>Tasks</h1>

    <!-- PLANNED LOAD VS CAPACITY -->
    <!-- shows whether you've planned more than you can handle today -->
    <section>
      <div>
        <span>Capacity</span>
        <!-- display capacityStore.score once you know the field name from the API -->
        <!-- capacityStore.score is the whole API object {date, score, factors} -->
        <!-- .score.score gets the actual number out of it -->
        <!-- ?. = optional chaining: safely returns undefined instead of crashing if score is still null while loading -->
        <!-- ?? '-' = if null or undefined, show a dash instead -->
        <span>{{ capacityStore.score?.score ?? '-' }}</span>
      </div>
      <div>
        <span>Planned load</span>
        <span>{{ plannedLoad }}</span>
      </div>
      <!-- warning if planned load exceeds capacity -->
      <!-- first condition checks a score actually exists before comparing. Without it, plannedLoad > null would always be false -->
      <!-- second condition does the actual comparison -->
      <p v-if="capacityStore.score?.score && plannedLoad > capacityStore.score.score"> ⚠ planned load ({{ plannedLoad }}) exceeds your capacity ({{ capacityStore.score.score }})
</p>

    </section>

    <!-- TASK LIST -->
    <section>
      <p v-if="tasksStore.tasks.length === 0">No tasks for today — syncing from Google Calendar...</p>

      <div v-for="task in tasksStore.tasks" :key="task._id">
        <div>
          <span>{{ task.title }}</span>
          <span>{{ task.category }}</span>
          <span v-if="task.timesPostponed > 0">deferred {{ task.timesPostponed }}×</span>
        </div>

        <!-- EFFORT WEIGHT SELECTOR -->
        <!-- clicking a number calls setEffort and saves to the backend -->
        <div>
          <span>effort:</span>
          <button
            v-for="n in [1,2,3,4,5]"
            :key="n"
            type="button"
            :class="{ selected: task.effortWeight === n }"
            @click="setEffort(task, n)"
          >{{ n }}</button>
        </div>

        <!-- DEFER BUTTON -->
        <button type="button" @click="defer(task)">defer →</button>

        <!-- COMPLETE BUTTON — disabled once marked done, shows confirmation text -->
        <button type="button" @click="complete(task)" :disabled="task.completed">
          {{ task.completed ? 'done ✓' : 'complete' }}
        </button>
      </div>
    </section>
  </main>
</template>

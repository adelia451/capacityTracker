<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasksStore } from '../stores/tasks'
import { useCapacityStore } from '../stores/capacity'

const tasksStore = useTasksStore()
const capacityStore = useCapacityStore()
const today = new Date().toLocaleDateString('en-CA')

// tracks which tasks are expanded — click header to toggle
const expanded = ref(new Set())

function toggleExpand(id) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id)
  } else {
    expanded.value.add(id)
  }
  expanded.value = new Set(expanded.value) // trigger reactivity
}

onMounted(async () => {
  await tasksStore.syncAndFetch(today)
  await capacityStore.fetchCapacity(today)
})

// planned load = sum of effort weights across all tasks
const plannedLoad = computed(() =>
  tasksStore.tasks.reduce((sum, task) => sum + (task.effortWeight || 0), 0)
)

// total minutes worked today across all tasks
const totalMinutes = computed(() =>
  tasksStore.tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0)
)

// minutes worked broken down by category
const minutesByCategory = computed(() => {
  const map = {}
  tasksStore.tasks.forEach(task => {
    if (!map[task.category]) map[task.category] = 0
    map[task.category] += task.timeSpent || 0
  })
  return map
})

// converts minutes to "Xh Ym" display string
function formatMinutes(mins) {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

// formats a dateTime string to HH:MM local time
function formatTime(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function setEffort(task, weight) {
  tasksStore.updateTask(task._id, { effortWeight: weight })
}

function defer(task) {
  tasksStore.updateTask(task._id, { timesPostponed: (task.timesPostponed || 0) + 1 })
}

function undoDefer(task) {
  tasksStore.updateTask(task._id, { timesPostponed: Math.max(0, (task.timesPostponed || 0) - 1) })
}

function complete(task) {
  tasksStore.updateTask(task._id, { completed: !task.completed })
}

const categoryColor = {
  class:       'var(--class)',
  homework:    'var(--homew)',
  practice:    'var(--pract)',
  projects:    'var(--proje)',
  admin:       'var(--admin)',
  maintenance: 'var(--maint)',
  social:      'var(--socia)',
}
</script>

<template>
  <main>
    <!-- PLANNED LOAD VS CAPACITY -->
    <section class="card card-blue">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>⋆</span><span>Capacity vs Planned Load</span><span>⋆</span></div>
        <div class="ct-line"></div>
      </div>

      <div class="bar-label-row">
        <span>Capacity</span>
        <span class="bar-value">{{ capacityStore.score?.score ?? '—' }}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill bar-ok"
          :style="{ width: capacityStore.score?.score ? Math.min(100, (capacityStore.score.score / 10) * 100) + '%' : '0%' }">
        </div>
      </div>

      <div class="bar-label-row">
        <span>Planned load</span>
        <span class="bar-value" :style="{ color: plannedLoad > (capacityStore.score?.score || 99) ? 'var(--bad)' : 'var(--pink)' }">
          {{ plannedLoad }}
        </span>
      </div>
      <div class="bar-track">
        <div class="bar-fill"
          :class="plannedLoad > (capacityStore.score?.score || 99) ? 'bar-warn' : 'bar-ok'"
          :style="{ width: Math.min(100, (plannedLoad / 10) * 100) + '%' }">
        </div>
      </div>

      <p v-if="capacityStore.score?.score && plannedLoad > capacityStore.score.score">
        ⚠ over capacity by {{ (plannedLoad - capacityStore.score.score).toFixed(1) }} pts
      </p>
    </section>

    <!-- HOURS SUMMARY -->
    <section class="card card-ice">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>⋆</span><span>Today's Hours</span><span>⋆</span></div>
        <div class="ct-line"></div>
      </div>
      <div class="hours-total">
        <span>Total</span>
        <span class="hours-val">{{ formatMinutes(totalMinutes) }}</span>
      </div>
      <div v-for="(mins, cat) in minutesByCategory" :key="cat" class="hours-row">
        <span class="hours-cat" :style="{ color: categoryColor[cat] || 'var(--peri)' }">{{ cat }}</span>
        <span class="hours-val">{{ formatMinutes(mins) }}</span>
      </div>
    </section>

    <!-- TASK LIST -->
    <section class="card card-pink">
      <div class="ct">
        <div class="ct-line"></div>
        <div class="ct-inner"><span>✦</span><span>Today's Tasks</span><span>✦</span></div>
        <div class="ct-line"></div>
      </div>
      <p v-if="tasksStore.tasks.length === 0">No tasks for today — syncing from Google Calendar...</p>

      <div v-for="task in tasksStore.tasks" :key="task._id" class="task-item">

        <!-- click header to expand/collapse details -->
        <div class="task-header" @click="toggleExpand(task._id)">
          <!-- line 1: title + deferred badge -->
          <div class="task-main">
            <span class="task-dot" :style="{ background: categoryColor[task.category] || 'var(--peri)' }"></span>
            <span class="task-title" :class="{ completed: task.completed }">{{ task.title }}</span>
            <span v-if="task.timesPostponed > 0" class="task-deferred">deferred {{ task.timesPostponed }}×</span>
          </div>
          <!-- line 2: category + time -->
          <div class="task-meta">
            <span class="task-category" :style="{ color: categoryColor[task.category] || 'var(--peri)', borderColor: categoryColor[task.category] || 'var(--peri)' }">
              {{ task.category }}
            </span>
            <span v-if="task.startTime" class="task-time">
              {{ formatTime(task.startTime) }} → {{ formatTime(task.endTime) }} · {{ formatMinutes(task.timeSpent) }}
            </span>
            <span v-else-if="task.timeSpent" class="task-time">{{ formatMinutes(task.timeSpent) }}</span>
          </div>
        </div>

        <!-- expanded details — effort + action buttons -->
        <div v-if="expanded.has(task._id)">
          <div class="task-actions">
            <span>effort:</span>
            <button
              v-for="n in [1,2,3,4,5]"
              :key="n"
              type="button"
              class="btn-effort"
              :class="{ selected: task.effortWeight === n }"
              @click.stop="setEffort(task, n)"
            >{{ n }}</button>
          </div>

          <div class="task-actions">
            <button type="button" class="btn-defer" @click.stop="defer(task)">defer →</button>
            <button v-if="task.timesPostponed > 0" type="button" class="btn-defer" @click.stop="undoDefer(task)">undo defer</button>
            <button type="button" class="btn-complete" @click.stop="complete(task)">
              {{ task.completed ? 'done ✓' : 'complete' }}
            </button>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

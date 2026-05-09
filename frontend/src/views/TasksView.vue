<script>
import { useTasksStore } from '../stores/tasks'
import { useCapacityStore } from '../stores/capacity'

export default {
  name: 'TasksView',
  setup() {
    return {
      tasksStore: useTasksStore(),
      capacityStore: useCapacityStore()
    }
  },
  data() {
    return {
      today: new Date().toLocaleDateString('en-CA'),
      expanded: new Set(),
      classSkipReasons: ['sick', 'workload', 'period pain', 'low mood', 'tiredness'],
      categoryColor: {
        class:       'var(--class)',
        homework:    'var(--homew)',
        practice:    'var(--pract)',
        projects:    'var(--proje)',
        admin:       'var(--admin)',
        maintenance: 'var(--maint)',
        social:      'var(--socia)',
      }
    }
  },
  computed: {
    plannedLoad() {
      return this.tasksStore.tasks.reduce((sum, task) => sum + (task.effortWeight || 0), 0)
    },
    totalMinutes() {
      return this.tasksStore.tasks
        .filter(task => task.completed || !task.timesPostponed)
        .reduce((sum, task) => sum + (task.timeSpent || 0), 0)
    },
    minutesByCategory() {
      const map = {}
      this.tasksStore.tasks
        .filter(task => task.completed || !task.timesPostponed)
        .forEach(task => {
          if (!map[task.category]) map[task.category] = 0
          map[task.category] += task.timeSpent || 0
        })
      return map
    }
  },
  methods: {
    toggleExpand(id) {
      if (this.expanded.has(id)) {
        this.expanded.delete(id)
      } else {
        this.expanded.add(id)
      }
      this.expanded = new Set(this.expanded)
    },
    formatMinutes(mins) {
      if (!mins) return '—'
      const h = Math.floor(mins / 60)
      const m = mins % 60
      if (h === 0) return `${m}m`
      if (m === 0) return `${h}h`
      return `${h}h ${m}m`
    },
    formatTime(dt) {
      if (!dt) return '—'
      return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    setEffort(task, weight) {
      this.tasksStore.updateTask(task._id, { effortWeight: weight })
    },
    defer(task) {
      this.tasksStore.updateTask(task._id, { timesPostponed: (task.timesPostponed || 0) + 1 })
    },
    undoDefer(task) {
      this.tasksStore.updateTask(task._id, { timesPostponed: Math.max(0, (task.timesPostponed || 0) - 1) })
    },
    complete(task) {
      this.tasksStore.updateTask(task._id, { completed: !task.completed })
    },
    toggleClassSkip(task) {
      this.tasksStore.updateTask(task._id, { skippedClass: !task.skippedClass })
    },
    toggleClassSkipReason(task, reason) {
      const current = task.skipClassReasons || []
      const i = current.indexOf(reason)
      const next = i > -1 ? current.filter(r => r !== reason) : [...current, reason]
      this.tasksStore.updateTask(task._id, { skipClassReasons: next })
    }
  },
  async mounted() {
    await this.tasksStore.syncAndFetch(this.today)
    await this.capacityStore.fetchCapacity(this.today)
  }
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
        <span class="bar-value">{{ capacityStore.score?.score != null ? Math.round(capacityStore.score.score * 10) / 10 : '—' }}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill bar-ok"
          :style="{ width: capacityStore.score?.score ? Math.min(100, (capacityStore.score.score / 10) * 100) + '%' : '0%' }">
        </div>
      </div>

      <div class="bar-label-row">
        <span>Planned load</span>
        <span class="bar-value" :style="{ color: plannedLoad > (capacityStore.score?.score ?? 0) ? 'var(--bad)' : 'var(--blue)' }">
          {{ plannedLoad }}
        </span>
      </div>
      <div class="bar-track">
        <div class="bar-fill"
          :class="plannedLoad > (capacityStore.score?.score ?? 0) ? 'bar-bad' : plannedLoad > (capacityStore.score?.score ?? 0) * 0.8 ? 'bar-warn' : 'bar-ok'"
          :style="{ width: Math.min(100, (plannedLoad / 10) * 100) + '%' }">
        </div>
      </div>

      <p v-if="capacityStore.score?.score && plannedLoad > capacityStore.score.score">
        ⚠ over capacity by {{ (plannedLoad - capacityStore.score.score).toFixed(1) }} pts
      </p>
    </section>

    <!-- HOURS SUMMARY -->
    <section class="card card-pink">
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
        <span class="hours-cat" :style="{ color: categoryColor[cat] || 'var(--text-muted)' }">{{ cat }}</span>
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
      <p v-if="tasksStore.loading" class="state-loading">Syncing with Google Calendar...</p>
      <p v-else-if="tasksStore.error" class="state-error">{{ tasksStore.error }}</p>
      <p v-else-if="tasksStore.tasks.length === 0" class="state-empty">No tasks scheduled for today.</p>

      <div v-for="task in tasksStore.tasks" :key="task._id" class="task-item">

        <!-- click header to expand/collapse details -->
        <div class="task-header" @click="toggleExpand(task._id)">
          <!-- line 1: title + deferred badge -->
          <div class="task-main">
            <span class="task-dot" :style="{ background: categoryColor[task.category] || 'var(--text-muted)' }"></span>
            <span class="task-title" :class="{ completed: task.completed }">{{ task.title }}</span>
            <span v-if="task.timesPostponed > 0" class="task-deferred">deferred {{ task.timesPostponed }}×</span>
          </div>
          <!-- line 2: category + time -->
          <div class="task-meta">
            <span class="task-category" :style="{ color: categoryColor[task.category] || 'var(--text-muted)', borderColor: categoryColor[task.category] || 'var(--text-muted)' }">
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

          <template v-if="task.category === 'class'">
            <div class="task-actions">
              <button type="button" class="btn-complete" @click.stop="toggleClassSkip(task)">
                {{ task.skippedClass ? 'skipped ✗' : 'attended ✓' }}
              </button>
            </div>
            <div v-if="task.skippedClass" class="task-actions">
              <span style="font-size: 11px; color: var(--text-muted); font-family: var(--bf);">why?</span>
              <button v-for="reason in classSkipReasons" :key="reason" type="button"
                class="btn-effort"
                :class="{ selected: task.skipClassReasons?.includes(reason) }"
                @click.stop="toggleClassSkipReason(task, reason)">{{ reason }}</button>
            </div>
          </template>
          <template v-else>
            <div class="task-actions">
              <button type="button" class="btn-defer" @click.stop="defer(task)">defer →</button>
              <button v-if="task.timesPostponed > 0" type="button" class="btn-defer" @click.stop="undoDefer(task)">undo defer</button>
              <button type="button" class="btn-complete" @click.stop="complete(task)">
                {{ task.completed ? 'done ✓' : 'complete' }}
              </button>
            </div>
          </template>
        </div>

      </div>
    </section>
  </main>
</template>

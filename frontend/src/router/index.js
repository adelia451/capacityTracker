import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CapacityView from '../views/CapacityView.vue'
import TasksView from '../views/TasksView.vue'
import RestMoodView from '../views/RestMoodView.vue'
import IntakeView from '../views/IntakeView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
  { path: '/',           component: HomeView },
  { path: '/capacity',   component: CapacityView },
  { path: '/tasks',      component: TasksView },
  { path: '/rest-mood',  component: RestMoodView },
  { path: '/intake',     component: IntakeView },
  { path: '/history',    component: HistoryView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
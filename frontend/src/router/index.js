import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CapacityView from '../views/CapacityView.vue'
import TasksView from '../views/TasksView.vue'
import MoodView from '../views/MoodView.vue'
import SleepView from '../views/SleepView.vue'
import MedicationView from '../views/MedicationView.vue'
import IntakeView from '../views/IntakeView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/capacity', component: CapacityView },
    { path: '/tasks', component: TasksView },
    { path : '/mood', component: MoodView },
    { path: '/sleep', component: SleepView },
    { path: '/medication', component: MedicationView },
    { path: '/intake', component: IntakeView },
    { path: '/history', component: HistoryView }
]

export default createRouter({
    history: createWebHistory(),
    routes,
})


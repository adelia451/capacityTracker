import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CapacityView from '../views/CapacityView.vue'
import RestMoodView from '../views/RestMoodView.vue'
import MedIntakeView from '../views/MedIntakeView.vue'
import TasksView from '../views/TasksView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/capacity', component: CapacityView },
    { path: '/rest-mood', component: RestMoodView },
    { path: '/med-intake', component: MedIntakeView },
    { path: '/tasks', component: TasksView },
    { path: '/history', component: HistoryView }
]

export default createRouter({
    history: createWebHistory(),
    routes,
})


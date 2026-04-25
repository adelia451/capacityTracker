# Step 2: Front-End

**Goals**

- Build the Vue front-end and connect it to your running back-end:
  - Vite project scaffolded, Vue Router configured, Pinia store set up where appropriate
  - All screens from your wireframes exist as Vue components (even if some are still placeholder stubs)
  - A user can perform the app's core action and the result persists in MongoDB

---
## SETUP
---

### 2.1: Scaffold, and Install

The frontend is a Vite + Vue 3 app in the `frontend/` folder.

From the repo root:

```bash
npm create vite@latest frontend -- --template vue
cd frontend
npm install
npm install vue-router@4 pinia axios
```

**What each package does:**
- `vue-router@4` — maps URLs to pages (e.g. `/history` loads the History page)
- `pinia` — shared state management, so any component can read/write the same data
- `axios` — sends HTTP requests to the backend API

---

### 2.2 Clean Up The Boilerplate

Delete the files Vite generates that you don't need:
- `src/components/HelloWorld.vue`
- `src/assets/vue.svg`

---

### 2.3 Set up the folder structure

Create these folders and files inside `src/`:

```
src/
├── main.js          ← already exists, you'll update it
├── App.vue          ← already exists, you'll update it
├── router/
│   └── index.js     ← defines all 6 routes
├── stores/
│   ├── logs.js      ← Pinia store for daily logs
│   ├── tasks.js     ← Pinia store for tasks
│   └── capacity.js  ← Pinia store for capacity score
├── views/           ← one file per page
│   ├── HomeView.vue
│   ├── CapacityView.vue
│   ├── RestMoodView.vue
│   ├── MedIntakeView.vue
│   ├── TasksView.vue
│   └── HistoryView.vue
└── components/      ← reusable pieces used inside views
    ├── NavBar.vue
    ├── CapacityGauge.vue
    ├── MedCurve.vue
    └── logging/
        ├── SleepForm.vue
        ├── MoodForm.vue
        ├── StressForm.vue
        ├── NapForm.vue
        ├── MedicationForm.vue
        ├── ProteinForm.vue
        └── AlcoholForm.vue
```

**Customization note:** The `views/` names map directly to routes. If you want to rename a page, change the filename, the route path in `router/index.js`, and the import in the same file.

---

### 2.4: Rewrite App.vue

`App.vue` is the root of the entire app. It renders the nav bar and a `<RouterView />`, which is a slot that Vue Router swaps out for whichever view matches the current URL.

```vue
<template>
  <nav>navbar goes here</nav>
  <RouterView />
</template>
```
---

### 2.5: Create The Router

`src/router/index.js` tells Vue Router which component to load for each URL path.

```js
import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CapacityView from '../views/CapacityView.vue'
import RestMoodView from '../views/RestMoodView.vue'
import MedIntakeView from '../views/MedIntakeView.vue'
import TasksView from '../views/TasksView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
  { path: '/',           component: HomeView },
  { path: '/capacity',   component: CapacityView },
  { path: '/rest-mood',  component: RestMoodView },
  { path: '/med-intake', component: MedIntakeView },
  { path: '/tasks',      component: TasksView },
  { path: '/history',    component: HistoryView },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
```

**Customization note:** To add a new page, add a new view file, import it here, and add a `{ path, component }` entry to the `routes` array.

---

### 2.6: Update main.js

`main.js` is the entry point. It creates the Vue app and registers Pinia and Vue Router as plugins before mounting.

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // must be registered before any store is used
app.use(router)        // enables <RouterView> and <RouterLink> everywhere

app.mount('#app')      // attaches to <div id="app"> in index.html
```
---

### 2.7: Create Views (placeholders)

This part lets you confirm routing works before building the real UI.

```vue
<template>
  <main>
    <h1>Home</h1>
  </main>
</template>
```

Repeat for each view, changing the heading. Then run the dev server and visit each route to confirm they load.

---

### 2.8: Run The Dev Server

```bash
npm run dev
```

Visit `http://localhost:5173`. Navigate to `/history`, `/tasks`, etc. and confirm each page loads.

--- 

## How the pieces connect

```
Browser URL
    ↓
Vue Router (router/index.js)  ←→  picks which View to show
    ↓
View component (views/*.vue)  ←→  reads/writes data via Pinia stores
    ↓
Pinia store (stores/*.js)     ←→  calls the backend via axios
    ↓
Backend API (localhost:3000)  ←→  reads/writes MongoDB
```

---
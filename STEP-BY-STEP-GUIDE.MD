# Step 2: Front-End

**Goals**

- Build the Vue front-end and connect it to your running back-end:
  - Vite project scaffolded, Vue Router configured, Pinia store set up where appropriate
  - All screens from your wireframes exist as Vue components (even if some are still placeholder stubs)
  - A user can perform the app's core action and the result persists in MongoDB

---
## SETUP
---

### 2.1: Scaffold and Install

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

### 2.2: Clean Up The Boilerplate

Delete the files Vite generates that you don't need:
- `src/components/HelloWorld.vue`
- `src/assets/vue.svg`

---

### 2.3: Set Up The Folder Structure

Create these folders and files inside `src/`:

```
src/
├── main.js              ← already exists, you'll update it
├── App.vue              ← already exists, you'll update it
├── style.css            ← already exists
├── router/
│   └── index.js         ← defines all routes
├── stores/
│   ├── logs.js          ← Pinia store for daily logs (reference file — see below)
│   ├── tasks.js         ← Pinia store for tasks
│   └── capacity.js      ← Pinia store for capacity score
├── views/               ← one file per page
│   ├── HomeView.vue
│   ├── CapacityView.vue
│   ├── SleepView.vue
│   ├── MoodView.vue
│   ├── MedicationView.vue
│   ├── IntakeView.vue
│   ├── TasksView.vue
│   └── HistoryView.vue
└── components/
    └── NavBar.vue
```

**Customization note:** The `views/` names map directly to routes. If you want to rename a page, change the filename, the route path in `router/index.js`, and the import in the same file.

---

### 2.4: Rewrite App.vue

`App.vue` is the root of the entire app. It imports `NavBar` and renders it above `<RouterView />`, which is a slot Vue Router swaps out for whichever view matches the current URL.

```vue
<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
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
import MoodView from '../views/MoodView.vue'
import SleepView from '../views/SleepView.vue'
import MedicationView from '../views/MedicationView.vue'
import IntakeView from '../views/IntakeView.vue'
import TasksView from '../views/TasksView.vue'
import HistoryView from '../views/HistoryView.vue'

const routes = [
  { path: '/',            component: HomeView },
  { path: '/capacity',    component: CapacityView },
  { path: '/mood',        component: MoodView },
  { path: '/sleep',       component: SleepView },
  { path: '/medication',  component: MedicationView },
  { path: '/intake',      component: IntakeView },
  { path: '/tasks',       component: TasksView },
  { path: '/history',     component: HistoryView },
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

### 2.7: Create NavBar.vue

`src/components/NavBar.vue` renders the navigation links. `<RouterLink>` is Vue Router's version of `<a>` — it navigates without reloading the page.

```vue
<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/capacity">Capacity</RouterLink>
    <RouterLink to="/tasks">Tasks</RouterLink>
    <RouterLink to="/mood">Mood</RouterLink>
    <RouterLink to="/sleep">Sleep</RouterLink>
    <RouterLink to="/medication">Medication</RouterLink>
    <RouterLink to="/intake">Intake</RouterLink>
    <RouterLink to="/history">History</RouterLink>
  </nav>
</template>
```

---

### 2.8: Create Pinia Stores

Stores hold shared data that any component can read or write. See `stores/logs.js` for the fully commented reference.

Each store follows this structure:

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExampleStore = defineStore('example', () => {
  const data = ref([])

  async function fetchData() {
    // axios call to backend goes here
  }

  return { data, fetchData }
})
```

**`stores/logs.js`** — handles daily logs. Actions:
- `saveSleep(date, sleepData)` — POSTs a new log or PUTs if one already exists for today
- `saveNap(date, napData)` — appends a nap to today's log's `naps` array
- `saveMood(date, moodData)` — appends a mood entry (with `time`, `value`, `reason`) to `moodLogs`
- `saveStress(date, stressData)` — appends a stress entry (with `time`, `value`, `reason`) to `stressLogs`
- `saveMedication(date, medData)` — POSTs or PUTs the `medication` field on today's log
- `fetchTodayLog(date)` — GETs today's log and stores it in `todayLog` for pre-filling forms

**`stores/tasks.js`** — holds tasks array (populated from Google Calendar sync)

**`stores/capacity.js`** — holds today's capacity score

---

### 2.9: Create Stub Views

Each view starts as a minimal stub so you can confirm routing works before building real UI.

```vue
<template>
  <main>
    <h1>Page Name</h1>
  </main>
</template>
```

Create one for each view, changing the heading. Then run the dev server and visit each route to confirm they load.

---

### 2.10: Run The Dev Server

```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173`. Navigate to `/sleep`, `/mood`, etc. and confirm each page loads.

> **Note:** The backend must also be running for any form submissions to work. From your backend folder: `node server.js`

---

### 2.11: Build The Logging Views

The logging views (Sleep, Mood, Medication) follow a shared pattern:

1. **Refs** for each form field
2. **`onMounted`** to pre-fill the form if data was already logged today
3. **Save function** that calls the store action
4. **Template** with form inputs, button groups, and a `v-if` message

**Hours auto-calculation (Sleep + Nap)**

Hours are calculated from the time inputs rather than entered manually:

```js
function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

let minutes = timeToMinutes(endTime) - timeToMinutes(startTime)
if (minutes < 0) minutes += 1440  // handles overnight (e.g. 23:00 → 07:00)
const hours = minutes / 60
```

**Reason field (Mood + Stress)**

Both `moodLogs` and `stressLogs` include a `reason` field. The reason defaults to `'no clear reason'` so it's always valid even if the user doesn't pick one. The full reason list is shared between mood and stress.

**Multi-select arrays (Medication)**

`medQuality`, `focusQuality`, and `skipReasons` are arrays — the user can pick more than one. Each uses a toggle function:

```js
function toggleMedQuality(val) {
  const i = medQuality.value.indexOf(val)
  i > -1 ? medQuality.value.splice(i, 1) : medQuality.value.push(val)
}
```

**Skipped toggle (Medication)**

`v-if` / `v-else` swaps the form between two sections depending on whether medication was taken or skipped:

```vue
<div v-if="skipped">
  <!-- skip reasons -->
</div>
<div v-else>
  <!-- time fields + quality selectors -->
</div>
```

**Pre-filling with `onMounted`**

`onMounted` is a Vue lifecycle hook that runs once when the component appears on screen. Used in SleepView and MedicationView to fetch today's existing log and pre-fill the form fields:

```js
onMounted(async () => {
  await logsStore.fetchTodayLog(today)
  const existing = logsStore.todayLog?.medication
  if (existing) {
    takenAt.value = existing.takenAt || ''
    // ... fill in remaining fields
  }
})
```

**To test:** fill in any logging form, click Save, then in Thunder Client send `GET http://localhost:3000/api/logs` — your entry should appear.

---

## Key Concepts

### `ref()` — reactive values

A `ref` is a box that holds a value. Vue watches the box — when the value inside changes, Vue automatically updates anything on screen that's showing it.

```js
const message = ref('')      // box starts empty
message.value = 'Saved!'     // put something in the box — Vue sees this and updates the screen
```

The `.value` part is how you read or set what's inside the box in JavaScript. In the `<template>`, Vue handles `.value` for you automatically — you just write `{{ message }}`.

The starting value goes inside `ref(...)`:

| Starting value | Use it for |
|---|---|
| `ref('')` | text fields, time inputs — anything the user types |
| `ref(null)` | something that starts as nothing until fetched |
| `ref([])` | a list that starts empty |
| `ref('neutral')` | a default selection |

**Why not just use a regular variable?**
If you write `let message = ''` and change it, Vue doesn't notice — the screen won't update. `ref()` is what tells Vue to watch it.

---

## Reference Files

Each concept has one heavily-commented file. If you're confused about how something works, start here — other files of the same type intentionally skip the explanations to avoid repetition.

| Concept | Folder | Reference file | What it explains |
|---|---|---|---|
| App entry point | `frontend/src/` | `main.js` | `createApp`, `.use()`, plugin registration, `.mount()` |
| Router | `frontend/src/router/` | `index.js` | `createRouter`, `createWebHistory`, route objects |
| Pinia stores | `frontend/src/stores/` | `logs.js` | `defineStore`, `ref()`, `async` actions, axios calls, POST-or-PUT pattern |
| Views — logging | `frontend/src/views/` | `SleepView.vue` | `v-model`, `v-for`, `@submit`, `onMounted`, using a store |
| Views — advanced | `frontend/src/views/` | `MedicationView.vue` | `onMounted` pre-fill, `v-if`/`v-else`, multi-select toggle, boolean checkbox |
| Components | `frontend/src/components/` | `NavBar.vue` | `<RouterLink>`, component structure |

---

## How The Pieces Connect

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

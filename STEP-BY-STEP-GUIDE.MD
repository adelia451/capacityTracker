# Capacity Tracker -- Front-End Setup Guide

This guide explains how to set up the Capacity Tracker from scratch on a new machine. It was edited with AI assistance (Claude Code) throughout the build process to help improve wording.

---
## Setting Up from Scratch 
This guide covers the front-end only. To run the full app locally you also need the back-end running. Setup instructions are in the back-end repository's own step-by-step guide.

## Step 1: Back-End API
Follow the back-end repository's setup guide to get the API running locally. The front-end expects it at http://localhost:3000 by default. Once it's running, continue with Step 2 below.

---

## Step 2: Front-End Setup

### 2.1 Scaffold and Install

The frontend lives in the `frontend/` folder. From the repo root:

```bash
cd frontend
npm install
```

If starting from scratch rather than cloning:

```bash
npm create vite@latest frontend -- --template vue
cd frontend
npm install vue-router@4 pinia axios
```

**What each package does:**
- `vue-router@4` : maps URLs to Vue components (e.g. `/tasks` loads TasksView)
- `pinia` : shared state so any component can read/write the same data without passing props
- `axios` : sends HTTP requests to the backend API

### 2.2: Configure the API URL

Create a `.env` file inside the `frontend/` folder:

```
VITE_API_URL=http://localhost:3000
```

This is the only environment variable the frontend needs. All three Pinia stores read it via `import.meta.env.VITE_API_URL`, so changing one line here switches the entire app between local and production backends.

When deployed, change this value to your live backend URL.

> `.env` is in `.gitignore` and must never be committed.

### 2.3: Project Structure

```
frontend/src/
├── main.js              ← entry point: registers Pinia + Vue Router, mounts app
├── App.vue              ← root component: NavBar + RouterView + cursor/floater effects
├── style.css            ← all global styles and CSS variables
├── router/
│   └── index.js         ← maps URL paths to view components
├── stores/
│   ├── logs.js          ← daily log data (sleep, mood, stress, medication, alcohol)
│   ├── tasks.js         ← task data from Google Calendar sync
│   └── capacity.js      ← capacity score, insights, predictions, calibration
├── views/
│   ├── HomeView.vue     ← today's summary, capacity gauge, end-of-day rating, insights
│   ├── CapacityView.vue ← capacity score, contributing factors, predictions, calibration
│   ├── TasksView.vue    ← task list with effort weights, deferral, and class skip tracking
│   ├── RestMoodView.vue ← tabbed: sleep / mood / stress / naps
│   ├── IntakeView.vue   ← tabbed: medication / protein / alcohol
│   └── HistoryView.vue  ← historical log view (placeholder)
└── components/
    ├── NavBar.vue        ← navigation bar with RouterLink items
    └── CapacityGauge.vue ← SVG circular gauge, accepts score and max as props
```

### 2.4: Run the Dev Server

```bash
npm run dev
```

Visit `http://localhost:5173`. The backend must also be running for any data to load. Start it with `node server.js` from the `backend/` folder in a separate terminal.

### 2.5: Verify Frontend Connects to Backend

1. Start both servers (frontend on 5173, backend on 3000)
2. Open the app and navigate to the Rest & Mood page
3. Log a sleep entry and click Save
4. In Thunder Client, send `GET http://localhost:3000/api/logs` -- your entry should appear

If the save silently fails, check the browser console for CORS errors or a wrong API URL.

---

## Part 3 : How the Frontend Works

### Options API Pattern

Every Vue component uses the Options API with `export default {}`. Data that the template needs to react to goes in `data()`. Logic goes in `methods`. Lifecycle hooks (`mounted`, `unmounted`) run at the right moments automatically.

```js
export default {
  name: 'ExampleView',
  data() {
    return {
      message: '',
      items: []
    }
  },
  methods: {
    async loadData() {
      // axios calls or store actions go here
    }
  },
  mounted() {
    this.loadData()
  }
}
```

### Pinia Stores with Options API

Stores are accessed in the `setup()` option. This is the standard pattern for using Pinia alongside Options API. The store is then available as `this.storeName` throughout `methods` and `mounted`.

```js
setup() {
  return {
    logsStore: useLogsStore()
  }
},
mounted() {
  this.logsStore.fetchTodayLog(this.today)
}
```

### POST-or-PUT Pattern (Logs Store)

The backend only allows one daily log per date. When saving any field, the store tries a POST first. If it gets a 400 (log already exists), it fetches the existing log's `_id` and sends a PUT instead. All six save actions follow this pattern. See `stores/logs.js` for the full implementation.

### Tabbed Views

RestMoodView and IntakeView use tabs instead of separate pages. The active tab is tracked in `data()` as a string:

```js
data() {
  return {
    activeTab: 'sleep',
    tabs: ['sleep', 'mood', 'stress', 'naps']
  }
}
```

The template uses `v-if="activeTab === 'sleep'"` on each section. Switching tabs just updates `activeTab`.

### Multi-Select Toggle Pattern

Medication quality, focus quality, skip reasons, mood reasons, and stress reasons all support picking multiple options at once. Each uses an array in `data()` and a toggle method:

```js
toggleMedQuality(val) {
  const i = this.medQuality.indexOf(val)
  i > -1 ? this.medQuality.splice(i, 1) : this.medQuality.push(val)
}
```

The button's selected state is `:class="{ selected: medQuality.includes(val) }"`.

---

## Part 4 : Special Features

### Keyboard Navigation

The app has two layers of keyboard shortcuts, both active only while their respective component is mounted:

**Between pages (App.vue): Alt + key:**
- `Alt + ArrowRight` / `Alt + ArrowLeft` -- cycle through pages in order
- `Alt + 1` through `Alt + 6` -- jump directly to a page by number

**Between tabs (RestMoodView + IntakeView): Ctrl + key:**
- `Ctrl + ArrowRight` / `Ctrl + ArrowLeft` -- cycle through tabs
- `Ctrl + 1`, `Ctrl + 2`, etc. -- jump to a specific tab

This is implemented by adding a `keydown` listener in `mounted()` and removing it in `unmounted()` to avoid it firing on other pages. A bound arrow function is stored in `data()` to ensure the same reference is used for both add and remove:

```js
mounted() {
  this.boundKeydown = (e) => this.handleKeydown(e)
  window.addEventListener('keydown', this.boundKeydown)
},
unmounted() {
  window.removeEventListener('keydown', this.boundKeydown)
}
```

### Cursor Sparkle Effect

App.vue spawns small animated symbols that follow the cursor and float across the background. These are created as DOM elements directly (not Vue components) and use inline CSS custom properties (`--dx`, `--dy`, `--op`, etc.) set per-element in JavaScript. These are not defined in `:root`. They are injected at the element level so each floater or spark has its own values.

### CSS Architecture

All styles are in one file (`style.css`) using CSS custom properties for the palette. Key things to know:

**Card variants**: `.card` sets structure only (border-radius, padding, overflow). Color comes from a variant class like `.card-pink`, `.card-blue`, `.card-purple`, `.card-yellow`. Each variant sets background, border-color, and box-shadow.

**Specificity** : `.card button[type="button"]` has specificity 0,2,1 which is higher than a plain class selector like `.btn-effort` (0,1,0). Any button inside a card that needs its own styles must be targeted as `.card button.btn-effort` to win. This pattern applies to `.btn-effort`, `.btn-defer`, and `.btn-complete`.

**Per-value mood/stress/sleep colors**: buttons for emotional states use `data-` attributes (`data-mood="happy"`, `data-stress="balanced"`, `data-sleep="awake"`) which CSS targets with attribute selectors. This lets each value have its own selected color without JavaScript.

**Reason group colors**: mood and stress reason buttons use `data-reason-group` (set from a `reasonGroups` map in the component) so internal, physical, and external reasons each get a distinct selected color.

---

## Part 5 : Deployment

*(To be completed during Week 15)*

---

## How the Pieces Connect

```
Browser URL
    ↓
Vue Router (router/index.js)   ← picks which View to render
    ↓
View component (views/*.vue)   ← reads/writes via Pinia stores
    ↓
Pinia store (stores/*.js)      ← calls backend via axios using VITE_API_URL
    ↓
Backend API (port 3000)        ← reads/writes MongoDB Atlas
```

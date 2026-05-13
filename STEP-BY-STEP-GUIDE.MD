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

The backend only allows one daily log per date. When saving any field, the store tries a POST first. If it gets a 400 (log already exists), it fetches the existing log's `_id` and sends a PUT instead.

All save actions share a single internal helper `upsertLog(date, fields, appendEntry)` in `stores/logs.js`. The third argument is only used for fields that append to an array (moods, stress entries, naps). For scalar fields (sleep, medication, alcohol, rating) it is omitted.

```js
// scalar replacement
async function saveSleep(date, sleepData) {
  await upsertLog(date, { sleep: sleepData })
}

// array append — merges new entry into existing array on PUT
async function saveMood(date, moodData) {
  await upsertLog(date, {}, { field: 'moodLogs', value: moodData })
}
```

When `appendEntry` is provided and the log already exists, `upsertLog` fetches the existing array and spreads the new entry in: `[...existing.moodLogs, moodData]`. On a fresh POST (no existing log) it wraps the entry in a new array automatically.

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

### Time Inputs

All time inputs use `type="time"` (not `type="text"`). This gives the browser's native time picker, which displays in AM/PM on Windows. The `v-model` value is always stored and sent to the backend as `"HH:MM"` in 24-hour format internally — the AM/PM display is handled entirely by the browser. The `timeToMinutes` helper used in sleep and nap calculations parses this format correctly.

### Single-Select vs Multi-Select Buttons

Some button groups pick one value (single-select), others allow multiple (multi-select).

**Single-select** — the value is a plain string in `data()`. Clicking a button sets the string directly:
```js
// data
medQuality: '',
focusQuality: '',

// template
@click="medQuality = option"
:class="{ selected: medQuality === option }"
```
Used by: med quality, focus quality, sleep state, mood value, stress value, nap rested-after, alcohol count.

**Multi-select** — the value is an array in `data()` with a toggle method:
```js
toggleMoodReason(reason) {
  const i = this.moodReason.indexOf(reason)
  i > -1 ? this.moodReason.splice(i, 1) : this.moodReason.push(reason)
}
```
The button's selected state is `:class="{ selected: moodReason.includes(reason) }"`.

Used by: mood reasons, stress reasons, medication skip reasons.

### Tab Message Clearing

Both tabbed views (RestMoodView, IntakeView) use a `watch` on `activeTab` to clear the status message when the user switches tabs. Without this, a "Saved!" from one tab would persist and look like confirmation of an action on the new tab.

```js
watch: {
  activeTab() { this.message = '' }
}
```

### Error Handling in Views

Every async method that calls a store save action wraps it in try/catch and sets `this.message` on failure. This ensures the user always gets feedback instead of a silent failure:

```js
async saveSleep() {
  try {
    await this.logsStore.saveSleep(this.today, { ... })
    this.message = 'Sleep logged!'
  } catch {
    this.message = 'Could not save. Try again.'
  }
}
```

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

This app is deployed on a personal server running Ubuntu with nginx as a reverse proxy. The backend runs as a Node process managed by PM2. nginx forwards all traffic to the Node backend, which handles both the API routes and serving the built frontend static files via `express.static`.

1. SSH into the server.

2. Check which ports are already in use and pick a free one:

```bash
ss -tlnp | grep LISTEN
```

3. Clone both repositories onto the server.

4. In your backend repository, run `npm install` and create a `.env` file with the same variables as your local setup, using your chosen port and production values.

5. Start the backend with PM2, replacing (your chosen name) with whatever you want to call the process:

```bash
pm2 start server.js --name (your chosen name)
pm2 save
pm2 startup
```

`pm2 startup` prints a command. Copy and run it to make PM2 survive server reboots.

6. In your frontend repository, create a `.env` file pointing to your production domain:

```
VITE_API_URL=http://yourdomain.com
```

Then run `npm install` and `npm run build`. This creates a `dist/` folder that the backend serves via `express.static`.

7. Create an nginx config for your site. nginx should be set up as a pure reverse proxy, forwarding all traffic to your Node backend on the port you chose. Enable the site with a symlink, test the config with `nginx -t`, and reload nginx.

8. Run certbot to get an SSL certificate for your domain. After this, update your frontend `.env` to use `https` instead of `http` and rebuild with `npm run build`.

9. Updating after code changes:

Backend: pull the latest code, run `npm install`, then restart the PM2 process.

Frontend: pull the latest code, run `npm install`, then rebuild with `npm run build`.



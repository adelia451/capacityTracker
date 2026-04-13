# BRIEF.md — Project Proposal

## Project Name
**Capacity Tracker** (Adaptive Capacity and Pattern Learning System)

---

## The Problem It Solves
People with ADHD experience highly variable daily capacity that is shaped by biology, behavior, and environment — yet most productivity tools assume a stable, consistent baseline. This app models what a user is *realistically capable of* on any given day, rather than measuring how much they did against a fixed standard.

---

## Who Uses This, and What Does It Let Them Do?
A single user (the developer) who wants to understand the personal patterns that drive or limit their focus, energy, and output. The app lets them:
- Log biological and behavioral data each day (mood, sleep, stress, medication, protein intake)
- Track tasks and whether they were completed, delayed, or avoided
- View a computed capacity score that reflects their actual state
- See insights derived from their own historical patterns
- Get a prediction of next-day capacity based on recent trends

---

## Core Features

- **Daily Logging System** — Log mood, stress, sleep, medication timing and effectiveness, and protein intake. Multiple entries per day are supported for mood and stress to capture how state shifts over time.

- **Task Tracking with Postponement Behavior** — Create and categorize tasks, mark them complete, log time spent, and track how many times each task was deferred. Postponements are interpreted in context: if total planned load exceeded realistic capacity for that day, deferrals are flagged as an over-scheduling pattern, not a productivity failure. Avoidance is only inferred when capacity was sufficient and load was reasonable.

- **Capacity Engine** — A backend service that computes a daily capacity score from logged inputs using a weighted formula. The score represents what the user was realistically capable of, not what they achieved.

- **Medication Effectiveness Tracking** — Log perceived medication onset, peak, and end times alongside focus quality and actual output. The system detects when effectiveness is reduced by other factors such as poor sleep or high stress.

- **Pattern Insights** — The backend analyzes historical logs to surface readable insights: correlations between sleep and output, mood trends, postponement spikes, and recurring burnout cycles.

- **Next-Day Prediction** — Based on recent logs and detected patterns, the system estimates future capacity levels to support planning decisions. Prediction range extends as far as the data supports — the more logged, the further and more accurately the system can project.

---

## Data Model

### Collection: `dailyLogs`
| Field | Type | Notes |
|---|---|---|
| `date` | String | YYYY-MM-DD format |
| `sleep.hours` | Number | Hours of sleep |
| `sleep.state` | String | sleepy / tired / normal / high energy |
| `moodLogs` | Array | `{ time, value }` — multiple entries per day |
| `stressLogs` | Array | `{ time, value }` — multiple entries per day |
| `medication.takenAt` | String | Time of dose |
| `medication.feltOnset` | String | Perceived onset time |
| `medication.feltPeak` | String | Perceived peak time |
| `medication.feltEnd` | String | Perceived end time |
| `medication.focusCapacityHours` | Number | 0–10 |
| `medication.feltQuality` | Number | 0–100 |
| `medication.skipped` | Boolean | Whether dose was skipped |
| `medication.skipReasons` | Array | Reasons for skipping |
| `proteinLogs` | Array | `{ time, grams }` |
| `naps` | Array | `{ start, end, rested }` |
| `alcohol` | Boolean | Whether alcohol was consumed |
| `cycleDay` | Number | Optional cycle tracking |

### Collection: `tasks`
| Field | Type | Notes |
|---|---|---|
| `title` | String | Task name |
| `category` | String | school / personal / social / chores / creative |
| `date` | String | YYYY-MM-DD |
| `completed` | Boolean | Completion status |
| `timeSpent` | Number | Minutes |
| `effortWeight` | Number | Estimated cognitive load (1–5 scale) |
| `plannedLoad` | Number | Sum of effort weights for the day |
| `timesPostponed` | Number | Deferral count |

---

## API Endpoint Table

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/logs` | Create a new daily log |
| `GET` | `/api/logs` | Get all daily logs |
| `GET` | `/api/logs/:date` | Get log for a specific date |
| `PUT` | `/api/logs/:id` | Update a daily log |
| `DELETE` | `/api/logs/:id` | Delete a daily log |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/:date` | Get tasks for a specific date |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/capacity` | Get computed capacity score for a date |
| `GET` | `/api/insights` | Get pattern insights from historical data |
| `GET` | `/api/prediction` | Get next-day capacity prediction |

---

## Authentication
**No.** This is a deliberately single-user system. The application models personal behavioral and biological patterns that are meaningful only in the context of one individual's data. There is no need for user accounts, sessions, or access control.
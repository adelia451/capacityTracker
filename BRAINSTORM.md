# BRAINSTORM.md 
---
## AI Conversation

After much back and forth about what I want, what I want/need to use, explaining personal nuances, I asked if they can summarize the plan. Please note that the scope of this plan is larger than the requirements, so there are some features I will not implement for this sumbission but will work on in the future. 

**AI:** 
```
Core Concept
This application is a self-learning productivity and capacity system designed for ADHD.
Instead of measuring:
"How much did I do?"
It models:
What was realistically possible given biology, behavior, and patterns

The system learns how different factors affect:
focus
energy
emotional state
productivity capacity

It then:
predicts future capacity (short and long range, as far as data supports)
detects behavioral and biological patterns
provides contextual insights (not judgments)

System Philosophy
No fixed assumptions (e.g., no "8 hours of sleep = good" rules)
No punishment-based productivity
No generic advice
All outputs are:
personalized
learned from user data
context-aware

Postponements are never treated as failures in isolation. The system distinguishes between:
Avoidance: capacity was sufficient, load was reasonable, task was still deferred → meaningful behavioral signal
Over-scheduling: total planned cognitive load exceeded realistic capacity for the day → planning signal, not a productivity failure

This distinction is core to the system's philosophy. A high-output day where tasks were still deferred because too much was planned is a successful day with a planning note — not a failure.


Data Model

Internal State (High Frequency Logging)
Mood (logged unlimited times per day)
Stress (continuous scale, user-defined input)
Emotional trends (especially night mood → next-day impact)
Subjective rest state
Sleep state is categorical instead of numeric:
sleepy
tired (but not sleepy)
normal
high energy

Medication (Dynamic, User-Defined)
Each dose:
{
  "takenAt": "...",
  "feltOnset": "...",
  "feltPeak": "...",
  "feltEnd": "...",
  "focusCapacityHours": 0-10,
  "feltQuality": 0-100
}

Key ideas:
Medication behavior varies daily
Effectiveness is primarily defined as felt capacity for sustained focus
However, actual productivity is also considered
Important nuance:
If focus capacity is high but productivity is low, this indicates interference from other factors (e.g., mood, stress, fatigue)
Effectiveness is therefore a combination of:
perceived ability to focus
actual ability to act on that focus

Medication Skipping
{
  "skippedMedication": true,
  "reasons": ["low energy", "emotional state", "light workload", "intentional rest"]
}

System learns:
when medication is helpful
when it is unnecessary
when it may be ineffective due to internal state

Sleep
{
  "hours": number,
  "state": "sleepy | tired | normal | high energy"
}

Naps
{
  "start": "...",
  "end": "...",
  "duration": minutes,
  "feltRestedAfter": 0-100
}

System learns:
when naps are beneficial
how naps affect recovery and productivity
when a nap is likely to improve capacity during low-energy states

Nutrition (Protein-Focused)
{
  "time": "...",
  "protein": grams
}

Tracks:
total intake
timing relative to medication

Alcohol
timestamped events
System behavior:
triggers next-day low-capacity mode
suggests low-effort tasks (self-care, chores, passive activities)
evaluates future workload to determine when drinking is "safe"

Productivity and Tasks
{
  "taskId": "...",
  "category": "school | personal | social | chores | creative",
  "effortWeight": 1-5,
  "completed": true,
  "timeSpent": minutes,
  "timesPostponed": number
}

effortWeight represents estimated cognitive load on a 1–5 scale.
The system computes total planned load per day by summing effort weights.
This is compared against that day's capacity to determine whether postponements reflect avoidance or over-scheduling.

Categories are sourced from Google Calendar.
Tracks:
actual output
avoidance vs. over-scheduling patterns
mismatch between capacity and execution
the user's sustainable load ceiling per capacity level and task category mix

Schedule (Google Calendar Integration)
Imported data:
event type (class, social, chore, etc.)
duration
rescheduling behavior (postponements)
Used to learn:
energy cost of different activity types
effect of social events on same-day and next-day productivity
workload density and overload patterns


Core System Components

1. Capacity Model
Represents what the user is realistically capable of in a given day.
Inputs:
sleep
mood
stress
medication effect
protein timing
cycle phase
alcohol effects
previous-day emotional carryover

2. Productivity Model
Tracks:
completed work
time spent
postponement behavior — interpreted in context of planned load vs capacity

Key Distinction
Capacity = what the user could do
Productivity = what the user did
Planning accuracy = whether the amount planned was realistic given capacity
The gap between capacity and productivity is meaningful, but only after accounting for whether the planned load was achievable in the first place.

3. Learning System (Adaptive Weights)
The system does not rely on fixed rules.
Instead, it learns relationships between inputs and outcomes.
Example model:
predictedProductivity =
  w1 * sleep +
  w2 * mood +
  w3 * stress +
  w4 * medEffect +
  w5 * protein +
  ...

Weights are updated over time:
error = actual - predicted
w += learningRate * error * feature

This allows the system to learn:
how strongly each factor affects the user
how interactions between variables impact outcomes

4. Medication Pattern Learning
Learns:
actual onset, peak, and duration (averaged and contextualized)
how sleep, protein timing and amount, stress, and cycle phase affect medication
Example insights:
"Medication onset is delayed when sleep is low"
"Protein intake before medication improves effectiveness"

5. Emotional Carryover System
Detects:
low night mood → reduced next-day capacity
Learns:
how long negative emotional states persist
patterns indicating potential depressive slumps
abnormal increases in stress or sadness

6. ADHD Stress Curve
Models:
low stress → low output
moderate stress → optimal output
high stress → shutdown
Learns:
the user's optimal stress range

7. Risk Detection System
Pattern-based, not clinical.
Signals include:
rapid mood drops
stress spikes
overload patterns
low productivity streaks
Outputs:
"low state detected"
optional support prompts

8. Task Adaptation System
Learns:
which task types are feasible under different conditions
which combinations of task categories exceed the user's cognitive load ceiling at a given capacity level
Examples:
low mood → chores or low-effort tasks are feasible
after social events → reduced next-day output
high capacity but mix of 3+ heavy categories → still likely to over-schedule

9. Alcohol Planning System
Determines when drinking is appropriate based on:
upcoming workload
predicted next-day capacity
Outputs:
safe low-impact days
warnings for high-risk days

10. Nap Prediction System
Learns:
when naps are likely needed
how naps affect recovery and productivity
Suggests:
optimal nap timing during low-capacity states

11. Prediction System
Estimates future capacity levels based on recent logs, detected patterns, and adaptive weights.
Prediction range is open-ended — the system predicts as far into the future as the data supports.
Short-range predictions (next day) are more confident.
Longer-range predictions become available as patterns stabilize over time.
Predictions include:
expected capacity score
contributing factors pulling the score up or down
suggested task types appropriate for the predicted state
planning guidance (e.g. flag days where planned load may exceed predicted capacity)


Visualization and Dashboard

1. Capacity Gauge
current and predicted capacity

2. Time Series Graphs
mood, stress, sleep over time

3. Medication Curve
personalized onset, peak, and decline
can optionally incorporate protein timing and amount

4. Stress vs Productivity Scatter Plot
visualizes the user's optimal stress zone

5. Correlation Heatmap
shows relationships between variables

6. Pattern Insights Panel
Examples:
"You tend to crash after 4 high-output days"
"Social days reduce next-day productivity by X%"
"Days where planned load exceeded capacity by 2+ tasks show no increase in avoidance — you just over-planned"


Key Insights Enabled
When medication is actually effective for the user
When medication may not be necessary or useful
Causes of burnout cycles
Which tasks are realistic under different conditions
Interactions between sleep, mood, stress, and nutrition
When to rest versus push
When it is safe to drink or socialize without impacting productivity
Whether repeated deferrals reflect avoidance or chronic over-scheduling
The user's sustainable cognitive load ceiling at different capacity levels


Final Goal
This system does not aim to:
optimize productivity blindly
enforce consistency
punish deferrals without context

It aims to:
help the user understand patterns, capacity, and limits
support decisions based on realistic conditions rather than guilt
distinguish between "I avoided this" and "I planned too much" — because those require completely different responses

Summary
This is a:
behavior-aware
biology-aware
adaptive learning system

It evolves with the user and reflects:
how the user actually functions
rather than:
how they are expected to function
```
\
\
**Me:** With these project and tech stack requirements, can you make a plan for me?

```
1. Required Tech Stack (Course Compliance)

Frontend
Vue 3 (Vite, Options API)
Vue Router 4
Pinia (state management)

Backend
Node.js
Express.js

Database
MongoDB Atlas
Mongoose

Deployment
Frontend: GitHub Pages
Backend: Railway

Version Control
Git + GitHub (incremental commits required)

Authentication
Not used (single-user system, allowed by requirements)


2. Core System Features

2.1 Daily Logging System
Users can create, read, update, and delete daily logs containing:
mood (multiple entries per day)
stress (multiple entries)
sleep (hours + state)
medication (timing + perceived effect)
protein intake (time + amount)
naps
alcohol flag
cycle day (optional)
This is the primary data source for all analysis.

2.2 Task and Productivity System
Users can:
create tasks with a category and estimated effort weight (1–5 cognitive load scale)
mark tasks complete
track time spent
track number of postponements

The system computes total planned cognitive load per day by summing effort weights.
This is compared against that day's capacity score to classify postponements:
If load > realistic capacity → over-scheduling flag (not a productivity failure)
If load was achievable but tasks were still deferred → avoidance signal

This distinction is surfaced in insights and used to improve prediction accuracy over time.
The system also learns the user's sustainable load ceiling per capacity level and per task category mix, since cognitive load varies by type of work, not just time spent.

2.3 Capacity Engine (Backend Logic)
The backend computes a daily capacity score using logged data.
Initial approach:
combine sleep, mood, stress, medication, and other factors
use a weighted formula
This is the main "real logic" of the application.

2.4 Pattern and Insights System
The backend analyzes historical data to generate insights such as:
relationships between sleep and productivity
impact of stress on task completion
trends in postponement behavior — split by avoidance vs. over-scheduling
repeated cycles (e.g., burnout patterns)
medication effectiveness patterns
cognitive load ceiling by capacity level
Outputs are returned as readable insights.

2.5 Prediction System
The system estimates future capacity levels based on recent logs, detected patterns, and adaptive weights.
Prediction range is open-ended — the system predicts as far into the future as the data supports.
Short-range predictions (next day) are more confident and always available.
Longer-range predictions become available as patterns stabilize.
Each prediction includes:
expected capacity score
contributing factors pulling the score up or down
suggested task types for that capacity level
planning guidance (flags days where intended load may exceed predicted capacity)

2.6 Advanced Features (planned, built after core is stable)
adaptive weight updates (learning system)
medication pattern analysis
Google Calendar integration

2.7 Optional Features (if time allows)
alcohol planning insights
nap suggestions


3. Database Design

Collection: dailyLogs
{
  "date": "YYYY-MM-DD",
  "sleep": {
    "hours": number,
    "state": "sleepy | tired | normal | high energy"
  },
  "moodLogs": [
    { "time": "...", "value": number }
  ],
  "stressLogs": [
    { "time": "...", "value": number }
  ],
  "medication": {
    "takenAt": "...",
    "feltOnset": "...",
    "feltPeak": "...",
    "feltEnd": "...",
    "focusCapacityHours": number,
    "feltQuality": number,
    "skipped": boolean,
    "skipReasons": [string]
  },
  "proteinLogs": [
    { "time": "...", "grams": number }
  ],
  "naps": [
    { "start": "...", "end": "...", "rested": number }
  ],
  "alcohol": boolean,
  "cycleDay": number
}

Collection: tasks
{
  "title": string,
  "category": string,
  "date": "YYYY-MM-DD",
  "effortWeight": number,
  "completed": boolean,
  "timeSpent": number,
  "timesPostponed": number
}

effortWeight is a 1–5 scale representing estimated cognitive load.
The sum of effort weights for a given day is compared against that day's capacity score to determine whether postponements reflect avoidance or over-scheduling.


4. Backend Architecture

Route Structure
Logs:
POST /logs
GET /logs
PUT /logs/:id
DELETE /logs/:id

Tasks:
POST /tasks
GET /tasks
PUT /tasks/:id
DELETE /tasks/:id

Analysis:
GET /capacity
GET /insights
GET /prediction

Service Layer (Important for Code Quality)
Create a /services folder:
capacityService.js
patternService.js
predictionService.js
insightService.js

Each service handles logic separately from routes.
insightService distinguishes avoidance from over-scheduling when analyzing postponement data.
predictionService outputs predictions at multiple time horizons, with confidence levels that reflect data density.


5. Frontend Structure

Pages (Vue Router)
Dashboard
Daily Log Page
Tasks Page
Insights Page
Prediction Page
History Page

State Management (Pinia)
Stores:
logs
tasks
capacity
insights

Components
Logging:
MoodInput
StressInput
SleepInput
MedicationForm
ProteinInput
NapInput

Display:
CapacityDisplay
TaskList
InsightList
Graph components


6. Full Data Flow
User enters data in frontend
Vue sends request to Express API
Express stores data in MongoDB
Backend services compute:
capacity
planned load vs capacity comparison
insights (including avoidance vs over-scheduling classification)
predictions across available time horizons
Frontend fetches updated results
UI updates dynamically
Data persists across refreshes and server restarts.


7. Development Plan (4 Weeks)

Week 1 — Foundation
Set up repositories (frontend + backend)
Connect MongoDB Atlas
Create Mongoose schemas (including effortWeight on tasks)
Implement CRUD routes for logs and tasks
Test with Thunder Client

Week 2 — Frontend Integration
Set up Vue project (Vite)
Configure Vue Router
Configure Pinia
Build logging UI
Connect frontend to backend API
Ensure full CRUD works end-to-end

Week 3 — Core Logic
Implement capacityService
Implement planned load computation and avoidance vs over-scheduling classification
Implement basic pattern detection
Create insights endpoint
Build dashboard UI (capacity + basic graphs)

Week 4 — Advanced Features and Polish
Add prediction system (next-day + extended range where data supports)
Improve insights quality
Add visualizations (charts/graphs)
Handle loading, empty, and error states
Make UI responsive (mobile)
Deploy frontend (GitHub Pages)
Deploy backend (Railway)


8. How This Meets Grading Criteria

Functionality:
Multiple working features (logs, tasks, capacity, insights, prediction)
Data persists in MongoDB
Full CRUD implemented

Code Quality:
Clear separation of concerns (routes vs services)
Organized Vue components
Clean project structure

UI/UX:
Multiple pages
structured layout
responsive design
meaningful data visualization

Deployment:
frontend and backend publicly accessible
clear README with setup instructions


9. Final Positioning
This project is not a simple task tracker.
It is a system that:
models fluctuating human capacity
learns from behavioral data
provides insights grounded in real patterns
distinguishes between avoidance and over-scheduling when interpreting task deferrals
predicts future capacity across multiple time horizons as data accumulates

The goal is to help users understand:
what they are capable of
how different factors affect them
whether they are avoiding tasks or simply planning too much
how to make better decisions based on that understanding
```
---
## Reflection
**What did the AI challenge or change in your thinking? Did it suggest anything you ended up using? Did it push back on anything you disagreed with, and were you right to disagree?**

The AI helped me realize that my original idea was too large and needed to be structured more realistically. It suggested breaking the system into a clear core (logs, tasks, and capacity calculation) with optional advanced features instead of trying to build everything at once. It also recommended simplifying or delaying complex parts like full machine learning and Google Calendar integration, which I initially disagreed with because I wanted the full vision. However, I understood that focusing on a solid, working core first would make the project more successful. I ended up using its advice on structuring the backend into services and defining clearer data models.
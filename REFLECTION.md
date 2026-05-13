### Q1 — Scope decisions
1. Compare your original BRIEF.md feature list to what you actually built. What did you cut, add, or change, and why?

The biggest structural change from the brief was replacing manual task creation with Google Calendar sync entirely. Since I already log everything in GCal, building a separate task UI would have meant entering the same data twice. The task categories also to map directly to my actual GCal calendar names.

`medication.feltQuality` was cut and replaced with two categorical fields: `medQuality` and `focusQuality`. A 0–100 numeric scale felt too vague to score consistently so I decided that categorical labels like "lightly felt" or "locked-in" are clearer and easier to pick accurately in the moment.

Protein logging and `cycleDay` from the original data model were not added once the scope of the ML side became clear.

What grew significantly beyond the original scope was the intelligence layer. The brief described a weighted capacity formula and basic pattern insights. What was actually built includes an end-of-day self-rating field (`actualCapacityRating`) as the ML feedback signal, a Pearson correlation engine running across the variables, and a calibration system that updates factor weights in the database based on how well predictions matched self-ratings. None of this was in the original brief.

`moodLogs` and `stressLogs` also gained a `reason` field grouped into internal, physical, and external categories, which feeds into the correlation engine and makes pattern insights more meaningful.

### Q2 — Technical challenge
2. Describe the single hardest technical problem you encountered. What was the error or obstacle, and how did you resolve it?

The hardest ongoing challenge was auditing, correcting, and abstracting AI-generated code. Individual pieces often worked in isolation but introduced problems at the system level. The same helper functions (`avg()`, `pearson()`) and the score maps used to convert enum values to numbers were duplicated across different service files. This meant a bug fix or logic change in one place had no effect on the others.

The solution required going through every service file, identifying what was duplicated, and extracting shared logic into proper utility modules like `utils/math.js` for the core math functions, `utils/scoreMaps.js` for the score maps used by both the capacity service and the correlation engine, and `utils/reasonMap.js` for categorising mood and stress reasons. The three nearly-identical subdocument `DELETE` handlers in the logs route were also consolidated into a single factory function rather than repeated three times.


### Q3 — AI and vibe-coding
3. Reflect on your use of Claude Code during development. Give two specific examples: one where the AI output worked well with minimal changes, and one where you had to significantly debug or rewrite what it gave you. What did you learn from the difference?
It worked well for styling the frontend. I had difficulty settling on a color palette and kept changing the root CSS variables. Rather than naming variables semantically (like `--primary-text` or `--background`), I named them by color (like `--light-pink`, `--dark-blue`). This let me freely reassign any element to any color without having to remember what a semantic variable was supposed to represent so I could just swap `--light-pink` into a heading and immediately see how it looked. The AI handled all the variable replacement across the stylesheet each time I changed direction, which would have been tedious to do manually. It was helpful when I wanted its suggestions on where to use my colors and identify any unused variables.

Where I had to significantly rewrite code was with the correlation engine producing circular results. Variables that were direct inputs to the capacity score were being correlated with the score itself. The capacity score was confirmed as normalized multiple times before it dawned on me that individual factors were normalized but the total sum was not.

The main lesson was that AI-generated code has to be verified against actual output, cross-referenced across all the files it touches, and refactored aggressively when the same logic appears more than once. What this showed was that AI output needs to be tested against real data, not just reviewed for syntactic correctness since code can look right and still produce wrong results. This is something I check when coding by myself, but ended up being too trusting and assumed it wouldn't be a problem here. I also learned of its habit to duplicate code and not abstract things when they should be, which led me to do that part myself.

### Q4 — Architecture
4. Explain how data flows through your application for one specific user action — from the moment the user clicks something, through the front-end, the API, the database, and back to the screen.

When a user logs a mood entry, they select a mood state and optionally one or more reasons in `RestMoodView.vue`, then click Save. The component calls `saveMood()` in the Pinia logs store, passing today's date and the entry data.

The store first attempts a `POST` to `/api/logs` with `{ date, moodLogs: [entry] }`. If the server returns a 400 error the store fetches the existing log to get its `_id`, appends the new entry to the existing `moodLogs` array, and sends a `PUT` to `/api/logs/:id` with the full updated array.

On the backend, `routes/logs.js` calls `DailyLog.findByIdAndUpdate()` with `{ new: true, runValidators: true }`. The `new: true` option tells Mongoose to return the updated document rather than the original. The `runValidators` flag ensures enum constraints are enforced on update, not just on creation. Mongoose sends the update to MongoDB Atlas, which returns the updated document. The route sends it back as JSON, the store updates `todayLog` in local state, and Vue's reactivity system re-renders the entries list immediately to show the new entry.

### Q5 — If you had two more weeks
5. What would you add or improve first, and what technical approach would you use?

The first priority would be making the `HistoryView.vue` and adding a feature to change logs from previous days. This is important to me because it is harder to log things in the evening when out, so retroactive editing is necessary for the data to stay accurate. It would also let me review how previous days actually felt, which is part of the point of the app.

The technical approach would be a date picker in `HistoryView` that sets the selected date in component state. On change, it calls `fetchTodayLog(selectedDate)` from the logs store and passes that date into the existing form components. The backend already accepts any date on all log endpoints, so no backend changes would be needed. The main frontend work would be making the logging forms reusable with a passed-in date rather than always defaulting to today.

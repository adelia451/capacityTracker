# Capacity Tracker

A personal adaptive capacity tracking app that models what you were *realistically capable of* on any given day, rather than measuring output against a fixed standard. Built originally for ADHD management, but useful for anyone whose daily capacity varies: people on medication that affects focus or energy, anyone tracking mental or physical health patterns, or anyone who wants a more honest measure of their days than a task completion rate.

## Links

**Site:** https://capacity.mimobox.sh/

**Front-end Repository:** https://github.com/adelia451/capacityTracker/

**Back-end Repository:** https://github.com/adelia451/capacityTracker-server

---

## What it does

- Logs daily biological and behavioral data: sleep, mood, stress, medication timing and effectiveness, naps, and alcohol intake
- Syncs tasks from Google Calendar and tracks effort weights, deferrals, and time worked per category
- Computes a daily capacity score from logged inputs using a weighted formula
- Learns your personal patterns over time using a Pearson correlation engine across 40+ variables at lag 0, 1, and 2 days
- Surfaces readable insights and discovered correlations from your historical data
- Predicts next-day capacity based on recent trends

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3, Vite, Vue Router 4, Pinia |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Deployment | DigitalOcean, nginx (reverse proxy), PM2 |

---

## Running locally

See [STEP-BY-STEP-GUIDE.md](STEP-BY-STEP-GUIDE.md) for full setup instructions.

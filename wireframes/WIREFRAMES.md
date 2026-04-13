
# WIREFRAMES.md

Wireframe images were created using the FigmaAI tool to visualize layout, UI elements, and page structure. These are not final designs, but structural references for when I start designing. It did not generate any HTML/CSS. 

--- 

 ## Top Navigation
 Buttons: 
[Home] [Capacity] [Rest&Mood] [Med&Intake] [Tasks] [History] 


**Navigation:** 
- Tap "Capacity" in nav → goes to Capacity Page
- Tap "Rest&Mood" in nav → goes to Rest & Mood Page
- Tap "Med&Intake" in nav → goes to Med & Intake Page
- Tap "Tasks" in nav → goes to Tasks Page
- Tap "History" in nav → goes to History Page

---

## HOMEPAGE
**Panes:** Today, Insights, Prediction

**UI elements:** 
- Today: Capacity score, Medication curve OF THE DAY, Task checklist (today + next 2 days)
- Insights: Capacity over time graph, mood over time graph, stress over time graph
- Prediction: Tomorrow's predicted capacity score

**Navigation:** Nav bar → any other screen

--- 

## CAPACITY 
**Panes:** Today's Capacity, Future Predictions

**UI elements:** 
- Today's Capacity: Capacity score, List of factors affecting capacity
- Future Predictions: Tomorrow's predicted capacity score, List of factors affecting capacity

**Navigation:** Nav bar → any other screen

---

## REST & MOOD PAGE
**Panes:** Sleep (default view), Mood, Stress, Naps

**UI elements:** 
- Sleep: Selection of sleep/tired/normal/energized, Save Entry button
- Mood: Mood slider, Mood Entry button, List of today's entries with times
- Stress: Stress slider, Stress Entry button, List of today's entries with times
- Naps: Enter start time, enter end time, Selection of sleep/tired/normal/energized (for how I felt after nap), List of today's entried with times 

**Navigation:** 
- Tabs switch between Sleep/Mood/Stress/Naps panes
- Nav bar → any other screen

---

## MEDICATION & INTAKE PAGE
**Panes:** Medication (default view), Medication (skipped), Protein, Alcohol

**UI elements:** 
- Medication (defualt view): Select taken or skipped, Enter time, Enter onset time, Enter peak time, Enter end time, Focus quality slider, Focus capacity (Enter hours), Medication graph of AVERAGE PATTERN

- Medication (skipped): Checklist to select reason, Medication graph of AVERAGE PATTERN

- Protein: Text enter grams, Text enter time, Add entry button, List of today's entries with times, Today's total intake
- Alcohol: Yes/No selection, Save button 

**Navigation:** 
- Tabs switch between Medication, Protein, Alcohol
- If skipped medication you get another pane
- Nav bar → any other screen

---

# TASKS PAGE
**Panes:** Capacity & Planned Load, Add New Task, Tasks for Today, Postponement Pattern

**UI elements:** 
- Capacity & Planned Load: Capacity score, Planned load score, Notice if under or over capacity by X points
- Add New Task: Enter text Title, Dropdown Category, Effort buttons 1/2/3/4/5, Add Task button
- Tasks for Today: Check box for completion
- Postponement Pattern: Shows amount of tasks avoided and amount over-scheduled

**Navigation:** 
- Date selector → changes tasks for selected date
- [Complete] button → marks task done, adds to history
- [Log Time] → opens modal to input time spent
- [Defer →] → moves task to next day, increments postponement count
- Nav bar → any other screen

--- 

## HISTORY PAGE
**Panes:** Each day

**UI elements:** 
- filter for date
- extending/collapsing feature for each day with yesterday at the top
- Each day lists something like: 

```
 ▼ April 11, 2026                     
 Capacity: 6.3                      
 6h sleep • medicated • social event

FULL LOG: (If you extend)                        
- Sleep: 6h, woke up tired           
- Medication: Taken at 9:15 AM       
- Focus: 4.5h capacity, quality 6/10 
- Mood: Avg 6.5/10                   
- Stress: Avg 4/10                   
- Tasks: 4 completed, 2 deferred     
- Protein: 85g total                
- Alcohol: No        
```

**Navigation:** 
- (collapsed) → tap to expand and show full log detail
- (expanded) → tap to collapse back to summary
- Date filter → changes which days are shown
- Nav bar → any other screen


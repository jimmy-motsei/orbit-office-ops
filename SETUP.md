# Orbit Project - Setup Guide

## ✅ What's Been Built

### Phase 1: Infrastructure ✓

**1. Next.js 15 Application**
- ✓ App Router configured
- ✓ TypeScript enabled
- ✓ Tailwind CSS integrated
- ✓ ESLint configured

**2. Database Schema (Supabase)**
- ✓ `emails` table - Stores email metadata from multiple inboxes
- ✓ `rules` table - Stores filtering criteria from Apple Reminders
- ✓ `tasks` table - AI-processed tasks with time estimates and priorities
- ✓ `schedule_blocks` table - Scheduled time slots for tasks
- ✓ `availability_blocks` table - User's working hours
- ✓ `sync_logs` table - Tracks Apple Reminders sync history

**3. Core Scheduler Engine** (`lib/scheduler/schedulerEngine.ts`)
- ✓ Urgency calculation: `(Priority * 0.6) + ((1 / DaysUntilDue) * 100 * 0.4)`
- ✓ Bin-packing algorithm for optimal task placement
- ✓ Lead-time buffer enforcement
- ✓ Automatic task splitting (>120min tasks split into 30+ min chunks)
- ✓ Capacity tracking and utilization stats

**4. Apple Reminders Bridge**
- ✓ Python script (`scripts/reminders_bridge.py`) using AppleScript
- ✓ API endpoint (`/api/sync-rules`) with Bearer token authentication
- ✓ Automatic upsert logic (update existing, insert new)
- ✓ Sync logging for audit trail

---

## 🚀 Next Steps

### Step 1: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your credentials from Project Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (from Service Role section)

3. Run the database migration:
   ```bash
   # In Supabase SQL Editor, run:
   supabase/migrations/001_initial_schema.sql
   ```

### Step 2: Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   SUPABASE_SERVICE_ROLE_KEY=eyJh...
   OPENAI_API_KEY=sk-...
   API_SECRET_KEY=your-secret-password-here
   ```

### Step 3: Test the Scheduler Engine

Run the development server:
```bash
npm run dev
```

You can test the scheduler logic directly:
```typescript
import { scheduleTasks, generateDefaultAvailability } from '@/lib/scheduler/schedulerEngine';

const tasks = [
  {
    id: '1',
    estimated_minutes: 120,
    deadline_date: '2025-12-15T17:00:00Z',
    priority_score: 85,
    lead_time_buffer_days: 2,
    task_title: 'Q4 Report'
  }
];

const availability = generateDefaultAvailability();
const result = scheduleTasks(tasks, availability);

console.log('Schedule:', result.schedule);
console.log('Unscheduled:', result.unscheduled);
```

### Step 4: Set Up Apple Reminders Bridge

1. Create a Reminders list called **"Orbit Rules"** in Apple Reminders

2. Add test rules (format: Title = Rule Name, Notes = Logic):
   ```
   Title: "High Value Clients"
   Notes: "If sender domain is @tesla.com, set priority to 100"
   
   Title: "Deep Work"
   Notes: "If body contains 'strategy' or 'planning', set lead_time to 3 days"
   ```

3. Set up Python environment:
   ```bash
   cd scripts
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Create `.env` file in `scripts/`:
   ```env
   VERCEL_API_URL=http://localhost:3000/api/sync-rules
   API_SECRET_KEY=your-secret-password-here
   ```

5. Run the bridge script:
   ```bash
   python reminders_bridge.py
   ```

   You should see:
   ```
   🚀 Orbit Reminders Bridge started
   🔄 Starting sync at 2025-12-10 10:30:00
   📋 Found 2 reminders
   📤 Syncing 2 rules to http://localhost:3000/api/sync-rules...
   ✅ Sync successful: Successfully synced 2 rules
   ⏳ Next sync in 30 minutes
   ```

### Step 5: Verify Database

Check Supabase Table Editor:
- Navigate to `rules` table
- You should see your synced rules

---

## 📋 What's Still TO DO

### Phase 2: Email Integration
- [ ] Gmail API connector
- [ ] Outlook/Microsoft Graph connector
- [ ] OAuth2 authentication flow
- [ ] Cron job for email ingestion (every 30 min)

### Phase 3: AI Processing
- [ ] OpenAI integration for email classification
- [ ] Prompt engineering for time estimation
- [ ] Deadline extraction from email context
- [ ] Priority scoring logic

### Phase 4: Frontend Dashboard
- [ ] Week view calendar UI
- [ ] Task cards with visual time blocks
- [ ] Drag-and-drop rescheduling
- [ ] Capacity warning indicators
- [ ] Task completion tracking

### Phase 5: Calendar Integration
- [ ] Google Calendar sync
- [ ] Apple Calendar sync
- [ ] Create events from scheduled tasks

---

## 🧪 Testing the Current Build

### Test the API Endpoint

```bash
curl -X POST http://localhost:3000/api/sync-rules \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-password-here" \
  -d '{
    "sync_timestamp": "2025-12-10T10:30:00Z",
    "rules": [
      {
        "rule_name": "Test Rule",
        "criteria_logic": "If email contains urgent, priority = 90",
        "source_id": "test-123"
      }
    ]
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Successfully synced 1 rules",
  "processed": 1,
  "timestamp": "2025-12-10T10:30:00Z"
}
```

---

## 🎯 Key Design Decisions

1. **Why Supabase?**
   - Real-time subscr for live updates
   - Built-in authentication
   - PostgreSQL = powerful querying
   - Generous free tier

2. **Why AppleScript for Reminders?**
   - No official Reminders API
   - EventKit (Python) is unstable due to macOS sandboxing
   - AppleScript is native and reliable

3. **Why Split Tasks >120min?**
   - Prevents burnout
   - Allows flexibility (can complete partial work)
   - Improves schedule utilization

4. **Why Lead-Time Buffers?**
   - "Deadline" ≠ "When to start"
   - Builds in safety margin
   - Prevents last-minute panic

---

## 🐛 Troubleshooting

### Python Bridge Issues

**Error: `ModuleNotFoundError: No module named 'requests'`**
- Solution: `pip install -r requirements.txt`

**Error: `ValueError: VERCEL_API_URL environment variable is required`**
- Solution: Create `.env` file in `scripts/` directory

**Reminders not syncing**
1. Check Reminders list name (must be exactly "Orbit Rules")
2. Grant Terminal/Python permission to access Reminders (System Settings → Privacy)
3. Check API logs in Supabase for errors

### API Route Issues

**401 Unauthorized**
- Ensure `API_SECRET_KEY` matches in both `.env.local` and Python `.env`

**Database connection errors**
- Verify Supabase credentials
- Check if migrations were run successfully

---

## 📚 Next Prompt Suggested

**For Email Integration:**
```
Role: Backend API Developer

Task: Create a Vercel Serverless function at app/api/ingest-email/route.ts

Requirements:
- Accept POST requests from a cron job
- Use Gmail API to fetch unread emails from the last 30 minutes
- Parse sender, subject, and body snippet
- Store in Supabase 'emails' table with is_processed = false
- Return count of new emails ingested
```

**For AI Classification:**
```
Role: AI Integration Specialist

Task: Create a TypeScript module at lib/ai/emailClassifier.ts

Requirements:
- Accept an email object and rules array
- Use OpenAI GPT-4o to analyze the email
- Extract: estimated_minutes, priority_score, deadline_date, lead_time_buffer_days
- Return structured JSON with reasoning
- Handle rate limits and errors gracefully
```

---

## Files Created

```
orbit-office-ops/
├── README.md
├── SETUP.md (this file)
├── .env.example
├── app/api/sync-rules/route.ts
├── lib/
│   ├── supabase/client.ts
│   └── scheduler/schedulerEngine.ts
├── scripts/
│   ├── reminders_bridge.py
│   └── requirements.txt
└── supabase/migrations/001_initial_schema.sql
```

**Total Lines of Code:** ~1,100+  
**Commit:** `66ea0b9` - "feat: Initial Orbit setup..."

---

Ready to proceed with Email Integration or AI Processing! 🚀

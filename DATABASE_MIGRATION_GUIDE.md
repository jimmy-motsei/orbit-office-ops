# 🗄️ Database Migration - Quick Guide

**Time:** 5 minutes
**Goal:** Create 7 database tables in Supabase

---

## Step 1: Open Supabase SQL Editor

1. **Go to:** https://supabase.com
2. **Click** your project: `orbit-office-ops` (or `epfxlsagatrojkxzmqes`)
3. In left sidebar, **click:** "SQL Editor"
4. **Click:** "New Query" button

---

## Step 2: Copy the Migration SQL

**Open this file in your editor:**
```
/Users/ramoloimotsei/orbit-office-ops/supabase/migrations/001_initial_schema.sql
```

**Select ALL the contents** (Cmd+A) and **copy** (Cmd+C)

---

## Step 3: Paste and Run

1. **Paste** the SQL into the Supabase SQL Editor
2. **Click** the "Run" button (or press Cmd+Enter)
3. **Wait** for execution (5-10 seconds)

---

## Expected Result

You should see:
✅ **"Success. No rows returned"**

This creates 7 tables:
- `emails` - Stores email metadata
- `rules` - Filtering criteria from Apple Reminders
- `tasks` - AI-processed tasks
- `schedule_blocks` - Scheduled time slots
- `availability_blocks` - Available working hours
- `sync_logs` - Sync history
- Plus triggers for auto-updating timestamps

---

## Step 4: Verify Tables Created

1. In left sidebar, **click:** "Database"
2. **Click:** "Tables"
3. **Verify** you see all 7 tables listed

---

## If You See Errors

**Error: "relation already exists"**
- Tables already exist → **This is OK!**
- The migration uses `CREATE TABLE IF NOT EXISTS`
- Safe to run multiple times

**Other errors:**
- Copy the error message
- Share it with me
- We'll fix it together

---

## ✅ Success = All Tables Created!

Once you see the 7 tables, you're done!

**Next step:** Visit your production URL and test the dashboard! 🚀

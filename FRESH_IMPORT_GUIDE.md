# 🚀 Phase 2: Fresh Import - Quick Guide

**URL to Open:** https://vercel.com/new

---

## Step 1: Import Repository

1. **Go to:** https://vercel.com/new
2. **Look for:** "Import Git Repository" section
3. **Find:** `jimmy-motsei/orbit-office-ops`
4. **Click:** "Import" button

If you don't see it:
- Click "Add GitHub Account"
- Select the repository
- Click "Import"

---

## Step 2: Configure Project

Once the import screen opens:

**Project Name:** Leave as `orbit-office-ops` (or customize)

**Framework Preset:** Next.js (auto-detected) ✅

**Root Directory:** `./` (leave as default)

**Build & Output Settings:** Leave as default

---

## Step 3: Add Environment Variables (CRITICAL!)

**Before clicking Deploy**, expand the **"Environment Variables"** section.

Add all 6 variables below (copy-paste exactly):

---

### **Variable 1:**
**Name:** `NEXT_PUBLIC_SUPABASE_URL`
**Value:** 
```
https://epfxlsagatrojkxzmqes.supabase.co
```
Click **"Add"**

---

### **Variable 2:**
**Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Value:** 
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZnhsc2FnYXRyb2preHptcWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTYwMjAsImV4cCI6MjA4MDkzMjAyMH0.UTI90YvtIVCbxSxFR5sE3oF4NuCULzVQYiLh-ui4vWE
```
Click **"Add"**

---

### **Variable 3:**
**Name:** `SUPABASE_SERVICE_ROLE_KEY`
**Value:** 
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwZnhsc2FnYXRyb2preHptcWVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM1NjAyMCwiZXhwIjoyMDgwOTMyMDIwfQ.QaToDTb09zWJDH95OkeErVO7nqGQGx3mJzAVtdG2tqI
```
Click **"Add"**

---

### **Variable 4:**
**Name:** `GOOGLE_API_KEY`
**Value:** 
```
AIzaSyAcWneTlMBryrN5x42IVGtUL0yNA3YJC4g
```
Click **"Add"**

---

### **Variable 5:**
**Name:** `API_SECRET_KEY`
**Value:** 
```
vSsZHFOjqC+ot9cd4yx//A7L/EyHoUQ8M+FbyWgMg0c=
```
Click **"Add"**

---

### **Variable 6:**
**Name:** `CRON_SECRET`
**Value:** 
```
87asE7r4fOVHlN9CexNEvfP0BPIc+mXAOZ53IqDmBYk=
```
Click **"Add"**

---

## Step 4: Deploy!

1. **Verify:** All 6 variables are added
2. **Click:** Big blue "Deploy" button
3. **Wait:** 2-3 minutes for build

---

## Step 5: Watch Build

- You'll see build logs in real-time
- Look for: ✅ "Build Completed"
- If errors appear, let me know immediately

---

## Success = Production URL Live!

Once build completes:
- You'll get: `https://orbit-office-ops.vercel.app`
- Dashboard will be accessible
- We'll run database migration next

---

**Start at:** https://vercel.com/new 🚀
